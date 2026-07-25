import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SIZE_LABELS: Record<string, string> = {
  under1500: 'under 1,500 sq ft',
  '1500-2500': '1,500–2,500 sq ft',
  '2500-3500': '2,500–3,500 sq ft',
  '3500plus': 'over 3,500 sq ft',
};

// Direct lookup of installed roof replacement cost by home size and material,
// Arizona 2026 market ranges. Replaces the old per-sqft * pitch formula, which
// overshot badly at the high end (a large premium tile roof computed to
// $100k-$182k). Each range already spans standard-to-premium materials, so the
// low/high here are the final output figures — no further multiplier applied.
const COST_TABLE: Record<string, Record<string, { low: number; high: number }>> = {
  under1500: {
    shingle: { low: 7000,  high: 14000 },
    tile:    { low: 10000, high: 20000 },
    foam:    { low: 4000,  high: 8000  },
    metal:   { low: 8000,  high: 16000 },
  },
  '1500-2500': {
    shingle: { low: 8000,  high: 18000 },
    tile:    { low: 12000, high: 25000 },
    foam:    { low: 5000,  high: 10000 },
    metal:   { low: 10000, high: 20000 },
  },
  '2500-3500': {
    shingle: { low: 14000, high: 25000 },
    tile:    { low: 20000, high: 35000 },
    foam:    { low: 8000,  high: 15000 },
    metal:   { low: 16000, high: 28000 },
  },
  '3500plus': {
    shingle: { low: 20000, high: 35000 },
    tile:    { low: 28000, high: 50000 },
    foam:    { low: 12000, high: 22000 },
    metal:   { low: 22000, high: 40000 },
  },
};

const ROOF_LABELS: Record<string, string> = {
  shingle: 'asphalt shingle',
  tile: 'tile',
  foam: 'flat/foam (SPF)',
  metal: 'metal',
};

const TIER_LABELS: Record<string, string> = {
  standard: 'standard',
  mid: 'mid-grade',
  premium: 'premium',
};

// Absolute last-resort ranges by home size, used only if the inputs are so
// malformed that we cannot look up a real range (bad size key, unexpected
// throw). Keeps the UI rendering a sane number instead of a 500.
const STATIC_FALLBACK: Record<string, { low: number; high: number }> = {
  under1500:   { low: 7000,  high: 16000 },
  '1500-2500': { low: 8000,  high: 20000 },
  '2500-3500': { low: 14000, high: 35000 },
  '3500plus':  { low: 20000, high: 50000 },
};
const DEFAULT_FALLBACK = { low: 8000, high: 20000 };
const FALLBACK_NOTE =
  'Estimate based on current Arizona market ranges. Get a free quote for your specific roof.';

// 24h in-memory cache of the AI explanation, keyed by the inputs that change it
// (home size + material + tier). Most visitors pick similar options, so this
// serves the large majority of requests without an API call. The map lives on a
// warm serverless instance and resets on cold start; swap for a Supabase table
// if a cross-instance cache is ever needed.
const CACHE_TTL_MS = 24 * 60 * 60 * 1000;
type CacheEntry = { text: string; expires: number };
const explanationCache = new Map<string, CacheEntry>();

function getCached(key: string): string | null {
  const hit = explanationCache.get(key);
  if (hit && hit.expires > Date.now()) return hit.text;
  if (hit) explanationCache.delete(key);
  return null;
}

export async function POST(req: NextRequest) {
  // Everything is wrapped so this route can NEVER return a 500 to a visitor.
  // Worst case it serves a static range with a note, still HTTP 200.
  let sqftKey: string | undefined;
  try {
    const { zip, sqft, roofType, tier } = await req.json();
    sqftKey = sqft;

    if (!zip || !sqft || !roofType || !tier) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const sizeLabel = SIZE_LABELS[sqft];
    const costRange = COST_TABLE[sqft]?.[roofType];
    if (!sizeLabel || !costRange) {
      return NextResponse.json({ error: 'Invalid inputs' }, { status: 400 });
    }

    // Direct table lookup — no per-sqft math, no pitch multiplier. The range is
    // the answer. Never needs the API.
    const costLow = costRange.low;
    const costHigh = costRange.high;
    const midpoint = Math.round((costLow + costHigh) / 200) * 100;

    const cacheKey = `${sqft}|${roofType}|${tier}`;

    // 1. Cache hit: return the estimate with a previously generated explanation
    //    and make no API call at all.
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json({
        low: costLow, high: costHigh, midpoint, explanation: cached, cached: true,
      });
    }

    // 2. Cache miss: try the AI explanation. If the API fails for ANY reason
    //    (insufficient credit, timeout, 4xx/5xx), fall back to the static note
    //    but still return the real, table-looked-up numbers.
    try {
      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 220,
        system:
          'You write clear, honest homeowner roofing guidance. No em-dashes. No "comprehensive", "delve", "it\'s worth noting", or vague filler. Use specific numbers. Mention Arizona UV load or monsoon season when relevant.',
        messages: [
          {
            role: 'user',
            content: `Write exactly 3 sentences explaining this roof replacement cost estimate to a homeowner. Facts: home size ${sizeLabel}, ${ROOF_LABELS[roofType]} roof, ${TIER_LABELS[tier]} materials, estimated total cost $${costLow.toLocaleString()}–$${costHigh.toLocaleString()} in the Arizona market. Explain what's driving the range, one real factor specific to this roof type, and one honest caveat. Output only the 3 sentences.`,
          },
        ],
      });

      const explanation = (message.content[0] as { type: 'text'; text: string }).text.trim();
      explanationCache.set(cacheKey, { text: explanation, expires: Date.now() + CACHE_TTL_MS });

      return NextResponse.json({ low: costLow, high: costHigh, midpoint, explanation });
    } catch (aiErr) {
      // This line is the early-warning signal in Vercel logs: when it starts
      // firing, credits are low or the API is down, BEFORE visitors see errors.
      console.error(
        '[estimate] AI explanation unavailable, serving static fallback:',
        aiErr instanceof Error ? aiErr.message : aiErr,
      );
      // The table lookup is reliable, so serve the real numbers with the static
      // note. Only the copy degrades, not the estimate.
      return NextResponse.json({
        low: costLow, high: costHigh, midpoint,
        explanation: FALLBACK_NOTE,
        note: FALLBACK_NOTE,
        fallback: true,
      });
    }
  } catch (err) {
    // Absolute last resort: inputs were unreadable or something threw before we
    // could look up a range. Never 500 — serve a static range for the size.
    console.error(
      '[estimate] hard failure, serving static range fallback:',
      err instanceof Error ? err.message : err,
    );
    const fb = STATIC_FALLBACK[sqftKey ?? ''] ?? DEFAULT_FALLBACK;
    return NextResponse.json({
      low: fb.low,
      high: fb.high,
      midpoint: Math.round((fb.low + fb.high) / 200) * 100,
      explanation: FALLBACK_NOTE,
      note: FALLBACK_NOTE,
      fallback: true,
    });
  }
}

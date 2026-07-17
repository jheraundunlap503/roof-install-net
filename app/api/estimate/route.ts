import { NextRequest, NextResponse } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

const SQFT_MAP: Record<string, { low: number; high: number; label: string }> = {
  under1500: { low: 1100, high: 1500, label: 'under 1,500 sq ft' },
  '1500-2500': { low: 1500, high: 2500, label: '1,500–2,500 sq ft' },
  '2500-3500': { low: 2500, high: 3500, label: '2,500–3,500 sq ft' },
  '3500plus': { low: 3500, high: 5000, label: 'over 3,500 sq ft' },
};

// AZ average pitch factor: 1.3 (low-slope desert homes skew lower)
const PITCH = 1.3;

const COST_PER_SQFT: Record<string, Record<string, { low: number; high: number }>> = {
  shingle: {
    standard: { low: 7, high: 9 },
    mid:      { low: 9, high: 13 },
    premium:  { low: 13, high: 16 },
  },
  tile: {
    standard: { low: 12, high: 16 },
    mid:      { low: 16, high: 22 },
    premium:  { low: 22, high: 28 },
  },
  foam: {
    standard: { low: 4, high: 6 },
    mid:      { low: 6, high: 7 },
    premium:  { low: 7, high: 8 },
  },
  metal: {
    standard: { low: 10, high: 14 },
    mid:      { low: 14, high: 17 },
    premium:  { low: 17, high: 20 },
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

// Static last-resort ranges by home size, used only if the local cost math
// itself cannot run (bad input, unexpected throw). Reasonable Arizona market
// figures so the UI always renders a sane number instead of a 500.
const STATIC_FALLBACK: Record<string, { low: number; high: number }> = {
  under1500:   { low: 8000,  high: 18000 },
  '1500-2500': { low: 8000,  high: 18000 },
  '2500-3500': { low: 18000, high: 35000 },
  '3500plus':  { low: 18000, high: 35000 },
};
const DEFAULT_FALLBACK = { low: 8000, high: 18000 };
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

    const sqftRange = SQFT_MAP[sqft];
    const costRange = COST_PER_SQFT[roofType]?.[tier];
    if (!sqftRange || !costRange) {
      return NextResponse.json({ error: 'Invalid inputs' }, { status: 400 });
    }

    // Cost math is fully local — it never needs the API.
    const roofSqftLow  = Math.round(sqftRange.low  * PITCH);
    const roofSqftHigh = Math.round(sqftRange.high * PITCH);
    const costLow  = Math.round((roofSqftLow  * costRange.low)  / 100) * 100;
    const costHigh = Math.round((roofSqftHigh * costRange.high) / 100) * 100;
    const midpoint = Math.round((costLow + costHigh) / 200) * 100;

    const cacheKey = `${sqft}|${roofType}|${tier}`;

    // 1. Cache hit: return the real estimate with a previously generated
    //    explanation and make no API call at all.
    const cached = getCached(cacheKey);
    if (cached) {
      return NextResponse.json({
        low: costLow, high: costHigh, midpoint, explanation: cached, cached: true,
      });
    }

    // 2. Cache miss: try the AI explanation. If the API fails for ANY reason
    //    (insufficient credit, timeout, 4xx/5xx), fall back to the static note
    //    but still return the real, locally computed numbers.
    try {
      const message = await client.messages.create({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 220,
        system:
          'You write clear, honest homeowner roofing guidance. No em-dashes. No "comprehensive", "delve", "it\'s worth noting", or vague filler. Use specific numbers. Mention Arizona UV load or monsoon season when relevant.',
        messages: [
          {
            role: 'user',
            content: `Write exactly 3 sentences explaining this roof replacement cost estimate to a homeowner. Facts: home size ${sqftRange.label}, ${ROOF_LABELS[roofType]} roof, ${TIER_LABELS[tier]} materials, estimated total cost $${costLow.toLocaleString()}–$${costHigh.toLocaleString()} in the Arizona market. Explain what's driving the range, one real factor specific to this roof type, and one honest caveat. Output only the 3 sentences.`,
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
      // Use the vetted static range for this home size, not the computed number.
      // The per-sqft formula overshoots badly at the high end, so a conservative
      // market range is the honest thing to show when we can't generate copy.
      const fb = STATIC_FALLBACK[sqft] ?? DEFAULT_FALLBACK;
      return NextResponse.json({
        low: fb.low,
        high: fb.high,
        midpoint: Math.round((fb.low + fb.high) / 200) * 100,
        explanation: FALLBACK_NOTE,
        note: FALLBACK_NOTE,
        fallback: true,
      });
    }
  } catch (err) {
    // Absolute last resort: even the local math threw. Never 500 — serve a
    // static range for the home size and a note.
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

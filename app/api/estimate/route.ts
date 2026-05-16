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

export async function POST(req: NextRequest) {
  try {
    const { zip, sqft, roofType, tier } = await req.json();

    if (!zip || !sqft || !roofType || !tier) {
      return NextResponse.json({ error: 'Missing fields' }, { status: 400 });
    }

    const sqftRange = SQFT_MAP[sqft];
    const costRange = COST_PER_SQFT[roofType]?.[tier];

    if (!sqftRange || !costRange) {
      return NextResponse.json({ error: 'Invalid inputs' }, { status: 400 });
    }

    const roofSqftLow  = Math.round(sqftRange.low  * PITCH);
    const roofSqftHigh = Math.round(sqftRange.high * PITCH);
    const costLow  = Math.round((roofSqftLow  * costRange.low)  / 100) * 100;
    const costHigh = Math.round((roofSqftHigh * costRange.high) / 100) * 100;
    const midpoint = Math.round((costLow + costHigh) / 200) * 100;

    const message = await client.messages.create({
      model: 'claude-haiku-4-5-20251001',
      max_tokens: 220,
      system: 'You write clear, honest homeowner roofing guidance. No em-dashes. No "comprehensive", "delve", "it\'s worth noting", or vague filler. Use specific numbers. Mention Arizona UV load or monsoon season when relevant.',
      messages: [
        {
          role: 'user',
          content: `Write exactly 3 sentences explaining this roof replacement cost estimate to a homeowner. Facts: ZIP code ${zip}, home size ${sqftRange.label}, ${ROOF_LABELS[roofType]} roof, ${TIER_LABELS[tier]} materials, estimated total cost $${costLow.toLocaleString()}–$${costHigh.toLocaleString()}. Explain what's driving the range, one real factor specific to this roof type, and one honest caveat. Output only the 3 sentences.`,
        },
      ],
    });

    const explanation = (message.content[0] as { type: 'text'; text: string }).text.trim();

    return NextResponse.json({ low: costLow, high: costHigh, midpoint, explanation });
  } catch (err) {
    console.error('[estimate]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

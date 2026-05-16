import { NextRequest, NextResponse } from 'next/server';
import { getSupabase } from '@/lib/supabase';

export async function POST(req: NextRequest) {
  try {
    const { email, zip, sqft, roofType, tier, costLow, costHigh } = await req.json();

    if (!email || !email.includes('@')) {
      return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
    }

    const { error } = await getSupabase().from('leads').insert({
      email,
      zip_code: zip,
      home_size: sqft,
      roof_type: roofType,
      material_tier: tier,
      estimated_cost_low: costLow,
      estimated_cost_high: costHigh,
      source: 'estimator',
    });

    if (error) {
      console.error('[leads insert]', error.message);
      return NextResponse.json({ error: 'DB error' }, { status: 500 });
    }

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error('[leads]', err);
    return NextResponse.json({ error: 'Server error' }, { status: 500 });
  }
}

/*
  Requires a `service_leads` table in Supabase:

  create table service_leads (
    id uuid primary key default gen_random_uuid(),
    name text,
    email text not null,
    phone text,
    zip_code text,
    service_type text,
    city text,
    message text,
    source text,
    created_at timestamptz default now()
  );
*/

import { NextRequest, NextResponse } from "next/server";
import { getSupabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  try {
    const { name, email, phone, message, source, city, service_type } = await req.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json({ error: "Invalid email" }, { status: 400 });
    }

    const { error } = await getSupabase()
      .from("service_leads")
      .insert({ name, email, phone: phone || null, message: message || null, source, city, service_type });

    if (error) {
      console.error("[service-leads insert]", error.message);
      return NextResponse.json({ error: "DB error" }, { status: 500 });
    }

    // TODO: Add BREVO_API_KEY to .env.local and uncomment to send notification email
    // await sendBrevoNotification({ name, email, city, service_type, source });

    return NextResponse.json({ ok: true });
  } catch (err) {
    console.error("[service-leads]", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

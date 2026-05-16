import Link from "next/link";
import { EditorialCard } from "@/components/EditorialCard";
import { ToolCard } from "@/components/ToolCard";

/* Unsplash placeholder images */
const img = {
  roof:      "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=900&q=80",
  hail:      "https://images.unsplash.com/photo-1515694346937-94d85e41e6f0?auto=format&fit=crop&w=600&q=80",
  tile:      "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=600&q=80",
  tools:     "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80",
  house:     "https://images.unsplash.com/photo-1564013799919-ab600027ffc6?auto=format&fit=crop&w=900&q=80",
  storm:     "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&w=600&q=80",
  plans:     "https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=600&q=80",
  ladder:    "https://images.unsplash.com/photo-1621905252507-b35492cc74b4?auto=format&fit=crop&w=600&q=80",
  metal:     "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
  foam:      "https://images.unsplash.com/photo-1581578731548-c64695cc6952?auto=format&fit=crop&w=600&q=80",
  contract:  "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=600&q=80",
  inspect:   "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=600&q=80",
  phoenix:   "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=600&q=80",
  adjuster:  "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80",
};

/* ── HERO LEFT COLUMN ── */
const topLeft = [
  { label: "Scam protection", title: "How to spot a roofing scam before you sign anything" },
  { label: "Contractors", title: "What a license number actually tells you about a roofer" },
  { label: "Estimates", title: "The difference between a roofing estimate and a contract" },
  { label: "Storm season", title: "Why storm chasers target Arizona homeowners after monsoons" },
  { label: "Insurance", title: "When your adjuster's offer is too low and what to do about it" },
];

/* ── HERO RIGHT COLUMN ── */
const topRight = [
  { label: "Costs", title: "Roof replacement cost in Arizona, without the contractor math", src: img.house },
  { label: "Insurance", title: "What to do the day after hail or wind hits your roof", src: img.hail },
  { label: "Materials", title: "Tile vs shingle roofing in Arizona: a real comparison", src: img.tile },
];

/* ── MINI DECK ── */
const miniDeck = [
  { label: "Estimator", title: "What should a roof replacement actually cost in your ZIP?", src: img.tools },
  { label: "Claims", title: "Are adjuster first offers usually the final offer?", src: img.adjuster },
  { label: "Materials", title: "Is foam roofing the right choice for Arizona homeowners?", src: img.foam },
  { label: "HOA", title: "What will your HOA ask for before you replace your roof?", src: img.plans },
  { label: "Bids", title: "How do you compare three roofing bids without getting misled?", src: img.ladder },
];

/* ── CONTENT SECTIONS ── */
const sections = [
  {
    title: "Roofing costs",
    note: "Cost guides are the decision-stage spine of the site.",
    feature: { label: "Costs", title: "How much does a new roof cost in Arizona in 2026", src: img.house },
    side: [
      { label: "Square footage", title: "Roof replacement cost by square footage" },
      { label: "ROI", title: "Does a new roof increase home value in Arizona?" },
      { label: "Bids", title: "How to get three accurate roofing bids without pressure" },
      { label: "Timing", title: "Best time of year to replace a roof in Phoenix" },
    ],
  },
  {
    title: "Insurance claims",
    note: "High-intent content that homeowners search right after a storm.",
    feature: { label: "Insurance", title: "How to file a roof insurance claim step by step", src: img.hail },
    side: [
      { label: "Adjusters", title: "Why adjusters lowball roof claims and how to push back" },
      { label: "Coverage", title: "What roof damage Arizona insurance actually covers" },
      { label: "Hail damage", title: "How to tell if your roof has hail damage before calling anyone" },
      { label: "Denials", title: "What to do when your roof claim is denied" },
    ],
  },
  {
    title: "Materials",
    note: "Lifespan, climate fit, cost, and tradeoffs — no filler.",
    feature: { label: "Materials", title: "Tile vs shingle roofing in Arizona: the real cost difference", src: img.tile },
    side: [
      { label: "Foam", title: "What foam roofing is and when it makes sense in Arizona" },
      { label: "Metal", title: "Metal roofing in Arizona: costs, lifespan, and tradeoffs" },
      { label: "Underlayment", title: "Why underlayment matters more than shingles in desert heat" },
      { label: "Shingles", title: "How long do shingles last in Arizona vs national average" },
    ],
  },
  {
    title: "Contractor vetting",
    note: "License checks, contract red flags, and pressure tactics explained.",
    feature: { label: "Contractors", title: "What a roofing license number actually tells you", src: img.contract },
    side: [
      { label: "Questions", title: "Questions to ask before a roofer gets on your roof" },
      { label: "Estimates", title: "The difference between an estimate and a binding contract" },
      { label: "Red flags", title: "Five roofing contract clauses that cost homeowners money" },
      { label: "Warranties", title: "What a workmanship warranty actually covers vs materials" },
    ],
  },
  {
    title: "Local service guides",
    note: "Phoenix metro service pages pair intent with city geography.",
    feature: { label: "Services", title: "Foam roofing in Mesa and Gilbert AZ", src: img.foam },
    side: [
      { label: "East Valley", title: "Tile roof replacement in East Valley cities" },
      { label: "Storm damage", title: "Storm damage roofing guides by city" },
      { label: "Chandler", title: "Shingle roof replacement cost in Chandler AZ" },
      { label: "Queen Creek", title: "Roof repair and replacement in Queen Creek AZ" },
    ],
  },
  {
    title: "City cost guides",
    note: "Local SEO anchors — one guide per metro, expanding nationally.",
    feature: { label: "Cities", title: "Phoenix roof installation cost guide for 2026", src: img.plans },
    side: [
      { label: "Mesa", title: "Roof replacement cost in Mesa AZ" },
      { label: "Scottsdale", title: "Roof installation cost in Scottsdale AZ" },
      { label: "Tucson", title: "Roof replacement cost in Tucson AZ" },
      { label: "Tempe", title: "Roofing contractor costs in Tempe AZ" },
    ],
  },
];

export default function HomePage() {
  return (
    <div className="site-width front-page">

      {/* ── HERO: 3-column layout ── */}
      <section className="front-page-header">

        {/* Left: vertical story list */}
        <div className="story-list">
          {topLeft.map((s) => (
            <Link href="/blog/" key={s.title}>
              <span className="label">{s.label}</span>
              <h3>{s.title}</h3>
            </Link>
          ))}
        </div>

        {/* Center: main feature card */}
        <Link className="feature-card" href="/blog/">
          <img
            alt="Roofing crew working on an Arizona residential roof"
            className="feature-image"
            src={img.roof}
          />
          <span className="label">Start here</span>
          <h2 style={{ fontSize: "1.75rem", lineHeight: 1.2, marginTop: 6, marginBottom: 10 }}>
            These roofing decisions cost homeowners the most money.
          </h2>
          <p className="lede" style={{ fontSize: "0.95rem", lineHeight: 1.6, marginBottom: 0 }}>
            From storm chasers to vague estimates, roof replacement gets expensive
            when homeowners do not know the right questions to ask. This site
            organizes the answers before the sales pitch starts.
          </p>
        </Link>

        {/* Right: side stories with thumbnails */}
        <div className="section-side-list">
          {topRight.map((s) => (
            <Link className="side-story with-thumb" href="/blog/" key={s.title}>
              <img alt="" className="thumb" src={s.src} />
              <span>
                <span className="label">{s.label}</span>
                <h3>{s.title}</h3>
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── MINI DECK ── */}
      <section className="mini-deck">
        <div className="mini-deck-header">
          <h2>Are these roofing questions worth researching?</h2>
          <p>Fast entry points for homeowners who already know what they need.</p>
        </div>
        <div className="mini-deck-grid">
          {miniDeck.map((c) => (
            <Link className="mini-card" href="/blog/" key={c.title}>
              <img alt="" src={c.src} />
              <span className="label">{c.label}</span>
              <h3>{c.title}</h3>
            </Link>
          ))}
        </div>
      </section>

      {/* ── ESTIMATOR SECTION ── */}
      <section className="section">
        <div className="section-heading">
          <h2>The Estimator</h2>
          <p>Lead capture tool — editorial in feel, practical in output.</p>
        </div>
        <div className="section-layout">
          <div>
            <img
              alt="Roofing plans and measurement tools on a work surface"
              className="feature-image"
              src={img.tools}
            />
            <EditorialCard
              excerpt="Estimate your replacement range by ZIP code, roof size, material tier, and roof type before you compare bids."
              href="/estimator/"
              label="Free tool"
              meta="Phase 2 activation"
              title="Roof replacement cost estimator"
            />
          </div>
          <ToolCard />
        </div>
      </section>

      {/* ── CONTENT SECTIONS ── */}
      {sections.map((section) => (
        <section className="section" key={section.title}>
          <div className="section-heading">
            <h2>{section.title}</h2>
            <p>{section.note}</p>
          </div>
          <div className="section-layout">
            {/* Feature card */}
            <Link className="section-feature" href="/blog/">
              <img alt="" className="feature-image" src={section.feature.src} />
              <span className="label">{section.feature.label}</span>
              <h3 style={{ fontSize: "1.2rem", lineHeight: 1.25, margin: "6px 0 8px" }}>
                {section.feature.title}
              </h3>
              <p style={{ fontSize: "0.88rem", lineHeight: 1.55, color: "var(--color-muted)", margin: 0 }}>
                Staged for review — publishes only after editorial approval.
              </p>
            </Link>

            {/* Side list */}
            <div className="section-side-list">
              {section.side.map((s) => (
                <Link className="side-story" href="/blog/" key={s.title}>
                  <span className="label">{s.label}</span>
                  <h3>{s.title}</h3>
                  <p style={{ fontSize: "0.82rem", color: "var(--color-muted)", margin: "2px 0 0", fontFamily: "var(--font-sans)" }}>
                    Queued
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      ))}

      {/* ── CHECKLISTS ── */}
      <section className="section">
        <div className="section-heading">
          <h2>Homeowner checklists</h2>
          <p>Featured-snippet targets, email capture anchors, and internal link hubs.</p>
        </div>
        <div className="grid">
          <EditorialCard
            excerpt="What to photograph, who to call, and what not to sign after a storm damages your roof."
            href="/blog/"
            label="Checklist"
            meta="Queued"
            title="Day-after-storm roof checklist"
          />
          <EditorialCard
            excerpt="License, insurance, warranty, materials, exclusions, and payment terms — before you hire anyone."
            href="/blog/"
            label="Checklist"
            meta="Queued"
            title="Before you hire a roofer checklist"
          />
          <EditorialCard
            excerpt="How to compare scope, underlayment spec, cleanup, warranty terms, and hidden exclusions across bids."
            href="/blog/"
            label="Checklist"
            meta="Queued"
            title="Roofing bid comparison checklist"
          />
        </div>
      </section>

      {/* ── PHASE NOTE ── */}
      <section className="section" style={{ paddingBottom: 40 }}>
        <div className="callout">
          <p>
            This preview is Phase 1 only. The estimator, Supabase lead capture,
            Brevo email sends, and article publishing all stay behind approval gates.
          </p>
        </div>
        <div style={{ marginTop: 16 }}>
          <Link className="button secondary" href="/about/">
            Read our standards
          </Link>
        </div>
      </section>

    </div>
  );
}

import type { Metadata } from 'next';
import Link from 'next/link';
import RoofCostCalculator from '@/components/RoofCostCalculator';

export const metadata: Metadata = {
  title: 'Roof Cost Estimator by Size and Material',
  description:
    'Estimate your roof replacement cost by home size, material, pitch, and Arizona region. See a real price range in seconds. Free, no signup to see your number.',
  alternates: {
    canonical: 'https://roofinstall.net/calculators/roof-cost-estimator/',
  },
  openGraph: {
    title: 'Roof Cost Estimator by Size and Material',
    description:
      'Estimate your roof replacement cost by home size, material, pitch, and region. Free planning tool.',
    type: 'website',
  },
};

const faqs = [
  {
    q: 'How much does a new roof cost in Arizona?',
    a: 'A typical 1,600 sq ft single-story Arizona home runs about $8,000 to $16,000 for architectural shingle and $14,000 to $28,000 for concrete tile. Standing seam metal and clay tile push higher. The calculator above gives a range for your exact size, material, and region.',
  },
  {
    q: 'What is a roofing square?',
    a: 'A roofing square is 100 square feet of roof surface. Contractors price and order material by the square, not the square foot. A 1,728 sq ft roof is 17.3 squares. Dividing your roof area by 100 is the first step in every roof estimate.',
  },
  {
    q: 'Why is my roof area larger than my house square footage?',
    a: 'Roof area is the slanted surface, so it is always larger than the flat footprint. A standard 6/12 pitch adds about 8 percent. A steep 10/12 pitch adds about 30 percent. Living space upstairs also does not sit under roof, which is why this tool uses footprint, not total living area.',
  },
  {
    q: 'Does this estimate include tear-off of the old roof?',
    a: 'The material and labor ranges assume a standard install that includes removing one existing layer. A second layer adds roughly $1 to $2 per square foot. Damaged decking, new underlayment code upgrades, and structural repairs are extra and only show up after inspection.',
  },
  {
    q: 'How accurate is an online roof cost calculator?',
    a: 'A good calculator gets you within 10 to 20 percent for a standard job, which is close enough to check whether a bid is fair. It cannot see your decking condition, flashing, access, or local labor spikes. Use the range to vet quotes, not to replace an on-site measurement.',
  },
  {
    q: 'Should I get a metal or tile roof in Arizona?',
    a: 'Both outlast shingle in high UV. Concrete tile is the Arizona default and lasts 30 to 50 years. Standing seam metal reflects heat well and lasts 40 to 60 years but costs more up front. Shingle is cheapest but the desert sun cuts its life to 15 to 20 years.',
  },
];

export default function RoofCostEstimatorPage() {
  const faqJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map(f => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  };

  return (
    <div className="site-width">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqJsonLd) }}
      />

      <section className="page-hero">
        <span className="label">Free tool</span>
        <h1>Roof Cost Estimator</h1>
        <div className="art-tldr" style={{ marginTop: 18 }}>
          <p>
            This roof cost estimator prices a replacement from your home footprint, material, pitch, and region. A typical Arizona home lands between $8,000 and $28,000 depending on material, and the single biggest lever is what you put on top: shingle, tile, or metal. Your number appears instantly below, no signup to see it.
          </p>
        </div>
      </section>

      <div className="calc-article">
        <p>
          Most roofing quotes swing by thousands of dollars for the same house, and homeowners rarely know if a bid is fair. This roof cost estimator turns your roof into the same math a contractor uses: footprint, pitch, roofing squares, waste, and an installed cost per square. You get a low-to-high range in seconds so you can walk into quotes already knowing the ballpark.
        </p>
        <p>
          The tool is built for the Arizona market, where high UV load shortens shingle life and tile is the regional default, but the material ranges hold across the United States. Pick your region below and the estimate adjusts for local labor. For a guided version by ZIP code, use the{' '}
          <Link href="/estimator/">free cost estimator</Link>.
        </p>

        <div className="calc-embed">
          <RoofCostCalculator />
        </div>

        <h2>How this calculator works</h2>
        <p>
          The calculator takes your home footprint and multiplies it by a pitch factor to get true roof surface area, divides by 100 to get roofing squares, adds a waste factor based on how cut-up your roof is, then multiplies by the installed cost range for your material and adjusts for your region. That mirrors how a contractor builds a bid before they climb on the roof.
        </p>
        <p>What it assumes:</p>
        <ul className="list">
          <li>Standard residential installation by a licensed contractor</li>
          <li>Removal of one existing roof layer is included; a second layer adds $1 to $2 per square foot</li>
          <li>Cost ranges reflect current United States market rates</li>
          <li>Permit fees are excluded, typically $150 to $500 in most Arizona cities</li>
          <li>No structural or decking repair, which is only found on inspection</li>
          <li>Your actual quote varies with local labor rates and site conditions</li>
        </ul>
        <p className="calc-source">
          Material and labor cost ranges are drawn from roofing industry benchmarks and contractor pricing across the US market, with pitch multipliers and waste factors from standard estimating practice published by the{' '}
          <a href="https://www.nrca.net" target="_blank" rel="noopener noreferrer">National Roofing Contractors Association</a>. Your local quote may vary based on labor rates, material availability, and site conditions.
        </p>

        <h2>What affects roof replacement cost</h2>
        <p>
          Material is the biggest factor by far. A 3-tab asphalt roof installs for $350 to $500 per square, while standing seam metal runs $800 to $1,400 and clay tile $1,000 to $1,800. Choosing tile over shingle can more than double the job on the same house, which is why the material dropdown moves your estimate more than any other input.
        </p>
        <p>
          Pitch and complexity come next. A steep 10/12 roof has roughly 30 percent more surface than its footprint and needs fall protection, so labor climbs. A cut-up roof with valleys, dormers, and skylights wastes 17 to 22 percent of material versus 8 percent on a simple gable. Both show up in the waste and pitch factors the calculator applies.
        </p>
        <p>
          Region and timing matter more than most homeowners expect. Phoenix metro labor runs 5 to 10 percent above the national average because of heat and demand, and premium markets like Scottsdale and Paradise Valley run higher still. Arizona&apos;s UV load also shortens asphalt shingle life by 10 to 15 percent, which is why many desert homeowners pay more up front for tile or metal. See{' '}
          <Link href="/blog/tile-vs-shingle-roof-arizona/">tile versus shingle in Arizona</Link>{' '}
          and{' '}
          <Link href="/blog/how-long-does-a-roof-last-arizona/">how long a roof lasts in Arizona</Link>{' '}
          before you lock in a material.
        </p>
        <p>
          Two things this tool cannot see will move your final price: decking condition and existing layers. If the wood sheathing under your roof is rotted or your home already has two shingle layers, tear-off and decking work add cost that no calculator can predict from the street.
        </p>

        <h2>How to use your estimate</h2>
        <p>
          Treat the range as a bid-checking tool, not a quote. When a contractor hands you a number, it should land inside or near your calculated range. A bid far below the low end often means a missing line item like tear-off or underlayment. A bid far above the high end deserves a line-by-line explanation.
        </p>
        <p>
          Get at least three written quotes and give every contractor the same scope so you compare like for like. Ask each one to itemize tear-off, decking allowance, underlayment, flashing, and warranty. If you want a deeper walkthrough of what a fair quote includes, read{' '}
          <Link href="/blog/roof-replacement-cost-arizona-2026/">how much a new roof costs in Arizona</Link>, then{' '}
          <Link href="/contact/">get matched with local roofers</Link>{' '}
          when you are ready to compare real bids.
        </p>

        <section className="faq-section">
          <h2 style={{ marginTop: 0, borderTop: 'none', paddingTop: 0 }}>Frequently asked questions</h2>
          {faqs.map(f => (
            <div className="faq-item" key={f.q}>
              <h3>{f.q}</h3>
              <p style={{ margin: 0 }}>{f.a}</p>
            </div>
          ))}
        </section>

        <div className="callout">
          <p>
            This estimate is a planning tool, not a quote. A licensed contractor inspects pitch, decking condition, flashing, and existing layers before pricing a job. Use this range to sanity-check bids, not to replace them.
          </p>
        </div>
      </div>
    </div>
  );
}

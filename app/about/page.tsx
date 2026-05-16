import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn how roofinstall.net helps homeowners understand roofing costs, insurance claims, and contractor vetting."
};

export default function AboutPage() {
  return (
    <div className="site-width">
      <section className="page-hero">
        <span className="label">About</span>
        <h1>An independent roofing resource for homeowners.</h1>
        <p className="lede">
          roofinstall.net is built to help homeowners understand roof
          replacement costs, insurance claims, contractor red flags, and local
          roofing decisions before they sign a contract.
        </p>
      </section>

      <section className="section split">
        <div>
          <h2>What this site is</h2>
          <p>
            This is a standalone homeowner education and lead generation asset
            for the U.S. roofing industry. It is not a contractor website and it
            does not share infrastructure or branding with unrelated businesses.
          </p>
          <h2>Editorial standards</h2>
          <p>
            Guides should use specific numbers, local context, source-backed
            claims, and plain language. The site should tell homeowners when
            they may not need a new roof.
          </p>
        </div>
        <aside className="data-box">
          <span className="label">Rules that matter</span>
          <ul className="list">
            <li>No bulk publishing.</li>
            <li>No email sends before approval.</li>
            <li>No content pages that depend on client-side fetching.</li>
            <li>No contractor-first sales language.</li>
          </ul>
        </aside>
      </section>
    </div>
  );
}

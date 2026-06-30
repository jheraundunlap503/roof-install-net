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
            This is a standalone homeowner education resource for the U.S.
            roofing industry. It is not a contractor website and it has no
            affiliation with any roofing company.
          </p>
          <h2>Editorial standards</h2>
          <p>
            Every guide uses specific numbers, local climate context,
            source-backed claims, and plain language. The site tells homeowners
            when they may not need a new roof.
          </p>
        </div>
      </section>
    </div>
  );
}

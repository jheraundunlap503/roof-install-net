import type { Metadata } from "next";
import { EditorialCard } from "@/components/EditorialCard";
import { primaryCities } from "@/lib/site";

export const metadata: Metadata = {
  title: "Roofing Cost Guides by City",
  description:
    "Planned city roofing cost guides for Phoenix metro and national roof installation markets."
};

export default function CitiesPage() {
  return (
    <div className="site-width">
      <section className="page-hero">
        <span className="label">City guides</span>
        <h1>Local roof installation cost pages, staged for slow publishing.</h1>
        <p className="lede">
          City pages come after the initial trust and service content. The first
          market is Phoenix metro, followed by national cost guides.
        </p>
      </section>

      <section className="section">
        <div className="grid">
          {primaryCities.map((city) => (
            <EditorialCard
              excerpt="Planned local roofing cost guide with material notes, local climate context, and estimator CTA."
              href="/cities/"
              key={city}
              label="Planned city"
              meta="Not published"
              title={`${city} roof installation cost guide`}
            />
          ))}
        </div>
      </section>
    </div>
  );
}

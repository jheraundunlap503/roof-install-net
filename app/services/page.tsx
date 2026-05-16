import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { EditorialCard } from "@/components/EditorialCard";
import { ToolCard } from "@/components/ToolCard";
import { getContentItems } from "@/lib/content";
import { primaryCities, services } from "@/lib/site";

export const metadata: Metadata = {
  title: "Roofing Service Guides",
  description:
    "Local roofing service guides for foam roofing, tile replacement, shingle replacement, roof repair, inspections, and storm damage."
};

export default function ServicesIndexPage() {
  const items = getContentItems("services");

  return (
    <div className="site-width">
      <section className="page-hero">
        <span className="label">Service guides</span>
        <h1>Local roofing service pages, built like buying guides.</h1>
        <p className="lede">
          These pages will pair roofing services with Phoenix metro cities and
          explain costs, climate factors, permitting, materials, and red flags.
        </p>
      </section>

      <section className="section split">
        <div>
          <div className="section-heading">
            <h2>Planned service tracks</h2>
          </div>
          <p>{services.join(", ")}.</p>
          <div className="section-heading">
            <h2>Initial cities</h2>
          </div>
          <p>{primaryCities.join(", ")}.</p>
        </div>
        <ToolCard />
      </section>

      <section className="section">
        <div className="section-heading">
          <h2>Service page queue</h2>
          <p>No service page publishes before approval.</p>
        </div>
        {items.length > 0 ? (
          <div className="grid">
            {items.map((item) => (
              <ArticleCard
                item={item}
                href={`/services/${item.slug}/`}
                key={item.slug}
              />
            ))}
          </div>
        ) : (
          <div className="grid">
            <EditorialCard
              excerpt="Local cost drivers, foam roof coating notes, and questions to ask before approving work."
              href="/services/"
              label="Mesa"
              meta="Planned"
              title="Foam roofing Mesa AZ"
            />
            <EditorialCard
              excerpt="Underlayment, tile reuse, HOA questions, and lifespan expectations for Gilbert homeowners."
              href="/services/"
              label="Gilbert"
              meta="Planned"
              title="Tile roof replacement Gilbert AZ"
            />
            <EditorialCard
              excerpt="Shingle lifespan, ventilation, monsoon exposure, and bid comparison notes."
              href="/services/"
              label="Chandler"
              meta="Planned"
              title="Shingle roof replacement Chandler AZ"
            />
          </div>
        )}
      </section>
    </div>
  );
}

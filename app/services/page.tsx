import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { ToolCard } from "@/components/ToolCard";
import { getContentItems } from "@/lib/content";

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
        <h1>Local roofing service guides for Phoenix metro homeowners</h1>
        <p className="lede">
          Straight-talking guides on foam roofing, tile replacement, shingle replacement, roof repair, storm damage, and inspections across the Phoenix metro area.
        </p>
      </section>

      <section className="section split">
        <div>
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
            <p>In-depth service guides for Arizona homeowners. New guides added weekly.</p>
          )}
        </div>
        <ToolCard />
      </section>
    </div>
  );
}

import type { Metadata } from "next";
import Link from "next/link";
import { ArticleCard } from "@/components/ArticleCard";
import { getContentItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Roofing Cost Guides by City",
  description:
    "In-depth roofing cost guides for Phoenix metro cities and Arizona homeowners. New guides added weekly."
};

export default function CitiesPage() {
  const cities = getContentItems("cities");

  return (
    <div className="site-width">
      <section className="page-hero">
        <span className="label">City guides</span>
        <h1>Local roofing cost guides by city</h1>
        <p className="lede">
          In-depth guides on roofing costs, materials, and local permit requirements for Arizona homeowners. New guides added weekly.
        </p>
        <Link className="button" href="/estimator/">
          Get a free cost estimate
        </Link>
      </section>

      {cities.length > 0 && (
        <section className="section">
          <div className="grid">
            {cities.map((item) => (
              <ArticleCard
                item={item}
                href={`/cities/${item.slug}/`}
                key={item.slug}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}

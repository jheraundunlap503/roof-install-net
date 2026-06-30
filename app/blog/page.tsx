import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { getContentItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Roofing Guides",
  description:
    "Homeowner roofing guides covering costs, insurance claims, contractor scams, and Arizona roof replacement questions."
};

const filters = ["All", "Costs", "Insurance", "Materials", "Contractors", "Arizona"];

export default function BlogIndexPage() {
  const posts = getContentItems("blog");

  return (
    <div className="site-width">
      <section className="page-hero">
        <span className="label">Guides</span>
        <h1>Roofing advice written for homeowners, not sales teams.</h1>
        <p className="lede">
          Every guide uses a TLDR, source-backed claims, clear answers, and an
          FAQ section.
        </p>
      </section>

      <nav className="category-tabs" aria-label="Guide categories">
        {filters.map((filter, index) => (
          <a className={index === 0 ? "active" : ""} href="#articles" key={filter}>
            {filter}
          </a>
        ))}
      </nav>

      <section className="section" id="articles">
        <div className="grid">
          {posts.map((post) => (
            <ArticleCard item={post} href={`/blog/${post.slug}/`} key={post.slug} />
          ))}
        </div>
      </section>
    </div>
  );
}

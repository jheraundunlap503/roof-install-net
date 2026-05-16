import type { Metadata } from "next";
import { ArticleCard } from "@/components/ArticleCard";
import { EditorialCard } from "@/components/EditorialCard";
import { getContentItems } from "@/lib/content";

export const metadata: Metadata = {
  title: "Roofing Guides",
  description:
    "Homeowner roofing guides covering costs, insurance claims, contractor scams, and Arizona roof replacement questions."
};

const filters = ["All", "Costs", "Insurance", "Materials", "Contractors", "Arizona"];

const planned = [
  ["Scam protection", "How to Spot a Roofing Scam in Arizona"],
  ["Contractors", "What to Ask Before You Let a Roofer on Your Roof"],
  ["Insurance", "What to Do the Day After a Hail Storm in Arizona"],
  ["Materials", "Tile vs Shingle Roofing in Arizona"],
  ["Costs", "How Much Does a New Roof Cost in Arizona in 2026"],
  ["HOA", "What Your HOA Won't Tell You About Replacing Your Roof in Gilbert"]
];

export default function BlogIndexPage() {
  const posts = getContentItems("blog");

  return (
    <div className="site-width">
      <section className="page-hero">
        <span className="label">Guides</span>
        <h1>Roofing advice written for homeowners, not sales teams.</h1>
        <p className="lede">
          Every published article will use a TLDR, source-backed claims, clear
          answers, and FAQ sections. First articles require explicit review
          before publication.
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
        {posts.length > 0 ? (
          <div className="grid">
            {posts.map((post) => (
              <ArticleCard item={post} href={`/blog/${post.slug}/`} key={post.slug} />
            ))}
          </div>
        ) : (
          <div className="grid">
            {planned.map(([label, title]) => (
              <EditorialCard
                excerpt="Queued from the content calendar. This will not publish until it passes the approval gate."
                href="/blog/"
                key={title}
                label={label}
                meta="Awaiting content approval"
                title={title}
              />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

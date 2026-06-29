import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentItems, getContentItem } from "@/lib/content";
import { MarkdownContent } from "@/components/MarkdownContent";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const cities = getContentItems("cities");
  return cities.map((item) => ({ slug: item.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getContentItem("cities", params.slug);
  if (!page) return {};
  return {
    title: page.meta_title || page.title,
    description: page.meta_description || page.description,
    alternates: {
      canonical: `https://roofinstall.net/cities/${params.slug}/`,
    },
    openGraph: {
      title: page.meta_title || page.title,
      description: page.meta_description || page.description,
      images: page.image_url ? [{ url: page.image_url }] : [],
      type: "article",
    },
  };
}

function extractToc(body: string): Array<{ id: string; title: string }> {
  return body
    .split("\n")
    .filter((line) => line.startsWith("## "))
    .map((line) => {
      const raw = line.slice(3);
      const title = raw
        .replace(/\*\*([^*]+)\*\*/g, "$1")
        .replace(/\[[^\]]+\]\([^)]+\)/g, "")
        .trim();
      const id = title
        .toLowerCase()
        .replace(/[^a-z0-9]+/g, "-")
        .replace(/^-|-$/g, "");
      return { id, title };
    });
}

function formatDate(d?: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export default function CityPage({ params }: Props) {
  const page = getContentItem("cities", params.slug);
  if (!page) notFound();

  const toc = extractToc(page.body);
  const date = formatDate(page.date);

  return (
    <main>
      <article>
        {page.image_url && (
          <div className="art-hero">
            <img
              src={page.image_url}
              alt={page.image_alt || page.title}
              className="art-hero-img"
            />
          </div>
        )}

        <div className="art-header-wrap">
          <header className="art-header">
            <nav className="art-breadcrumb" aria-label="Breadcrumb">
              <Link href="/cities/">Cities</Link>
              <span aria-hidden="true"> / </span>
              <span>Cost Guide</span>
            </nav>
            <h1>{page.title}</h1>
            <div className="art-meta">
              <span>By roofinstall.net editorial</span>
              {date && <span>{date}</span>}
            </div>
          </header>
        </div>

        <div className="art-layout">
          <div className="art-body">
            <MarkdownContent markdown={page.body} />

            <div className="art-cta-block">
              <p>Know your number before you call a roofer.</p>
              <Link className="button" href="/estimator/">
                Free Roof Cost Estimate
              </Link>
            </div>
          </div>

          {toc.length > 0 && (
            <aside className="art-sidebar">
              <div className="art-toc">
                <p className="art-toc-label">In This Guide</p>
                <ol>
                  {toc.map((item) => (
                    <li key={item.id}>
                      <a href={`#${item.id}`}>{item.title}</a>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="art-sidebar-cta">
                <p>Get a free estimate in 60 seconds.</p>
                <Link className="button" href="/estimator/">
                  Start Estimator
                </Link>
              </div>
            </aside>
          )}
        </div>
      </article>
    </main>
  );
}

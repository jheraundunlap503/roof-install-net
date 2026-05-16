import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentItems, getContentItem } from "@/lib/content";
import { MarkdownContent } from "@/components/MarkdownContent";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  const posts = getContentItems("blog");
  return posts.map((post) => ({ slug: post.slug }));
}

function buildTitle(raw: string): string {
  const suffix = " | roofinstall.net";
  if (raw.length + suffix.length <= 60) return raw + suffix;
  const maxRaw = 60 - suffix.length - 1;
  return raw.slice(0, maxRaw).trimEnd() + "…" + suffix;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const post = getContentItem("blog", params.slug);
  if (!post) return {};
  const rawTitle = post.meta_title || post.title;
  const title = buildTitle(rawTitle);
  return {
    title,
    description: post.meta_description || post.description,
    alternates: {
      canonical: `https://roofinstall.net/blog/${params.slug}/`,
    },
    openGraph: {
      title,
      description: post.meta_description || post.description,
      images: post.image_url ? [{ url: post.image_url }] : [],
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

function readingTime(body: string): number {
  return Math.max(1, Math.round(body.split(/\s+/).length / 200));
}

function formatDate(d?: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function extractFaqSchema(
  body: string
): Array<{ question: string; answer: string }> {
  const lines = body.split("\n");
  const faqs: Array<{ question: string; answer: string }> = [];

  let i = 0;
  while (i < lines.length) {
    const line = lines[i].trim();
    const match = line.match(/^\*\*(.+\?)\*\*$/);
    if (match) {
      const question = match[1].trim();
      const answerLines: string[] = [];
      i++;
      while (i < lines.length) {
        const ansLine = lines[i].trim();
        if (ansLine.match(/^\*\*(.+\?)\*\*$/) || ansLine.startsWith("#"))
          break;
        if (ansLine) answerLines.push(ansLine);
        i++;
      }
      if (answerLines.length > 0) {
        faqs.push({ question, answer: answerLines.join(" ") });
      }
      continue;
    }
    i++;
  }
  return faqs;
}

export default function BlogPostPage({ params }: Props) {
  const post = getContentItem("blog", params.slug);
  if (!post) notFound();

  const toc = extractToc(post.body);
  const mins = readingTime(post.body);
  const date = formatDate(post.date);
  const faqItems = extractFaqSchema(post.body);

  const faqSchema =
    faqItems.length > 0
      ? JSON.stringify({
          "@context": "https://schema.org",
          "@type": "FAQPage",
          mainEntity: faqItems.map(({ question, answer }) => ({
            "@type": "Question",
            name: question,
            acceptedAnswer: { "@type": "Answer", text: answer },
          })),
        })
      : null;

  return (
    <main>
      {faqSchema && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: faqSchema }}
        />
      )}
      <article>
        {post.image_url && (
          <div className="art-hero">
            <img
              src={post.image_url}
              alt={post.image_alt || post.title}
              className="art-hero-img"
            />
          </div>
        )}

        <div className="art-header-wrap">
          <header className="art-header">
            <nav className="art-breadcrumb" aria-label="Breadcrumb">
              <Link href="/blog/">Guides</Link>
              <span aria-hidden="true"> / </span>
              <span>Homeowner Guide</span>
            </nav>
            <h1>{post.title}</h1>
            <div className="art-meta">
              <span>By roofinstall.net editorial</span>
              {date && <span>{date}</span>}
              <span>{mins} min read</span>
            </div>
          </header>
        </div>

        <div className="art-layout">
          <div className="art-body">
            <MarkdownContent markdown={post.body} />

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

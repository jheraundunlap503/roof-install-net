import Link from "next/link";
import { MarkdownContent } from "@/components/MarkdownContent";

type ArticleScaffoldProps = {
  label: string;
  title: string;
  description: string;
  byline?: string;
  date?: string;
  tldr: string[];
  toc: Array<{ id: string; title: string }>;
  body: string;
  faq?: Array<{ question: string; answer: string }>;
  ctaStrength?: "soft" | "strong";
};

export function ArticleScaffold({
  label,
  title,
  description,
  byline = "roofinstall.net editorial",
  date,
  tldr,
  toc,
  body,
  faq = [],
  ctaStrength = "soft"
}: ArticleScaffoldProps) {
  return (
    <article>
      <header className="article-header article-width">
        <span className="label">{label}</span>
        <h1>{title}</h1>
        <p className="lede">{description}</p>
        <div className="metadata">
          <span>By {byline}</span>
          {date ? <span>{date}</span> : null}
        </div>
      </header>

      <div className="article-body article-width">
        <section className="callout" aria-label="TLDR">
          {tldr.map((item) => (
            <p key={item}>{item}</p>
          ))}
        </section>

        {toc.length > 0 ? (
          <nav className="toc" aria-label="In this article">
            <h2>In This Article</h2>
            <ol>
              {toc.map((item) => (
                <li key={item.id}>
                  <a href={`#${item.id}`}>{item.title}</a>
                </li>
              ))}
            </ol>
          </nav>
        ) : null}

        <MarkdownContent markdown={body} />

        <section className="callout">
          <p>
            {ctaStrength === "strong"
              ? "Before you call a roofer, run the estimator so you have a realistic local cost range in hand."
              : "Use the free estimator when you want a quick reality check before comparing roofing bids."}
          </p>
          <p>
            <Link className="button" href="/estimator/">
              Start estimator
            </Link>
          </p>
        </section>

        {faq.length > 0 ? (
          <section className="faq-section">
            <h2>FAQ</h2>
            {faq.map((item) => (
              <div className="faq-item" key={item.question}>
                <h3>{item.question}</h3>
                <p>{item.answer}</p>
              </div>
            ))}
          </section>
        ) : null}
      </div>
    </article>
  );
}

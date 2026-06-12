import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getContentItemsRaw, getContentItemRaw } from "@/lib/content";
import { MarkdownContent } from "@/components/MarkdownContent";
import { ServiceLeadForm } from "@/components/ServiceLeadForm";

type Props = {
  params: { slug: string };
};

export async function generateStaticParams() {
  return getContentItemsRaw("services").map((page) => ({ slug: page.slug }));
}

function buildTitle(raw: string): string {
  const suffix = " | roofinstall.net";
  if (raw.length + suffix.length <= 60) return raw + suffix;
  return raw.slice(0, 60 - suffix.length - 1).trimEnd() + "…" + suffix;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const page = getContentItemRaw("services", params.slug);
  if (!page) return {};
  const rawTitle = page.meta_title || page.title;
  return {
    title: buildTitle(rawTitle),
    description: page.meta_description,
    robots: page.published ? undefined : { index: false, follow: false },
    alternates: {
      canonical: `https://roofinstall.net/services/${params.slug}/`,
    },
    openGraph: {
      title: buildTitle(rawTitle),
      description: page.meta_description,
      images: page.image_url ? [{ url: page.image_url }] : [],
      type: "article",
    },
  };
}

function formatDate(d?: string): string {
  if (!d) return "";
  return new Date(d).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function extractFaqSchema(body: string): Array<{ question: string; answer: string }> {
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
        if (ansLine.match(/^\*\*(.+\?)\*\*$/) || ansLine.startsWith("#")) break;
        if (ansLine) answerLines.push(ansLine);
        i++;
      }
      if (answerLines.length > 0) faqs.push({ question, answer: answerLines.join(" ") });
      continue;
    }
    i++;
  }
  return faqs;
}

export default function ServicePage({ params }: Props) {
  const page = getContentItemRaw("services", params.slug);
  if (!page) notFound();

  const city = page.city || "";
  const service = page.service || "";
  const date = formatDate(page.date);
  const faqItems = extractFaqSchema(page.body);
  const mapsKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

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

  const localBizSchema = JSON.stringify({
    "@context": "https://schema.org",
    "@type": "Service",
    name: `${service} — ${city}, AZ`,
    areaServed: { "@type": "City", name: city, containedInPlace: { "@type": "State", name: "Arizona" } },
    provider: { "@type": "Organization", name: "roofinstall.net", url: "https://roofinstall.net" },
  });

  return (
    <main>
      {faqSchema && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: faqSchema }} />
      )}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: localBizSchema }} />

      <article>
        {page.image_url && (
          <div className="art-hero">
            <img src={page.image_url} alt={page.image_alt || page.title} className="art-hero-img" />
          </div>
        )}

        <div className="art-header-wrap">
          <header className="art-header">
            <nav className="art-breadcrumb" aria-label="Breadcrumb">
              <Link href="/services/">Services</Link>
              <span aria-hidden="true"> / </span>
              <span>{city}, AZ</span>
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

            <div className="service-form-mobile">
              <ServiceLeadForm slug={params.slug} city={city} service={service} />
            </div>
          </div>

          <aside className="art-sidebar">
            <div className="art-sidebar-cta service-form-desktop">
              <ServiceLeadForm slug={params.slug} city={city} service={service} />
            </div>

            <div className="service-map">
              {mapsKey ? (
                <iframe
                  src={`https://www.google.com/maps/embed/v1/place?key=${mapsKey}&q=${encodeURIComponent(city + " AZ")}`}
                  width="100%"
                  height="280"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title={`Map of ${city}, AZ`}
                />
              ) : (
                /* TODO: Add NEXT_PUBLIC_GOOGLE_MAPS_API_KEY to .env.local to enable map */
                <div className="map-placeholder" role="img" aria-label={`Map of ${city}, AZ — coming soon`} />
              )}
            </div>
          </aside>
        </div>
      </article>
    </main>
  );
}

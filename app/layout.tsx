import type { Metadata } from "next";
import Link from "next/link";
import { Analytics } from "@vercel/analytics/next";
import "./globals.css";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://roofinstall.net";

const navGroups = [
  {
    label: "Roofing Costs",
    items: [
      {
        label: "How Much Does a New Roof Cost in Arizona",
        href: "/blog/roof-replacement-cost-arizona-2026/"
      },
      { label: "Free Cost Estimator", href: "/estimator/" }
    ]
  },
  {
    label: "Insurance Claims",
    items: [
      {
        label: "How to Negotiate a Roof Insurance Claim",
        href: "/blog/negotiate-roof-insurance-claim/"
      },
      {
        label: "Hail Damage Roof Arizona",
        href: "/blog/hail-damage-roof-arizona/"
      }
    ]
  },
  {
    label: "Materials",
    items: [
      {
        label: "Tile vs Shingle in Arizona",
        href: "/blog/tile-vs-shingle-roof-arizona/"
      },
      {
        label: "How Long Does a Roof Last in Arizona",
        href: "/blog/how-long-does-a-roof-last-arizona/"
      }
    ]
  },
  {
    label: "Contractor Vetting",
    items: [
      {
        label: "How to Spot a Roofing Scam",
        href: "/blog/roofing-scams-arizona/"
      },
      {
        label: "Verify a Contractor License",
        href: "https://roc.az.gov",
        external: true
      },
      {
        label: "GAF Master Elite Certification",
        href: "/blog/gaf-master-elite-certification/"
      }
    ]
  }
];

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "roofinstall.net | Roofing Cost Estimator and Homeowner Guides",
    template: "%s | roofinstall.net"
  },
  description:
    "Free roofing cost estimator and straight-talking homeowner guides for roof replacement, insurance claims, materials, and contractor vetting.",
  verification: {
    google: 'X3ZsqBnnc3iuBHb16eaFBUnIdrMSrk9o3lhjquYwMsE',
  },
  openGraph: {
    title: "roofinstall.net",
    description:
      "Free roofing cost estimator and homeowner roofing guides for the United States.",
    url: siteUrl,
    siteName: "roofinstall.net",
    type: "website"
  }
};

export default function RootLayout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body>
        <header className="site-header">
          {/* Top strip: brand | search | estimator CTA */}
          <div className="top-strip">
            <div className="top-strip-inner">
              <Link className="brand" href="/">
                roofinstall.net
              </Link>

              <form className="search-form" role="search">
                <label className="sr-only" htmlFor="site-search">
                  Search roofinstall.net
                </label>
                <input
                  id="site-search"
                  name="q"
                  placeholder="Search roofing costs, materials, insurance claims…"
                  type="search"
                />
                <button type="button">Search</button>
              </form>

              <Link className="header-cta" href="/estimator/">
                Free Estimator
              </Link>
            </div>
          </div>

          {/* Category nav strip */}
          <div className="nav-strip">
            <nav aria-label="Main navigation" className="site-nav">
              {navGroups.map((group) => (
                <div className="nav-group" key={group.label}>
                  <button className="nav-trigger" type="button">
                    {group.label}
                  </button>
                  <div className="nav-dropdown">
                    {group.items.map((item) =>
                      item.external ? (
                        <a
                          href={item.href}
                          key={item.href}
                          rel="noopener noreferrer"
                          target="_blank"
                        >
                          {item.label}
                        </a>
                      ) : (
                        <Link href={item.href} key={item.href}>
                          {item.label}
                        </Link>
                      )
                    )}
                  </div>
                </div>
              ))}
              <Link href="/services/">Services</Link>
              <Link href="/cities/">Cities</Link>
              <Link href="/estimator/">Tools</Link>
              <Link href="/about/">About</Link>
            </nav>
          </div>
        </header>

        <main>{children}</main>
        <Analytics />

        <footer className="site-footer">
          <div className="site-footer-inner">
            <div>
              <strong>roofinstall.net</strong>
              <p>
                Independent homeowner roofing guidance. Not a contractor, not a
                home services brand dressed up as advice.
              </p>
            </div>
            <nav aria-label="Footer navigation">
              <Link href="/contact/">Contact</Link>
              <Link href="/robots.txt">robots.txt</Link>
              <Link href="/sitemap.xml">sitemap.xml</Link>
            </nav>
          </div>
        </footer>
      </body>
    </html>
  );
}

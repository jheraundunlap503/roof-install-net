import Link from "next/link";

export default function NotFound() {
  return (
    <section className="section">
      <div className="section-header">
        <span className="eyebrow">404</span>
        <h1>That roofing page is not published yet.</h1>
        <p>
          The site is being built in approval-gated phases. Try the estimator,
          blog, or services index.
        </p>
        <div className="actions">
          <Link className="button" href="/estimator/">
            Estimator
          </Link>
          <Link className="button light" href="/blog/">
            Blog
          </Link>
        </div>
      </div>
    </section>
  );
}

import Link from "next/link";

export function ToolCard() {
  return (
    <aside className="tool-card">
      <span className="label">Free tool</span>
      <h2>Roof replacement cost estimator</h2>
      <p>
        Estimate your roof replacement range by ZIP code, home size, roof type,
        and material tier before you collect bids.
      </p>
      <Link className="button" href="/estimator/">
        Start estimator
      </Link>
    </aside>
  );
}

import type { Metadata } from 'next';
import RoofEstimator from '@/components/RoofEstimator';

export const metadata: Metadata = {
  title: 'Roof Replacement Cost Estimator',
  description:
    'Get a free roof replacement cost estimate by ZIP code, home size, roof type, and material. See your range in under 60 seconds.',
};

export default function EstimatorPage() {
  return (
    <div className="site-width">
      <section className="page-hero">
        <span className="label">Free tool</span>
        <h1>Roof replacement cost estimator</h1>
        <p className="lede">
          Answer 4 questions and get a real cost range for your area. No contractor upsell, no signup wall before your estimate.
        </p>
      </section>

      <section style={{ padding: '40px 0 0' }}>
        <RoofEstimator />
      </section>

      <section className="section">
        <div className="callout">
          <p>
            This estimate is a planning tool, not a quote. A licensed contractor inspects pitch, decking condition, flashing, and existing layers before pricing a job. Use this range to sanity-check bids, not to replace them.
          </p>
        </div>
      </section>
    </div>
  );
}

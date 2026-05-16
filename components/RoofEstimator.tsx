'use client';

import { useState } from 'react';

type StepId = 1 | 2 | 3 | 4 | 'loading' | 'teaser' | 'result';

interface FormState {
  zip: string;
  sqft: string;
  roofType: string;
  tier: string;
}

interface Estimate {
  low: number;
  high: number;
  midpoint: number;
  explanation: string;
}

const SQFT_OPTIONS = [
  { value: 'under1500',  label: 'Under 1,500 sq ft', sub: 'Small home or condo' },
  { value: '1500-2500',  label: '1,500 – 2,500 sq ft', sub: 'Typical Arizona home' },
  { value: '2500-3500',  label: '2,500 – 3,500 sq ft', sub: 'Larger single-family' },
  { value: '3500plus',   label: '3,500+ sq ft', sub: 'Large or estate home' },
];

const ROOF_TYPES = [
  { value: 'shingle', label: 'Asphalt Shingle', sub: '15–20 yr lifespan in AZ' },
  { value: 'tile',    label: 'Tile',            sub: '30–50 yr lifespan' },
  { value: 'foam',    label: 'Flat / Foam',     sub: 'Common on flat AZ roofs' },
  { value: 'metal',   label: 'Metal',           sub: '40–70 yr lifespan' },
];

const TIERS = [
  { value: 'standard', label: 'Standard',  sub: 'Builder-grade, basic warranty' },
  { value: 'mid',      label: 'Mid-Grade', sub: 'Better durability + warranty' },
  { value: 'premium',  label: 'Premium',   sub: 'Top materials, longest life' },
];

function SelectCard({
  label, sub, selected, onClick,
}: {
  label: string; sub: string; selected: boolean; onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`est-card${selected ? ' est-card--selected' : ''}`}
      aria-pressed={selected}
    >
      <span className="est-card-label">{label}</span>
      <span className="est-card-sub">{sub}</span>
    </button>
  );
}

export default function RoofEstimator() {
  const [step, setStep]       = useState<StepId>(1);
  const [form, setForm]       = useState<FormState>({ zip: '', sqft: '', roofType: '', tier: '' });
  const [email, setEmail]     = useState('');
  const [estimate, setEstimate] = useState<Estimate | null>(null);
  const [error, setError]     = useState('');

  function set<K extends keyof FormState>(key: K, val: string) {
    setForm(f => ({ ...f, [key]: val }));
  }

  async function handleSubmit() {
    setStep('loading');
    setError('');
    try {
      const res = await fetch('/api/estimate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error('Request failed');
      const data: Estimate = await res.json();
      setEstimate(data);
      setStep('teaser');
    } catch {
      setError('Something went wrong. Please try again.');
      setStep(4);
    }
  }

  function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        ...form,
        costLow: estimate?.low,
        costHigh: estimate?.high,
      }),
    }).catch(err => console.error('[leads]', err));

    setStep('result');
  }

  const numericStep = typeof step === 'number' ? step : null;

  return (
    <div className="est-shell">

      {/* ── Progress bar ── */}
      {numericStep && (
        <div className="est-progress" aria-label="Form progress">
          {([1, 2, 3, 4] as const).map((n) => {
            const state = numericStep === n ? 'active' : numericStep > n ? 'done' : 'idle';
            return (
              <div key={n} className={`est-progress-step est-progress-step--${state}`}>
                <span className="est-progress-dot">
                  {state === 'done' ? '✓' : n}
                </span>
                <span className="est-progress-label">
                  {n === 1 ? 'Location' : n === 2 ? 'Home Size' : n === 3 ? 'Roof Type' : 'Material'}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* ── Step 1: ZIP ── */}
      {step === 1 && (
        <div className="est-step">
          <span className="label">Step 1 of 4</span>
          <h2 className="est-step-heading">What is your ZIP code?</h2>
          <p className="est-step-sub">Used to adjust for local labor costs in your area.</p>
          <input
            className="input est-zip-input"
            type="text"
            inputMode="numeric"
            maxLength={5}
            placeholder="85201"
            value={form.zip}
            onChange={e => set('zip', e.target.value.replace(/\D/g, ''))}
            autoFocus
          />
          <div className="est-nav">
            <button
              className="button"
              disabled={form.zip.length !== 5}
              onClick={() => setStep(2)}
            >
              Continue
            </button>
          </div>
        </div>
      )}

      {/* ── Step 2: Sq Ft ── */}
      {step === 2 && (
        <div className="est-step">
          <span className="label">Step 2 of 4</span>
          <h2 className="est-step-heading">How large is your home?</h2>
          <p className="est-step-sub">Roof square footage is calculated from your home size and a pitch factor.</p>
          <div className="est-card-grid">
            {SQFT_OPTIONS.map(opt => (
              <SelectCard
                key={opt.value}
                label={opt.label}
                sub={opt.sub}
                selected={form.sqft === opt.value}
                onClick={() => set('sqft', opt.value)}
              />
            ))}
          </div>
          <div className="est-nav">
            <button className="button button--ghost" onClick={() => setStep(1)}>Back</button>
            <button className="button" disabled={!form.sqft} onClick={() => setStep(3)}>Continue</button>
          </div>
        </div>
      )}

      {/* ── Step 3: Roof Type ── */}
      {step === 3 && (
        <div className="est-step">
          <span className="label">Step 3 of 4</span>
          <h2 className="est-step-heading">What type of roof?</h2>
          <p className="est-step-sub">If replacing, select what you want installed. Not sure? Asphalt shingle is the most common in Arizona.</p>
          <div className="est-card-grid">
            {ROOF_TYPES.map(opt => (
              <SelectCard
                key={opt.value}
                label={opt.label}
                sub={opt.sub}
                selected={form.roofType === opt.value}
                onClick={() => set('roofType', opt.value)}
              />
            ))}
          </div>
          <div className="est-nav">
            <button className="button button--ghost" onClick={() => setStep(2)}>Back</button>
            <button className="button" disabled={!form.roofType} onClick={() => setStep(4)}>Continue</button>
          </div>
        </div>
      )}

      {/* ── Step 4: Material Tier ── */}
      {step === 4 && (
        <div className="est-step">
          <span className="label">Step 4 of 4</span>
          <h2 className="est-step-heading">Which material tier?</h2>
          <p className="est-step-sub">Tier affects both price and how long your roof lasts. Premium often costs less per year when you factor in lifespan.</p>
          <div className="est-card-grid est-card-grid--three">
            {TIERS.map(opt => (
              <SelectCard
                key={opt.value}
                label={opt.label}
                sub={opt.sub}
                selected={form.tier === opt.value}
                onClick={() => set('tier', opt.value)}
              />
            ))}
          </div>
          {error && <p className="est-error">{error}</p>}
          <div className="est-nav">
            <button className="button button--ghost" onClick={() => setStep(3)}>Back</button>
            <button className="button" disabled={!form.tier} onClick={handleSubmit}>
              Get My Estimate
            </button>
          </div>
        </div>
      )}

      {/* ── Loading ── */}
      {step === 'loading' && (
        <div className="est-loading">
          <div className="est-spinner" aria-hidden="true" />
          <p>Calculating your estimate…</p>
        </div>
      )}

      {/* ── Teaser / Email Gate ── */}
      {step === 'teaser' && estimate && (
        <div className="est-teaser">
          <span className="label">Your estimate is ready</span>
          <div className="est-teaser-range">
            ${estimate.low.toLocaleString()} – ${estimate.high.toLocaleString()}
          </div>
          <p className="est-teaser-copy">
            Enter your email to see the full breakdown, including what is driving that range and what your contractor should include in any quote.
          </p>
          <form className="est-gate-form" onSubmit={handleEmailSubmit} noValidate>
            <input
              className="input"
              type="email"
              placeholder="your@email.com"
              value={email}
              onChange={e => setEmail(e.target.value)}
              required
              autoFocus
            />
            <button className="button" type="submit">Show Full Estimate</button>
          </form>
          <p className="est-gate-note muted">
            One confirmation email with your estimate. No spam.
          </p>
        </div>
      )}

      {/* ── Full Result ── */}
      {step === 'result' && estimate && (
        <div className="est-result">
          <span className="label">Estimate for ZIP {form.zip}</span>

          <div className="est-result-range">
            <div className="est-result-endpoint">
              <span className="est-result-end-val">${estimate.low.toLocaleString()}</span>
              <span className="est-result-end-label">Low end</span>
            </div>
            <div className="est-result-mid">
              <span className="est-result-mid-val">${estimate.midpoint.toLocaleString()}</span>
              <span className="est-result-mid-label">Typical cost</span>
            </div>
            <div className="est-result-endpoint">
              <span className="est-result-end-val">${estimate.high.toLocaleString()}</span>
              <span className="est-result-end-label">High end</span>
            </div>
          </div>

          <div className="est-result-band">
            <div className="est-result-band-fill" />
            <div className="est-result-band-dot" style={{ left: '50%' }} />
          </div>

          <div className="est-result-explanation">
            <p>{estimate.explanation}</p>
          </div>

          <div className="est-result-factors">
            <h3>What this estimate does not include</h3>
            <ul className="list">
              <li>Roof pitch and access difficulty (add $1–4/sq ft for steep or complex roofs)</li>
              <li>Tear-off of existing layers (1 layer adds ~$1–2/sq ft; 2 layers adds ~$2–3/sq ft)</li>
              <li>Code-required upgrades like decking replacement or new vents</li>
              <li>Permit fees, which vary by Arizona city and county</li>
            </ul>
          </div>

          <div className="est-result-cta">
            <a className="button" href="/contact/">Get Free Quotes from Local Roofers</a>
            <button
              className="button button--ghost"
              onClick={() => { setStep(1); setForm({ zip: '', sqft: '', roofType: '', tier: '' }); setEmail(''); setEstimate(null); }}
            >
              Start Over
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

'use client';

import { useState, useEffect, useRef, useMemo } from 'react';

/* ── Domain data (references/roofing-domain-data.md) ── */

const MATERIALS = [
  { value: '3tab',    label: '3-Tab Asphalt',        low: 350,  high: 500,  note: '20–25 yr' },
  { value: 'arch',    label: 'Architectural Shingle', low: 400,  high: 650,  note: '30–50 yr' },
  { value: 'impact',  label: 'Impact-Resistant Shingle', low: 500,  high: 800,  note: '30–50 yr' },
  { value: 'foam',    label: 'Spray Foam (flat)',     low: 400,  high: 800,  note: '15–25 yr' },
  { value: 'concrete',label: 'Concrete Tile',         low: 700,  high: 1200, note: '30–50 yr' },
  { value: 'clay',    label: 'Clay Tile',             low: 1000, high: 1800, note: '50–100 yr' },
  { value: 'metal',   label: 'Standing Seam Metal',   low: 800,  high: 1400, note: '40–60 yr' },
];

const PITCHES = [
  { value: 'low',   label: 'Low (2/12–3/12)',   mult: 1.04 },
  { value: 'std',   label: 'Standard (4/12–6/12)', mult: 1.08 },
  { value: 'steep', label: 'Steep (7/12–9/12)', mult: 1.20 },
  { value: 'vsteep',label: 'Very steep (10/12+)', mult: 1.36 },
];

const COMPLEXITY = [
  { value: 'simple',  label: 'Simple gable',   waste: 0.08, note: '2 planes, no valleys' },
  { value: 'moderate',label: 'Moderate hip',   waste: 0.12, note: '4 planes, some cuts' },
  { value: 'complex', label: 'Complex',        waste: 0.17, note: 'Valleys, dormers, skylights' },
  { value: 'vcomplex',label: 'Very complex',   waste: 0.22, note: 'Cut-up, many penetrations' },
];

const REGIONS = [
  { value: 'phoenix', label: 'Phoenix metro',            mult: 1.07 },
  { value: 'tucson',  label: 'Tucson',                   mult: 0.97 },
  { value: 'premium', label: 'Scottsdale / Paradise Valley', mult: 1.15 },
  { value: 'national',label: 'National average',         mult: 1.00 },
];

function roundTo100(n: number) {
  return Math.round(n / 100) * 100;
}

/* Animate a progress value 0→1 over `duration` ms whenever `key` changes. */
function useCountUp(key: string, duration = 500) {
  const [t, setT] = useState(1);
  const raf = useRef<number>();
  const start = useRef<number>(0);

  useEffect(() => {
    cancelAnimationFrame(raf.current!);
    start.current = 0;
    const tick = (now: number) => {
      if (!start.current) start.current = now;
      const elapsed = now - start.current;
      const p = Math.min(elapsed / duration, 1);
      // easeOutCubic
      setT(1 - Math.pow(1 - p, 3));
      if (p < 1) raf.current = requestAnimationFrame(tick);
    };
    raf.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf.current!);
  }, [key, duration]);

  return t;
}

export default function RoofCostCalculator() {
  const [sqft, setSqft]         = useState('1600');
  const [material, setMaterial] = useState('arch');
  const [pitch, setPitch]       = useState('std');
  const [complexity, setComplexity] = useState('moderate');
  const [region, setRegion]     = useState('phoenix');

  const [email, setEmail]   = useState('');
  const [sent, setSent]     = useState(false);

  const result = useMemo(() => {
    const footprint = Math.max(0, parseInt(sqft.replace(/\D/g, ''), 10) || 0);
    const mat = MATERIALS.find(m => m.value === material)!;
    const pit = PITCHES.find(p => p.value === pitch)!;
    const cx  = COMPLEXITY.find(c => c.value === complexity)!;
    const reg = REGIONS.find(r => r.value === region)!;

    const roofArea   = footprint * pit.mult;
    const squares    = roofArea / 100;
    const wasteSquares = squares * (1 + cx.waste);

    const low  = roundTo100(wasteSquares * mat.low  * reg.mult);
    const high = roundTo100(wasteSquares * mat.high * reg.mult);
    const mid  = roundTo100((low + high) / 2);

    return { footprint, mat, pit, cx, reg, roofArea, squares, wasteSquares, low, high, mid };
  }, [sqft, material, pitch, complexity, region]);

  const key = `${result.low}-${result.high}`;
  const t = useCountUp(key);

  const showResult = result.footprint > 0;
  const animLow  = roundTo100(result.low  * t);
  const animMid  = roundTo100(result.mid  * t);
  const animHigh = roundTo100(result.high * t);

  function handlePdf(e: React.FormEvent) {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    fetch('/api/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email,
        source: 'roof-cost-estimator',
        sqft: result.footprint,
        material: result.mat.label,
        pitch: result.pit.label,
        complexity: result.cx.label,
        region: result.reg.label,
        costLow: result.low,
        costHigh: result.high,
      }),
    }).catch(err => console.error('[leads]', err));
    setSent(true);
  }

  return (
    <div className="calc-shell">
      <div className="calc-grid">
        {/* ── Inputs ── */}
        <div className="calc-field">
          <label className="calc-label" htmlFor="calc-sqft">Home footprint (sq ft)</label>
          <input
            id="calc-sqft"
            className="input"
            type="text"
            inputMode="numeric"
            value={sqft}
            onChange={e => setSqft(e.target.value.replace(/\D/g, '').slice(0, 6))}
            placeholder="1600"
          />
          <span className="calc-hint">Ground-floor area under the roof, not total living space.</span>
        </div>

        <div className="calc-field">
          <label className="calc-label" htmlFor="calc-material">Roofing material</label>
          <select id="calc-material" className="select" value={material} onChange={e => setMaterial(e.target.value)}>
            {MATERIALS.map(m => (
              <option key={m.value} value={m.value}>{m.label} · {m.note}</option>
            ))}
          </select>
        </div>

        <div className="calc-field">
          <label className="calc-label" htmlFor="calc-pitch">Roof pitch</label>
          <select id="calc-pitch" className="select" value={pitch} onChange={e => setPitch(e.target.value)}>
            {PITCHES.map(p => (
              <option key={p.value} value={p.value}>{p.label}</option>
            ))}
          </select>
        </div>

        <div className="calc-field">
          <label className="calc-label" htmlFor="calc-complexity">Roof complexity</label>
          <select id="calc-complexity" className="select" value={complexity} onChange={e => setComplexity(e.target.value)}>
            {COMPLEXITY.map(c => (
              <option key={c.value} value={c.value}>{c.label} · {c.note}</option>
            ))}
          </select>
        </div>

        <div className="calc-field calc-field--full">
          <label className="calc-label" htmlFor="calc-region">Region</label>
          <select id="calc-region" className="select" value={region} onChange={e => setRegion(e.target.value)}>
            {REGIONS.map(r => (
              <option key={r.value} value={r.value}>{r.label}</option>
            ))}
          </select>
        </div>
      </div>

      {/* ── Result ── */}
      {showResult ? (
        <div className="calc-result">
          <div className="est-result-range">
            <div className="est-result-endpoint">
              <span className="est-result-end-val">${animLow.toLocaleString()}</span>
              <span className="est-result-end-label">Low end</span>
            </div>
            <div className="est-result-mid">
              <span className="est-result-mid-val">${animMid.toLocaleString()}</span>
              <span className="est-result-mid-label">Typical cost</span>
            </div>
            <div className="est-result-endpoint">
              <span className="est-result-end-val">${animHigh.toLocaleString()}</span>
              <span className="est-result-end-label">High end</span>
            </div>
          </div>

          <p className="calc-breakdown">
            {result.footprint.toLocaleString()} sq ft × {result.pit.mult} pitch ={' '}
            {Math.round(result.roofArea).toLocaleString()} sq ft ÷ 100 ={' '}
            {result.squares.toFixed(1)} squares + {Math.round(result.cx.waste * 100)}% waste ={' '}
            {result.wasteSquares.toFixed(1)} squares × ${result.mat.low}–${result.mat.high}/sq
            {result.reg.mult !== 1 && <> × {result.reg.mult} ({result.reg.label})</>}
          </p>

          <p className="calc-method-line">
            Based on installed cost ranges for {result.mat.label.toLowerCase()} in the {result.reg.label} market. Rounded to the nearest $100.
          </p>

          {/* ── Gated PDF CTA (result above is always free) ── */}
          <div className="calc-pdf">
            {sent ? (
              <p className="calc-pdf-sent">
                Check your inbox. We sent this estimate and a contractor question checklist to <strong>{email}</strong>.
              </p>
            ) : (
              <form onSubmit={handlePdf} noValidate>
                <p className="calc-pdf-copy">Want this estimate as a PDF you can bring to contractor quotes?</p>
                <div className="calc-pdf-row">
                  <input
                    className="input"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                  <button className="button" type="submit">Send Me the PDF</button>
                </div>
                <span className="calc-pdf-note">No spam. One email with your estimate.</span>
              </form>
            )}
          </div>
        </div>
      ) : (
        <p className="calc-empty">Enter your home footprint above to see an estimate.</p>
      )}
    </div>
  );
}

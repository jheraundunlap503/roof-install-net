"use client";

import { useState } from "react";

type Props = {
  slug: string;
  city: string;
  service: string;
};

export function ServiceLeadForm({ slug, city, service }: Props) {
  const [status, setStatus] = useState<"idle" | "sending" | "done" | "error">("idle");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("sending");
    const form = e.currentTarget;
    const fd = new FormData(form);
    const payload = {
      name: fd.get("name") as string,
      email: fd.get("email") as string,
      phone: fd.get("phone") as string,
      message: fd.get("message") as string,
      city,
      service_type: service,
      source: `service-page-${slug}`,
    };

    try {
      const res = await fetch("/api/service-leads", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return (
      <div className="slf-success">
        <span className="slf-success-icon">✓</span>
        <p className="slf-success-heading">Request received</p>
        <p className="slf-success-body">
          A roofinstall.net team member will match you with up to 3 licensed {city} contractors
          within 24 hours. Check your email for next steps.
        </p>
      </div>
    );
  }

  return (
    <div className="slf-card">
      <h3 className="slf-heading">Get 3 Free Quotes from Licensed {city} Roofers</h3>
      <p className="slf-subtext">
        We connect you with ROC-licensed contractors only. No spam. No obligation.
      </p>

      <div className="slf-trust">
        <span className="slf-trust-item"><span className="slf-check">✓</span> ROC-Licensed contractors only</span>
        <span className="slf-trust-item"><span className="slf-check">✓</span> Free — no cost to you</span>
        <span className="slf-trust-item"><span className="slf-check">✓</span> Response within 24 hours</span>
      </div>

      <form onSubmit={handleSubmit} noValidate>
        <div className="slf-field">
          <label className="slf-label" htmlFor="slf-name">Name</label>
          <input id="slf-name" className="slf-input" type="text" name="name" required
            placeholder="Your name" autoComplete="name" />
        </div>

        <div className="slf-field">
          <label className="slf-label" htmlFor="slf-email">Email</label>
          <input id="slf-email" className="slf-input" type="email" name="email" required
            placeholder="you@email.com" autoComplete="email" />
        </div>

        <div className="slf-field">
          <label className="slf-label" htmlFor="slf-phone">
            Phone <em className="slf-optional">(optional)</em>
          </label>
          <input id="slf-phone" className="slf-input" type="tel" name="phone"
            placeholder="(480) 555-0000" autoComplete="tel" />
        </div>

        <div className="slf-field">
          <label className="slf-label" htmlFor="slf-message">
            Project description <em className="slf-optional">(optional)</em>
          </label>
          <textarea id="slf-message" className="slf-textarea" name="message" rows={4}
            placeholder="e.g. Foam roof recoat, approx 1,800 sq ft flat roof in Dobson Ranch" />
        </div>

        <button className="slf-cta" type="submit" disabled={status === "sending"}>
          {status === "sending" ? "Sending…" : "Get My Free Quotes →"}
        </button>

        <p className="slf-privacy">Your information is never sold or shared with non-contractors</p>

        {status === "error" && (
          <p className="slf-error">Something went wrong. Please try again.</p>
        )}
      </form>
    </div>
  );
}

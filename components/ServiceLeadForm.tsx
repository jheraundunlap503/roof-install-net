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
      <div className="lead-form-thanks">
        <p>
          <strong>Got it.</strong> We&rsquo;ll follow up with local contractor options for your{" "}
          {city} project shortly.
        </p>
      </div>
    );
  }

  return (
    <form className="lead-form" onSubmit={handleSubmit} noValidate>
      <h3 className="lead-form-heading">Get free local quotes</h3>
      <p className="lead-form-sub">
        Connect with licensed {city} roofing contractors.
      </p>

      <label className="lead-form-field">
        <span>Name</span>
        <input type="text" name="name" required placeholder="Your name" autoComplete="name" />
      </label>

      <label className="lead-form-field">
        <span>Email</span>
        <input
          type="email"
          name="email"
          required
          placeholder="you@email.com"
          autoComplete="email"
        />
      </label>

      <label className="lead-form-field">
        <span>
          Phone <em>(optional)</em>
        </span>
        <input type="tel" name="phone" placeholder="(480) 555-0000" autoComplete="tel" />
      </label>

      <label className="lead-form-field">
        <span>
          Message <em>(optional)</em>
        </span>
        <textarea
          name="message"
          rows={3}
          placeholder="Any details about your project..."
        />
      </label>

      <button type="submit" className="lead-form-submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending…" : "Request quotes"}
      </button>

      {status === "error" && (
        <p className="lead-form-error">Something went wrong. Please try again.</p>
      )}
    </form>
  );
}

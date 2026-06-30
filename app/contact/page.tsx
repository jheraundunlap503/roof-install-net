import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Contact roofinstall.net about homeowner roofing resources, cost guides, and site questions."
};

export default function ContactPage() {
  return (
    <div className="site-width">
      <section className="page-hero">
        <span className="label">Contact</span>
        <h1>Send a note about a roofing guide or local coverage request.</h1>
        <p className="lede">
          Useful notes: corrections or source suggestions for existing guides,
          requests for Phoenix metro city coverage, or questions homeowners keep
          asking about bids or claims.
        </p>
      </section>

      <section className="section">
        <p>
          Email us at{" "}
          <a href="mailto:hello@roofinstall.net">hello@roofinstall.net</a>.
        </p>
      </section>
    </div>
  );
}

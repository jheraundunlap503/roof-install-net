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
          This form is visual only in Phase 1. The live workflow connects after
          Supabase, Beehiiv, and Brevo approval gates.
        </p>
      </section>

      <section className="section split">
        <div>
          <h2>Useful notes to send</h2>
          <ul className="list">
            <li>Corrections or source suggestions for roofing articles.</li>
            <li>Requests for Phoenix metro city coverage.</li>
            <li>Questions homeowners keep asking about bids or claims.</li>
          </ul>
          <div className="callout">
            <p>
              No message is sent from this preview. Email activation requires
              explicit Brevo template approval.
            </p>
          </div>
        </div>

        <form className="tool-card form-shell">
          <label>
            Name
            <input className="input" name="name" type="text" />
          </label>
          <label>
            Email
            <input className="input" name="email" type="email" />
          </label>
          <label>
            Message
            <textarea className="textarea" name="message" />
          </label>
          <button className="button" disabled type="button">
            Connects later
          </button>
        </form>
      </section>
    </div>
  );
}

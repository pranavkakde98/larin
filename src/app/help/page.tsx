import type { Metadata } from "next";
import { Accordion } from "@/components/Accordion";
import { ContactForm } from "@/components/ContactForm";
import { helpFaq } from "@/content/site";

export const metadata: Metadata = {
  title: "Help and contact",
  description: "Answers about La Reiné shower gels and mists, delivery, gifting and returns, and a way to write to us.",
};

export default function Help() {
  return (
    <div className="wrap" style={{ paddingBottom: "var(--section)" }}>
      <header className="page-head">
        <p className="eyebrow muted">Help</p>
        <h1>How can we help?</h1>
      </header>
      <div className="feature" style={{ alignItems: "start" }}>
        <div className="media">
          <Accordion items={helpFaq.map((f) => ({ title: f.q, body: <p>{f.a}</p> }))} />
        </div>
        <div className="text" id="contact">
          <h2 className="display-3">Write to us</h2>
          <p className="muted">Questions about your skin, an order or a gift. A person reads every message.</p>
          <ContactForm />
          <p className="notice">We will never ask for your OTP, card PIN or bank details, and never ask for payment outside this website.</p>
        </div>
      </div>
    </div>
  );
}

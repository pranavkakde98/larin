import type { Metadata } from "next";

export const metadata: Metadata = { title: "Shipping", description: "How La Reiné orders are packed, wrapped and delivered across India." };

export default function Shipping() {
  return (
    <div className="wrap narrow" style={{ paddingBottom: "var(--section)" }}>
      <header className="page-head">
        <p className="eyebrow muted">Policies</p>
        <h1>Shipping</h1>
      </header>
      <p className="notice" style={{ maxWidth: "68ch", marginBottom: 32 }}>
        Draft. Highlighted details are being confirmed by La Reiné.
      </p>
      <div className="prose">
        <p>We deliver across India. Enter your pincode on any product page for an estimated delivery date; most orders arrive in 3 to 6 days.</p>
        <h2>Gift wrapping</h2>
        <p>Every order can be wrapped by hand with a handwritten note at no extra cost. Prices are never included in the parcel.</p>
        <h2>Delivery charges</h2>
        <p>
          Delivery charges are shown at checkout. Free delivery threshold: <mark>to be confirmed</mark>.
        </p>
        <h2>Cash on delivery</h2>
        <p>
          <mark>To be confirmed</mark>.
        </p>
        <h2>Questions</h2>
        <p>Write to us through the Help page with your order number.</p>
      </div>
    </div>
  );
}

import type { Metadata } from "next";
import { Checkout } from "@/components/Checkout";

export const metadata: Metadata = { title: "Checkout", robots: { index: false } };

export default function CheckoutPage() {
  return (
    <div className="wrap" style={{ paddingBottom: "var(--section)" }}>
      <header className="page-head" style={{ paddingBottom: 24 }}>
        <p className="eyebrow muted">Checkout</p>
        <h1>Almost yours.</h1>
      </header>
      <Checkout />
    </div>
  );
}

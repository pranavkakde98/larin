"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { settings } from "@/content/site";
import { useCart } from "@/lib/cart";
import { deliveryWindow, inr, validPincode } from "@/lib/format";

const fields = [
  { n: "name", label: "Full name", ac: "name", full: true },
  { n: "phone", label: "Mobile number", ac: "tel", type: "tel" },
  { n: "email", label: "Email", ac: "email", type: "email" },
  { n: "address", label: "Address", ac: "street-address", full: true },
  { n: "city", label: "City", ac: "address-level2" },
  { n: "state", label: "State", ac: "address-level1" },
  { n: "pincode", label: "Pincode", ac: "postal-code", inputMode: "numeric" as const },
];

// Mock checkout (no payment keys yet). Payment is simulated and clearly labelled; orders are
// saved locally by /api/orders. Nothing is sent to the live store or to Razorpay.
export function Checkout() {
  const router = useRouter();
  const { lines, gifts, subtotal, gift, setGift, clear } = useCart();
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [pay, setPay] = useState("upi");
  const [pin, setPin] = useState("");
  const [state, setState] = useState<"idle" | "paying" | "error">("idle");

  if (lines.length === 0 && gifts.length === 0) {
    return (
      <div className="empty" style={{ paddingBlock: 64 }}>
        <p className="display-3">Your bag is empty.</p>
        <p className="muted">Your ritual is waiting.</p>
        <Link href="/shop" className="btn">
          Shop the collection
        </Link>
      </div>
    );
  }

  const delivery = 0;
  const total = subtotal + delivery;

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const data = Object.fromEntries(new FormData(e.currentTarget).entries()) as Record<string, string>;
    const errs: Record<string, string> = {};
    if (!data.name?.trim()) errs.name = "Please enter your name.";
    if (!/^[6-9]\d{9}$/.test((data.phone ?? "").replace(/\D/g, "").slice(-10))) errs.phone = "Please enter a 10-digit mobile number.";
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? "")) errs.email = "Please enter a valid email.";
    if ((data.address ?? "").trim().length < 6) errs.address = "Please enter your full address.";
    if (!data.city?.trim()) errs.city = "Please enter your city.";
    if (!data.state?.trim()) errs.state = "Please enter your state.";
    if (!validPincode(data.pincode ?? "")) errs.pincode = "Please enter a 6-digit pincode.";
    setErrors(errs);
    if (Object.keys(errs).length) {
      const el = document.getElementById(`co-${Object.keys(errs)[0]}`);
      el?.scrollIntoView({ block: "center", behavior: "smooth" });
      el?.focus({ preventScroll: true });
      return;
    }
    setState("paying");
    try {
      const r = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          customer: data,
          payment: pay,
          lines: lines.map(({ id, qty }) => ({ id, qty })),
          gift,
          gifts: gifts.map((g) => ({ to: g.to, message: g.message, items: g.items.map(({ id, qty }) => ({ id, qty })) })),
        }),
      });
      if (!r.ok) throw new Error();
      const order = await r.json();
      sessionStorage.setItem(`lareine.order.${order.id}`, JSON.stringify(order));
      clear();
      setGift({ note: "" });
      router.push(`/order/${order.id}`);
    } catch {
      setState("error");
    }
  }

  return (
    <form className="checkout" onSubmit={submit} noValidate>
      <div style={{ display: "grid", gap: 40 }}>
        <section aria-labelledby="co-ship" style={{ display: "grid", gap: 18 }}>
          <h2 id="co-ship" className="display-3">
            Delivery
          </h2>
          <div className="form-grid">
            {fields.map((f) => (
              <div key={f.n} className={`field ${f.full ? "full" : ""}`}>
                <label htmlFor={`co-${f.n}`}>{f.label}</label>
                <input
                  id={`co-${f.n}`}
                  name={f.n}
                  type={f.type ?? "text"}
                  autoComplete={f.ac}
                  inputMode={f.inputMode}
                  className="input"
                  aria-invalid={!!errors[f.n]}
                  aria-describedby={errors[f.n] ? `co-${f.n}-e` : undefined}
                  onChange={f.n === "pincode" ? (e) => setPin(e.target.value) : undefined}
                />
                {errors[f.n] && (
                  <span id={`co-${f.n}-e`} className="err">
                    {errors[f.n]}
                  </span>
                )}
              </div>
            ))}
          </div>
          {validPincode(pin) && (
            <p className="muted" aria-live="polite">
              Estimated delivery: <strong style={{ color: "var(--ink)", fontWeight: 500 }}>{deliveryWindow(settings.delivery.minDays, settings.delivery.maxDays)}</strong>
            </p>
          )}
        </section>

        <section aria-labelledby="co-pay" style={{ display: "grid", gap: 14 }}>
          <div className="row-between" style={{ justifyContent: "flex-start", gap: 14 }}>
            <h2 id="co-pay" className="display-3">
              Payment
            </h2>
            <span className="test-badge">Test mode</span>
          </div>
          <p className="muted" style={{ fontSize: "0.9rem" }}>
            This is a local preview. No payment is taken and no order reaches the store.
          </p>
          <fieldset style={{ border: 0, padding: 0, display: "grid", gap: 10 }}>
            <legend className="sr-only">Payment method</legend>
            {[
              ["upi", "UPI", "Google Pay, PhonePe, Paytm and any UPI app"],
              ["card", "Card", "Credit and debit cards"],
              ["netbanking", "Netbanking", "All major banks"],
            ].map(([v, t, d]) => (
              <label key={v} className="pay-opt">
                <input type="radio" name="payment" value={v} checked={pay === v} onChange={() => setPay(v)} />
                <span>
                  {t}
                  <br />
                  <span className="muted" style={{ fontSize: "0.85rem" }}>
                    {d}
                  </span>
                </span>
              </label>
            ))}
          </fieldset>
        </section>
        {/* M5: on phones and tablets the error sits right above the button that was tapped */}
        {state === "error" && (
          <p role="alert" className="co-error co-error-mobile">
            We couldn&rsquo;t place the order. Please try again.
          </p>
        )}
        <button className="btn block co-submit-mobile" type="submit" disabled={state === "paying"}>
          {state === "paying" ? "Placing order…" : `Place order · ${inr(total)}`}
        </button>
      </div>

      <aside className="co-summary">
        <h2 className="display-2" style={{ fontSize: "1.5rem" }}>
          Your order
        </h2>
        <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 12 }}>
          {lines.map((l) => (
            <li key={l.id} style={{ display: "grid", gridTemplateColumns: "56px 1fr auto", gap: 12, alignItems: "center" }}>
              <div className="img-frame" style={{ aspectRatio: "4/5" }}>
                <Image src={l.image} alt="" width={112} height={140} sizes="56px" />
              </div>
              <div>
                <p style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem", lineHeight: 1.15 }}>{l.name}</p>
                <p className="muted" style={{ fontSize: "0.85rem" }}>
                  {l.formatLabel} · Qty {l.qty}
                </p>
              </div>
              <span className="price">{inr(l.price * l.qty)}</span>
            </li>
          ))}
        </ul>
        {gifts.map((g, i) => (
          <div key={g.id} className="bag-gift" style={{ margin: 0 }}>
            <p className="label">
              Gift box{gifts.length > 1 ? ` ${i + 1}` : ""}
              {g.to ? ` · for ${g.to}` : ""}
            </p>
            <ul className="plain" style={{ display: "grid", gap: 6 }}>
              {g.items.map((l) => (
                <li key={l.id} className="row-between" style={{ fontSize: "0.92rem" }}>
                  <span>
                    {l.qty} × {l.name} · {l.formatLabel}
                  </span>
                  <span className="price">{inr(l.price * l.qty)}</span>
                </li>
              ))}
            </ul>
            {g.message && <p className="gift-msg">&ldquo;{g.message}&rdquo;</p>}
          </div>
        ))}
        <div style={{ borderTop: "1px solid var(--line)", paddingTop: 12, display: "grid", gap: 6 }}>
          <div className="row-between">
            <span>Subtotal</span>
            <span className="price">{inr(subtotal)}</span>
          </div>
          <div className="row-between">
            <span>Delivery</span>
            <span className="muted">To be confirmed</span>
          </div>
          <div className="row-between">
            <span>Gift wrap{gifts.length ? " and notes" : gift.wrap ? " and note" : ""}</span>
            <span className="muted">{gift.wrap || gifts.length ? "Complimentary" : "Not added"}</span>
          </div>
          <div className="row-between" style={{ fontSize: "1.2rem", marginTop: 6 }}>
            <span>Total</span>
            <span className="price">{inr(total)}</span>
          </div>
          <p className="muted" style={{ fontSize: "0.8rem" }}>
            MRP inclusive of all taxes.
          </p>
        </div>
        {lines.length > 0 && gift.wrap && gift.note && (
          <p className="italic muted" style={{ fontFamily: "var(--font-display)", fontSize: "1.1rem" }}>
            &ldquo;{gift.note}&rdquo;
          </p>
        )}
        <button className="btn block co-submit-desktop" type="submit" disabled={state === "paying"}>
          {state === "paying" ? "Placing order…" : `Place order · ${inr(total)}`}
        </button>
        {state === "error" && (
          <p role="alert" className="co-error co-error-desktop">
            We couldn&rsquo;t place the order. Please try again.
          </p>
        )}
      </aside>
    </form>
  );
}

"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { inr } from "@/lib/format";
import { Monogram } from "./Monogram";

interface Order {
  id: string;
  total: number;
  lines: { name: string; formatLabel: string; qty: number; price: number }[];
  gifts?: { to: string; message: string; items: { name: string; formatLabel: string; qty: number; price: number }[] }[];
  customer: { name: string };
}

export function OrderConfirmation({ id }: { id: string }) {
  const [order, setOrder] = useState<Order | null>(null);
  useEffect(() => {
    try {
      const raw = sessionStorage.getItem(`lareine.order.${id}`);
      // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring browser-only storage after hydration; reading it during render would mismatch the server HTML
      if (raw) setOrder(JSON.parse(raw));
    } catch {}
  }, [id]);
  const first = order?.customer.name?.split(" ")[0];
  return (
    <section className="section founder bg-surface" style={{ minHeight: "70svh" }}>
      <div className="wrap" style={{ position: "relative", zIndex: 1, display: "grid", gap: 24, maxWidth: 760 }}>
        <span className="test-badge" style={{ justifySelf: "start" }}>
          Test order
        </span>
        <h1 className="display-5">Thank you{first ? `, ${first}` : ""}.</h1>
        <p className="lede">Your ritual is on its way. We&rsquo;ll wrap it by hand.</p>
        <p className="muted">
          Order <strong style={{ color: "var(--ink)", fontWeight: 500 }}>{id}</strong>
        </p>
        {order && (
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8, borderTop: "1px solid var(--line)", paddingTop: 16 }}>
            {order.lines.map((l) => (
              <li key={l.name + l.formatLabel} className="row-between">
                <span>
                  {l.qty} × {l.name} · {l.formatLabel}
                </span>
                <span className="price">{inr(l.price * l.qty)}</span>
              </li>
            ))}
            {(order.gifts ?? []).map((g, i) => (
              <li key={i} className="bag-gift" style={{ margin: 0 }}>
                <p className="label">Gift box{g.to ? ` · for ${g.to}` : ""}</p>
                {g.items.map((l) => (
                  <p key={l.name + l.formatLabel} className="row-between">
                    <span>
                      {l.qty} × {l.name} · {l.formatLabel}
                    </span>
                    <span className="price">{inr(l.price * l.qty)}</span>
                  </p>
                ))}
                {g.message && <p className="gift-msg">&ldquo;{g.message}&rdquo;</p>}
              </li>
            ))}
            <li className="row-between" style={{ borderTop: "1px solid var(--line)", paddingTop: 10, fontSize: "1.15rem" }}>
              <span>Total</span>
              <span className="price">{inr(order.total)}</span>
            </li>
          </ul>
        )}
        <p className="muted">Until it arrives: Flowers for Myself on Monday, Wednesday and Friday, A Bath in the Rain on Tuesday, Thursday and Saturday.</p>
        <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
          <Link href="/ritual" className="btn">
            The weekly ritual
          </Link>
          <Link href="/" className="btn ghost">
            Back home
          </Link>
        </div>
      </div>
      <Monogram className="mono" />
    </section>
  );
}

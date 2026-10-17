"use client";

import { useEffect, useState } from "react";
import type { CartLine } from "@/lib/line";
import { inr } from "@/lib/format";
import { AddToBag } from "./AddToBag";

// PDP-14: appears on mobile once the main buy button scrolls out of view.
export function StickyBuyBar({ item, targetId, disabled }: { item: Omit<CartLine, "qty">; targetId: string; disabled?: boolean }) {
  const [show, setShow] = useState(false);
  useEffect(() => {
    const t = document.getElementById(targetId);
    if (!t) return;
    const io = new IntersectionObserver(([e]) => setShow(!e.isIntersecting && e.boundingClientRect.top < 0));
    io.observe(t);
    return () => io.disconnect();
  }, [targetId]);
  return (
    <div className={`sticky-buy ${show ? "show" : ""}`} aria-hidden={!show} inert={!show}>
      <div>
        <p className="nm">{item.name}</p>
        <p className="muted" style={{ fontSize: "0.85rem" }}>
          {inr(item.price)} · {item.formatLabel}
        </p>
      </div>
      <AddToBag items={[item]} label="Add to bag" className="btn" disabled={disabled} />
    </div>
  );
}

"use client";

import { useState } from "react";
import type { CartLine } from "@/lib/line";
import { AddToBag } from "./AddToBag";

export function BuyBox({ item, disabled }: { item: Omit<CartLine, "qty">; disabled?: boolean }) {
  const [qty, setQty] = useState(1);
  return (
    <div className="buy-row" id="buy-main">
      <div className="qty" role="group" aria-label="Quantity">
        <button type="button" aria-label="Decrease quantity" onClick={() => setQty((q) => Math.max(1, q - 1))} disabled={qty <= 1}>
          −
        </button>
        <output aria-live="polite">{qty}</output>
        <button type="button" aria-label="Increase quantity" onClick={() => setQty((q) => Math.min(10, q + 1))} disabled={qty >= 10}>
          +
        </button>
      </div>
      <AddToBag items={[item]} qty={qty} label="Add to bag" disabled={disabled} />
    </div>
  );
}

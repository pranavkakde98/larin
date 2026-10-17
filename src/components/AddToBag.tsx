"use client";

import { useState } from "react";
import { useCart, type CartLine } from "@/lib/cart";
import { IconCheck } from "./Icons";

type Item = Omit<CartLine, "qty">;

export function AddToBag({
  items,
  label = "Add to bag",
  qty = 1,
  className = "btn",
  disabled,
  context,
}: {
  items: Item[];
  label?: string;
  qty?: number;
  className?: string;
  disabled?: boolean;
  context?: string;
}) {
  const { add } = useCart();
  const [added, setAdded] = useState(false);
  return (
    <button
      type="button"
      className={className}
      disabled={disabled}
      aria-label={context ? `${disabled ? "Sold out" : added ? "Added" : label}: ${context}` : undefined}
      onClick={() => {
        add(items, qty);
        setAdded(true);
        setTimeout(() => setAdded(false), 1600);
      }}
    >
      {disabled ? "Sold out" : added ? (
        <>
          <IconCheck /> Added
        </>
      ) : (
        label
      )}
    </button>
  );
}

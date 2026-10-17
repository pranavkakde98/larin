"use client";

import { useState } from "react";
import { settings } from "@/content/site";
import { deliveryWindow, validPincode } from "@/lib/format";

// INDIA-03: delivery promise under the buy button. Rule-based until courier zones are supplied.
export function Pincode() {
  const [pin, setPin] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [err, setErr] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (!validPincode(pin)) {
          setErr(true);
          setResult(null);
          return;
        }
        setErr(false);
        setResult(deliveryWindow(settings.delivery.minDays, settings.delivery.maxDays));
      }}
      style={{ display: "grid", gap: 8 }}
    >
      <label htmlFor="pin" className="label muted">
        Delivery date
      </label>
      <div className="pincode">
        <input
          id="pin"
          className="input"
          inputMode="numeric"
          maxLength={6}
          placeholder="Your pincode"
          value={pin}
          onChange={(e) => setPin(e.target.value.replace(/\D/g, ""))}
          aria-invalid={err}
          aria-describedby="pin-msg"
        />
        <button className="btn ghost small" type="submit">
          Check
        </button>
      </div>
      <p id="pin-msg" aria-live="polite" style={{ fontSize: "0.9rem" }} className={err ? "" : "muted"}>
        {err ? (
          <span style={{ color: "var(--error)" }}>Please enter a 6-digit pincode.</span>
        ) : result ? (
          <>
            Arrives <strong style={{ color: "var(--ink)", fontWeight: 500 }}>{result}</strong> to {pin}
          </>
        ) : (
          "Most orders arrive in 3 to 6 days."
        )}
      </p>
    </form>
  );
}

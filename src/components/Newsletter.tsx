"use client";

import { useState } from "react";

type State = "idle" | "sending" | "done" | "invalid" | "failed";

// Audit finding 08: invalid input and service failure are separate, visible states;
// the address is kept for a retry and double submission is blocked while sending.
export function Newsletter() {
  const [email, setEmail] = useState("");
  const [state, setState] = useState<State>("idle");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (state === "sending") return;
    if (!/^\S+@\S+\.\S+$/.test(email.trim())) {
      setState("invalid");
      return;
    }
    setState("sending");
    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: email.trim() }),
      });
      if (r.ok) setState("done");
      else setState(r.status === 400 ? "invalid" : "failed");
    } catch {
      setState("failed");
    }
  }

  if (state === "done") {
    return (
      <p style={{ marginTop: 16 }} role="status">
        Thank you. You&rsquo;ll hear from us first.
      </p>
    );
  }
  const msg =
    state === "invalid"
      ? "Please enter a valid email address, like name@example.com."
      : state === "failed"
        ? "We couldn't sign you up just now. Your address is still here; please try again."
        : "";
  return (
    <form className="newsletter-wrap" onSubmit={submit} noValidate>
      <div className="newsletter">
        <label htmlFor="nl-email" className="sr-only">
          Email address
        </label>
        <input
          id="nl-email"
          className="input"
          type="email"
          autoComplete="email"
          placeholder="Your email"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (state === "invalid") setState("idle");
          }}
          aria-invalid={state === "invalid"}
          aria-describedby="nl-msg"
        />
        <button className="btn" type="submit" disabled={state === "sending"} aria-busy={state === "sending"}>
          {state === "sending" ? "Joining…" : state === "failed" ? "Try again" : "Join"}
        </button>
      </div>
      <p id="nl-msg" className={`form-msg ${msg ? "show" : ""} ${state === "failed" ? "is-failed" : ""}`} role="alert">
        {msg}
      </p>
    </form>
  );
}

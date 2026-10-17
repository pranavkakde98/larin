"use client";

import { useState } from "react";

export function ContactForm() {
  const [state, setState] = useState<"idle" | "sending" | "done" | "error">("idle");
  const [errors, setErrors] = useState<Record<string, string>>({});

  async function submit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const f = new FormData(e.currentTarget);
    const data = Object.fromEntries(f.entries()) as Record<string, string>;
    const errs: Record<string, string> = {};
    if (!data.name?.trim()) errs.name = "Please tell us your name.";
    if (!/^\S+@\S+\.\S+$/.test(data.email ?? "")) errs.email = "Please enter a valid email.";
    if ((data.message ?? "").trim().length < 5) errs.message = "Please write a short message.";
    setErrors(errs);
    if (Object.keys(errs).length) return;
    setState("sending");
    try {
      const r = await fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) });
      setState(r.ok ? "done" : "error");
    } catch {
      setState("error");
    }
  }

  if (state === "done")
    return (
      <p role="status" className="lede">
        Thank you. We&rsquo;ll write back within a day or two.
      </p>
    );

  return (
    <form onSubmit={submit} noValidate style={{ display: "grid", gap: 14 }}>
      {(["name", "email"] as const).map((n) => (
        <div className="field" key={n}>
          <label htmlFor={`c-${n}`}>{n === "name" ? "Name" : "Email"}</label>
          <input id={`c-${n}`} name={n} type={n === "email" ? "email" : "text"} autoComplete={n} className="input" aria-invalid={!!errors[n]} aria-describedby={errors[n] ? `c-${n}-e` : undefined} />
          {errors[n] && (
            <span id={`c-${n}-e`} className="err">
              {errors[n]}
            </span>
          )}
        </div>
      ))}
      <div className="field">
        <label htmlFor="c-order">Order number (optional)</label>
        <input id="c-order" name="order" className="input" />
      </div>
      <div className="field">
        <label htmlFor="c-message">Message</label>
        <textarea id="c-message" name="message" rows={5} className="input" aria-invalid={!!errors.message} aria-describedby={errors.message ? "c-message-e" : undefined} />
        {errors.message && (
          <span id="c-message-e" className="err">
            {errors.message}
          </span>
        )}
      </div>
      <button className="btn" type="submit" disabled={state === "sending"} style={{ justifySelf: "start" }}>
        {state === "sending" ? "Sending…" : "Send"}
      </button>
      {state === "error" && (
        <p role="alert" style={{ color: "var(--error)" }}>
          Something went wrong. Please try again.
        </p>
      )}
    </form>
  );
}

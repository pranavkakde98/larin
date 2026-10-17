"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo, useState, useSyncExternalStore } from "react";
import type { ProductLite as Product } from "@/content/products";
import { useCart } from "@/lib/cart";
import { inr } from "@/lib/format";
import { GIFT_MESSAGE_MAX, GIFT_TO_MAX, toLine, type GiftBox } from "@/lib/line";
import { Logo } from "./Logo";
import { Monogram } from "./Monogram";

const MIN = 2;
const MAX = 4;

const noop = () => () => {};

// CONV-04 gift box builder + CONV-07 note. Replaces the old site's dead "Add to box" button.
// `?edit=<gift id>` reopens an existing box from the bag (re-audit point 2).
export function GiftBuilder({ products }: { products: Product[] }) {
  const editId = useSyncExternalStore(noop, () => new URLSearchParams(window.location.search).get("edit"), () => null);
  const { gifts, loaded } = useCart();
  const editing = editId ? gifts.find((g) => g.id === editId) : undefined;
  if (editId && !loaded) return <p className="muted">Opening your gift box…</p>;
  if (editId && !editing) {
    return (
      <div className="notice" style={{ display: "grid", gap: 12, maxWidth: 560 }}>
        <p>That gift box is no longer in your bag.</p>
        <Link href="/gifts/build-a-box" className="link tap">
          Start a new box
        </Link>
      </div>
    );
  }
  // Remount when switching between new and edit so initial state comes from the box.
  return <Builder key={editing?.id ?? "new"} products={products} editing={editing} />;
}

function Builder({ products, editing }: { products: Product[]; editing?: GiftBox }) {
  const router = useRouter();
  const { addGift, updateGift, setOpen } = useCart();
  const [qty, setQty] = useState<Record<string, number>>(() =>
    Object.fromEntries((editing?.items ?? []).filter((l) => products.some((p) => p.id === l.id)).map((l) => [l.id, l.qty])),
  );
  const [note, setNote] = useState(editing?.message ?? "");
  const [to, setTo] = useState(editing?.to ?? "");
  const [done, setDone] = useState(false);

  const count = useMemo(() => Object.values(qty).reduce((a, b) => a + b, 0), [qty]);
  const total = useMemo(() => products.reduce((n, p) => n + (qty[p.id] ?? 0) * p.price, 0), [qty, products]);
  const change = (id: string, d: number) =>
    setQty((q) => {
      const next = Math.max(0, (q[id] ?? 0) + d);
      if (d > 0 && count >= MAX) return q;
      return { ...q, [id]: next };
    });

  const ready = count >= MIN && count <= MAX;

  function addBox() {
    const items = products.filter((p) => (qty[p.id] ?? 0) > 0).map((p) => ({ ...toLine(p), qty: qty[p.id] }));
    // Recipient and message are kept separately and exactly as typed: nothing is joined or trimmed.
    if (editing) {
      updateGift(editing.id, { to: to.trim(), message: note.trim(), items });
      setOpen(true);
      router.push("/gifts/build-a-box");
      return;
    }
    addGift({ to: to.trim(), message: note.trim(), items });
    setQty({});
    setNote("");
    setTo("");
    setDone(true);
  }

  const chosen = products.flatMap((p) => Array.from({ length: qty[p.id] ?? 0 }, () => p)).slice(0, MAX);
  const cta = !ready ? `Choose ${Math.max(0, MIN - count)} more` : editing ? "Save changes" : "Add the box to bag";

  return (
    <>
      {editing && (
        <p className="notice" role="status" style={{ marginBottom: 32, maxWidth: 720 }}>
          Editing your gift box{editing.to ? ` for ${editing.to}` : ""}. Saving updates the same box in your bag; cancel keeps it exactly as it was.
        </p>
      )}
    <div className="builder">
      <div>
        <section className="builder-step" aria-labelledby="step1">
          <p className="eyebrow muted">Step 1 of 2</p>
          <h2 id="step1">
            Choose {MIN} to {MAX} pieces
          </h2>
          <p className="muted" aria-live="polite">
            {count} of {MAX} chosen{count < MIN ? `, choose ${MIN - count} more` : ""}.
          </p>
          <div className="pick-grid">
            {products.map((p) => {
              const n = qty[p.id] ?? 0;
              return (
                <div key={p.id} className={`pick ${n > 0 ? "on" : ""}`}>
                  <div className="img-frame">
                    <Image src={p.images[0].src} alt={p.images[0].alt} width={p.images[0].w} height={p.images[0].h} sizes="(max-width: 960px) 45vw, 18vw" />
                  </div>
                  <div>
                    <p className={`label t-${p.scent}`}>
                      {p.format === "gel" ? "Shower gel" : "Shimmer mist"}
                    </p>
                    <p style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", lineHeight: 1.15 }}>{p.name}</p>
                    <p className="price muted" style={{ fontSize: "0.9rem" }}>
                      {inr(p.price)}
                    </p>
                  </div>
                  <div className="qty" role="group" aria-label={`Quantity of ${p.name} ${p.formatLabel}`} style={{ justifySelf: "start" }}>
                    <button type="button" aria-label="Remove one" onClick={() => change(p.id, -1)} disabled={n === 0}>
                      −
                    </button>
                    <output>{n}</output>
                    <button type="button" aria-label="Add one" onClick={() => change(p.id, 1)} disabled={count >= MAX}>
                      +
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        </section>

        <section className="builder-step" aria-labelledby="step2" style={{ borderBottom: 0 }}>
          <p className="eyebrow muted">Step 2 of 2</p>
          <h2 id="step2">Write the note</h2>
          <div style={{ display: "grid", gap: 16, gridTemplateColumns: "repeat(auto-fit,minmax(260px,1fr))", alignItems: "start" }}>
            <div style={{ display: "grid", gap: 14 }}>
              <div className="field">
                <label htmlFor="gb-to">For</label>
                <input id="gb-to" className="input" maxLength={GIFT_TO_MAX} value={to} onChange={(e) => setTo(e.target.value)} placeholder="Her name" aria-describedby="gb-to-count" />
                <span id="gb-to-count" className="muted" style={{ fontSize: "0.8rem", justifySelf: "end" }}>
                  {GIFT_TO_MAX - to.length} characters left
                </span>
              </div>
              <div className="field">
                <label htmlFor="gb-note">Your note</label>
                <textarea id="gb-note" className="input" rows={4} maxLength={GIFT_MESSAGE_MAX} value={note} onChange={(e) => setNote(e.target.value)} placeholder="Because you deserve the beautiful things on ordinary days." aria-describedby="gb-note-count" />
                <span id="gb-note-count" className="muted" style={{ fontSize: "0.8rem", justifySelf: "end" }}>
                  {GIFT_MESSAGE_MAX - note.length} characters left
                </span>
              </div>
            </div>
            <div className="giftcard" aria-label="Note preview">
              <Monogram className="mono" />
              {to && <p className="eyebrow muted">For {to}</p>}
              <p className="msg">{note || "Your words, written by hand."}</p>
            </div>
          </div>
        </section>
      </div>

      <aside className="summary" aria-label="Your box">
        {/* The box fills as pieces are chosen: monogram tissue and wordmark ribbon (brand book p12, p30) */}
        <div className="gift-tissue" aria-hidden="true">
          <div className="gt-items" data-count={chosen.length}>
            {chosen.length === 0 ? (
              <p className="gt-empty">Your pieces will rest here.</p>
            ) : (
              chosen.map((p, i) => (
                <div key={`${p.id}-${i}`} className="gt-item">
                  <Image src={p.images[0].src} alt="" width={p.images[0].w} height={p.images[0].h} sizes="90px" />
                </div>
              ))
            )}
          </div>
          <div className="gt-ribbon">
            <Logo />
            <Logo />
            <Logo />
          </div>
        </div>
        <p className="eyebrow muted">Your box</p>
        {count === 0 ? (
          <p className="muted">Nothing chosen yet.</p>
        ) : (
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 8 }}>
            {products
              .filter((p) => qty[p.id])
              .map((p) => (
                <li key={p.id} className="row-between" style={{ fontSize: "0.95rem" }}>
                  <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                    <span className={`dot ${p.scent}`} /> {qty[p.id]} × {p.name} {p.format}
                  </span>
                  <span className="price">{inr(p.price * qty[p.id])}</span>
                </li>
              ))}
          </ul>
        )}
        <div className="row-between" style={{ borderTop: "1px solid var(--line)", paddingTop: 12 }}>
          <span>Gift wrap and note</span>
          <span className="muted">Complimentary</span>
        </div>
        <div className="row-between">
          <span>Total</span>
          <span className="price" style={{ fontSize: "1.25rem" }}>
            {inr(total)}
          </span>
        </div>
        <button className="btn block box-cta" disabled={!ready} onClick={addBox}>
          {cta}
        </button>
        {editing && (
          <button
            type="button"
            className="btn ghost block"
            onClick={() => {
              setOpen(true);
              router.push("/gifts/build-a-box");
            }}
          >
            Cancel, keep the box as it was
          </button>
        )}
        {done && (
          <p role="status" style={{ fontSize: "0.9rem" }}>
            Box added as its own gift in your bag.{" "}
            <button className="link" onClick={() => setOpen(true)}>
              View bag
            </button>
          </p>
        )}
        <p className="muted" style={{ fontSize: "0.8rem" }}>
          Each box is wrapped separately with its own note, apart from anything else in your bag. Prices are never included in the parcel.
        </p>
      </aside>
    </div>
      {/* M3: on phones the box total and its action stay in reach at the bottom of the screen */}
      <div className="box-bar" aria-label="Your box">
        <span>
          <span className="eyebrow muted">
            {count} of {MAX} chosen
          </span>
          <span className="price">{inr(total)}</span>
        </span>
        <button className="btn" disabled={!ready} onClick={addBox}>
          {cta}
        </button>
      </div>
    </>
  );
}

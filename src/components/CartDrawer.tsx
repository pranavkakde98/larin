"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ProductLite as Product } from "@/content/products";
import { settings } from "@/content/site";
import { useCart, toLine } from "@/lib/cart";
import { inr } from "@/lib/format";
import { ORDER_NOTE_MAX } from "@/lib/line";
import { Dialog } from "./Dialog";
import { IconClose } from "./Icons";

// CONV-03 threshold (off until the founder sets one), CONV-07 gift wrap + note, sibling-format upsell.
// Gift boxes are separate groups with their own note (audit finding 02).
export function CartDrawer({ products }: { products: Product[] }) {
  const { open, setOpen, lines, gifts, setQty, remove, removeGift, subtotal, count, gift, setGift, add } = useCart();
  const close = () => setOpen(false);
  const empty = lines.length === 0 && gifts.length === 0;

  // Re-audit point 6: after a removal, keep keyboard focus in a useful place and announce it.
  const pendingFocus = useRef<string | null>(null);
  const [announce, setAnnounce] = useState("");
  const keys = [...lines.map((l) => `line:${l.id}`), ...gifts.map((g) => `gift:${g.id}`)];
  const removeKey = (key: string, label: string, doRemove: () => void) => {
    const i = keys.indexOf(key);
    pendingFocus.current = keys[i + 1] ?? keys[i - 1] ?? "empty";
    const remaining = count - (key.startsWith("line:") ? lines.find((l) => `line:${l.id}` === key)?.qty ?? 0 : gifts.find((g) => `gift:${g.id}` === key)?.items.reduce((n, l) => n + l.qty, 0) ?? 0);
    setAnnounce(`Removed ${label}. ${remaining} ${remaining === 1 ? "item" : "items"} in your bag.`);
    doRemove();
  };
  useEffect(() => {
    const target = pendingFocus.current;
    if (!target) return;
    pendingFocus.current = null;
    document.querySelector<HTMLElement>(`[data-focus-key="${target}"]`)?.focus();
  }, [lines, gifts]);

  const ids = new Set(lines.map((l) => l.id));
  const upsell = lines
    .map((l) => products.find((p) => p.id === l.id))
    .filter(Boolean)
    .map((p) => products.find((x) => x.scent === p!.scent && x.format !== p!.format)!)
    .find((s) => s && !ids.has(s.id) && s.inStock);

  const threshold = settings.freeShippingThreshold;

  return (
    <Dialog open={open} onClose={close} side="right" labelledBy="bag-title">
      <div className="sheet-head">
        <h2 id="bag-title" className="display-2" style={{ fontSize: "1.6rem" }}>
          Your bag {count > 0 && <span className="muted" style={{ fontSize: "1rem" }}>({count})</span>}
        </h2>
        <button className="icon-btn" aria-label="Close bag" onClick={close} data-autofocus>
          <IconClose />
        </button>
      </div>

      <p className="bag-live" role="status" aria-live="polite">
        {announce}
      </p>
      <div className="sheet-body">
        {threshold && !empty && (
          <div style={{ padding: "14px 0 6px", display: "grid", gap: 8 }}>
            <p className="label">{subtotal >= threshold ? "Free delivery unlocked" : `${inr(threshold - subtotal)} away from free delivery`}</p>
            <div className="progress">
              <i style={{ width: `${Math.min(100, (subtotal / threshold) * 100)}%` }} />
            </div>
          </div>
        )}

        {empty ? (
          <div className="empty">
            <p className="display-3" tabIndex={-1} data-focus-key="empty" style={{ outline: "none" }}>
              Nothing here yet.
            </p>
            <p className="muted">Your ritual is waiting.</p>
            <Link href="/shop" className="btn" onClick={close}>
              Shop the collection
            </Link>
            <Link href="/which-one" className="link tap" onClick={close}>
              Not sure where to start?
            </Link>
          </div>
        ) : (
          <>
            {lines.length > 0 && (
              <section aria-label="For you">
                {gifts.length > 0 && <p className="label muted bag-group-title">For you</p>}
                <ul className="plain">
                  {lines.map((l) => (
                    <li key={l.id} className="cart-line">
                      <Link href={`/products/${l.slug}`} className="img-frame" onClick={close} tabIndex={-1} aria-hidden="true">
                        <Image src={l.image} alt="" width={152} height={190} sizes="76px" />
                      </Link>
                      <div style={{ display: "grid", gap: 6 }}>
                        <p className="label muted" style={{ display: "flex", gap: 8, alignItems: "center" }}>
                          <span className={`dot ${l.scent}`} /> {l.formatLabel}
                        </p>
                        <h3>
                          <Link href={`/products/${l.slug}`} onClick={close}>
                            {l.name}
                          </Link>
                        </h3>
                        <div className="qty" role="group" aria-label={`Quantity for ${l.name} ${l.formatLabel}`}>
                          <button
                            aria-label={l.qty === 1 ? "Decrease quantity (removes this item)" : "Decrease quantity"}
                            onClick={() => (l.qty === 1 ? removeKey(`line:${l.id}`, `${l.name} ${l.formatLabel}`, () => remove(l.id)) : setQty(l.id, l.qty - 1))}
                          >
                            −
                          </button>
                          <output aria-live="polite">{l.qty}</output>
                          <button aria-label="Increase quantity" onClick={() => setQty(l.id, l.qty + 1)} disabled={l.qty >= 10}>
                            +
                          </button>
                        </div>
                      </div>
                      <div style={{ display: "grid", gap: 10, justifyItems: "end" }}>
                        <span className="price">{inr(l.price * l.qty)}</span>
                        <button
                          className="remove"
                          data-focus-key={`line:${l.id}`}
                          onClick={() => removeKey(`line:${l.id}`, `${l.name} ${l.formatLabel}`, () => remove(l.id))}
                          aria-label={`Remove ${l.name} ${l.formatLabel}`}
                        >
                          Remove
                        </button>
                      </div>
                    </li>
                  ))}
                </ul>

                {upsell && (
                  <div className="upsell">
                    <div className="img-frame">
                      <Image src={upsell.images[0].src} alt="" width={128} height={160} sizes="64px" />
                    </div>
                    <div>
                      <p className="label muted">Complete the ritual</p>
                      <p style={{ fontFamily: "var(--font-display)", fontSize: "1.15rem", lineHeight: 1.2 }}>
                        {upsell.name} {upsell.format === "mist" ? "mist" : "gel"}
                      </p>
                      <p className="price muted" style={{ fontSize: "0.9rem" }}>
                        {inr(upsell.price)}
                      </p>
                    </div>
                    <button className="btn small ghost" onClick={() => add([toLine(upsell)])} aria-label={`Add ${upsell.name} ${upsell.formatLabel}`}>
                      Add
                    </button>
                  </div>
                )}

                <div className="gift-box">
                  <label className="check">
                    <input type="checkbox" checked={gift.wrap} onChange={(e) => setGift({ wrap: e.target.checked })} />
                    <span>
                      {gifts.length ? "Gift wrap these items too" : "Gift wrap it, by hand"} <span className="muted">· complimentary</span>
                      <br />
                      <span className="muted" style={{ fontSize: "0.85rem" }}>
                        Prices are never included in the parcel.
                      </span>
                    </span>
                  </label>
                  {gift.wrap && (
                    <div className="field">
                      <label htmlFor="gift-note">A note, written by hand (optional)</label>
                      <textarea
                        id="gift-note"
                        className="input"
                        rows={3}
                        maxLength={ORDER_NOTE_MAX}
                        value={gift.note}
                        onChange={(e) => setGift({ note: e.target.value })}
                        placeholder="For you, for no reason at all."
                        aria-describedby="gift-note-count"
                      />
                      <span id="gift-note-count" className="muted" style={{ fontSize: "0.8rem", justifySelf: "end" }}>
                        {ORDER_NOTE_MAX - gift.note.length} characters left
                      </span>
                    </div>
                  )}
                </div>
              </section>
            )}

            {gifts.map((g, i) => (
              <section key={g.id} className="bag-gift" aria-label={`Gift box ${i + 1}${g.to ? ` for ${g.to}` : ""}`}>
                <div className="row-between">
                  <p className="label">
                    Gift box{gifts.length > 1 ? ` ${i + 1}` : ""}
                    {g.to ? ` · for ${g.to}` : ""}
                  </p>
                  <span style={{ display: "flex", gap: 16 }}>
                    <Link href={`/gifts/build-a-box?edit=${g.id}`} className="remove" onClick={close} aria-label={`Edit gift box${g.to ? ` for ${g.to}` : ""}`}>
                      Edit
                    </Link>
                    <button
                      className="remove"
                      data-focus-key={`gift:${g.id}`}
                      onClick={() => removeKey(`gift:${g.id}`, `gift box${g.to ? ` for ${g.to}` : ""}`, () => removeGift(g.id))}
                      aria-label={`Remove gift box${g.to ? ` for ${g.to}` : ""}`}
                    >
                      Remove box
                    </button>
                  </span>
                </div>
                <ul className="plain" style={{ display: "grid", gap: 8 }}>
                  {g.items.map((l) => (
                    <li key={l.id} className="row-between" style={{ fontSize: "0.95rem" }}>
                      <span style={{ display: "flex", gap: 8, alignItems: "center" }}>
                        <span className={`dot ${l.scent}`} />
                        {l.qty} × {l.name} · {l.formatLabel}
                      </span>
                      <span className="price">{inr(l.price * l.qty)}</span>
                    </li>
                  ))}
                </ul>
                {g.message && <p className="gift-msg">&ldquo;{g.message}&rdquo;</p>}
                <p className="muted" style={{ fontSize: "0.82rem" }}>
                  Wrapped by hand with this note, separately from the rest of your bag.
                </p>
              </section>
            ))}
          </>
        )}
      </div>

      {!empty && (
        <div className="sheet-foot">
          <div className="row-between">
            <span>Subtotal</span>
            <span className="price" style={{ fontSize: "1.2rem" }}>
              {inr(subtotal)}
            </span>
          </div>
          <p className="muted" style={{ fontSize: "0.8rem" }}>
            MRP inclusive of all taxes. Delivery calculated at checkout.
          </p>
          <Link href="/checkout" className="btn block" onClick={close}>
            Checkout
          </Link>
        </div>
      )}
    </Dialog>
  );
}

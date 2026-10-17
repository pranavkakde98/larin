"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import type { ProductLite as Product, ScentId } from "@/content/products";
import { chooser } from "@/content/site";
import { inr } from "@/lib/format";
import { toLine } from "@/lib/line";
import { AddToBag } from "./AddToBag";

type Pick = ScentId | "both";
interface SetLite {
  id: string;
  scent: ScentId | null;
  products: Product[];
  price: number;
  name: string;
}

const heroFor: Record<Pick, { src: string; w: number; h: number; alt: string }> = {
  flowers: { src: "/media/gel-flowers-1.jpg", w: 928, h: 1152, alt: "Flowers for Myself shower gel with pink roses" },
  rain: { src: "/media/gel-rain-2.jpg", w: 928, h: 1152, alt: "A Bath in the Rain shower gel splashing with citrus" },
  both: { src: "/media/duo-model.jpg", w: 1080, h: 1080, alt: "A woman holds a pink and a turquoise gel" },
};

// CONV-06: the founder's "A or B" post as a two-screen chooser, with the caustic signature effect.
export function Chooser({ products, sets }: { products: Product[]; sets: SetLite[] }) {
  const [pick, setPick] = useState<Pick | null>(null);
  const resultRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    const p = new URLSearchParams(window.location.search).get("pick");
    // eslint-disable-next-line react-hooks/set-state-in-effect -- restoring browser-only storage after hydration; reading it during render would mismatch the server HTML
    if (p === "flowers" || p === "rain" || p === "both") setPick(p);
  }, []);

  useEffect(() => {
    if (pick) {
      resultRef.current?.focus();
      window.scrollTo({ top: 0 });
    }
  }, [pick]);

  if (pick) {
    const r = chooser.results[pick];
    const set = pick === "both" ? sets.find((s) => s.id === "duo")! : sets.find((s) => s.scent === pick)!;
    const duo = sets.find((s) => s.id === "duo")!;
    const img = heroFor[pick];
    const tone = pick === "both" ? "surface" : pick;
    return (
      <section className={`result ${tone === "surface" ? "bg-surface" : `bg-${tone}`}`} aria-live="polite">
        <div className="text">
          <p className={`eyebrow ${pick === "both" ? "muted" : `t-${pick}`}`}>Your ritual</p>
          <h1 ref={resultRef} tabIndex={-1} style={{ outline: "none" }}>
            {r.headline}
          </h1>
          <p className="measure">{r.body}</p>
          <ul style={{ listStyle: "none", padding: 0, display: "grid", gap: 10 }}>
            {set.products.map((p) => (
              <li key={p.id} className="row-between" style={{ borderTop: "1px solid var(--line-strong)", paddingTop: 10 }}>
                <Link href={`/products/${p.slug}`} className="link" style={{ backgroundSize: "0 1px" }}>
                  {p.name} · {p.format === "gel" ? "shower gel" : "shimmer mist"}
                </Link>
                <span className="price">{inr(p.price)}</span>
              </li>
            ))}
          </ul>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <AddToBag items={set.products.map(toLine)} label={`Add ${set.name} · ${inr(set.price)}`} className={`btn ${pick === "both" ? "" : pick}`} />
            {pick !== "both" && (
              <AddToBag items={duo.products.map(toLine)} label="Or start with the Duo" className="btn ghost" />
            )}
          </div>
          <p style={{ display: "flex", gap: 20, flexWrap: "wrap" }}>
            <button className="link tap" onClick={() => setPick(null)}>
              Change my answer
            </button>
            <Link href="/shop" className="link tap">
              Browse all products
            </Link>
          </p>
        </div>
        <div className="media">
          <Image src={img.src} alt={img.alt} width={img.w} height={img.h} priority sizes="(max-width: 860px) 100vw, 50vw" />
        </div>
      </section>
    );
  }

  return (
    <section className="chooser">
      <div className="chooser-head">
        <p className="eyebrow muted">One question</p>
        <h1>{chooser.question}</h1>
        <p className="muted measure">{chooser.sub}</p>
      </div>
      <div className="chooser-options">
        {chooser.options.map((o) => (
          <button key={o.key} className={`chooser-option bg-${o.scent}`} onClick={() => setPick(o.scent)}>
            <span className="caustic" aria-hidden="true" />
            <span className={`key t-${o.scent}`} aria-hidden="true">
              {o.key}
            </span>
            <span className="q">{o.title}</span>
            <span className={`link-arrow t-${o.scent}`}>
              {o.body} <span>→</span>
            </span>
          </button>
        ))}
      </div>
      <div className="chooser-neutral">
        <button className="btn ghost" onClick={() => setPick("both")}>
          Both sound like me
        </button>
        <div className="neutral-paths">
          <p className="label muted">Neither? Choose another way</p>
          <ul className="plain neutral-grid">
            <li>
              <Link href="/scents/flowers-for-myself" className="neutral-link">
                <span className="dot flowers" /> Soft and floral
                <span className="muted">Flowers for Myself</span>
              </Link>
            </li>
            <li>
              <Link href="/scents/a-bath-in-the-rain" className="neutral-link">
                <span className="dot rain" /> Fresh and citrus
                <span className="muted">A Bath in the Rain</span>
              </Link>
            </li>
            <li>
              <Link href="/shop?format=mist" className="neutral-link">
                Just the shimmer mists
                <span className="muted">For hair and body</span>
              </Link>
            </li>
            <li>
              <Link href="/gifts" className="neutral-link">
                Buying a gift
                <span className="muted">Sets and gift boxes</span>
              </Link>
            </li>
          </ul>
          <Link href="/shop" className="link tap">
            Browse all {products.length} products
          </Link>
        </div>
      </div>
    </section>
  );
}

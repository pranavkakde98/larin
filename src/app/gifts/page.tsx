import type { Metadata } from "next";
import Link from "next/link";
import { AddToBag } from "@/components/AddToBag";
import { SetImage } from "@/components/SetImage";
import { GiftPresentation } from "@/components/GiftPresentation";
import { getSets } from "@/lib/commerce";
import { inr } from "@/lib/format";
import { toLine } from "@/lib/line";

export const metadata: Metadata = {
  title: "Gifts and sets",
  description: "The Duo, the Flowers Ritual and the Rain Ritual, or build your own gift box with a handwritten note. Wrapped by hand, prices never included.",
};

export default async function Gifts() {
  const sets = await getSets();
  return (
    <>
      <div className="wrap">
        <header className="page-head feature gifts-head">
          <div className="text">
            <p className="eyebrow muted">Gifts</p>
            <h1>For someone you love. Including you.</h1>
            <p className="muted measure">Every order is wrapped by hand with a handwritten note, at no cost. Prices never travel with a gift.</p>
            <Link href="/gifts/build-a-box" className="btn" style={{ justifySelf: "start" }}>
              Build a gift box
            </Link>
          </div>
          <div className="media">
            <GiftPresentation products={sets[0].products} />
          </div>
        </header>
        <div className="grid-products three" style={{ paddingBottom: "var(--section)" }}>
          {sets.map((s, i) => (
            <article key={s.id} className="card reveal" style={{ ["--i" as string]: i }}>
              <SetImage products={s.products} photo={s.id === "duo" ? s.image : undefined} sizes="(max-width: 1024px) 50vw, 33vw" />
              <div className="card-body">
                <p className={`eyebrow ${s.scent ? `t-${s.scent}` : "muted"}`}>{s.products.map((p) => `${p.name} ${p.format}`).join(" + ")}</p>
                <h2 className="display-3">{s.name}</h2>
                <p className="scene">{s.line}</p>
                <p className="muted" style={{ fontSize: "0.95rem" }}>
                  {s.description}
                </p>
                <div className="meta" style={{ fontSize: "1rem" }}>
                  <span className="price">{inr(s.price)}</span>
                </div>
              </div>
              <AddToBag items={s.products.map(toLine)} label="Add to bag" className="btn block" />
            </article>
          ))}
        </div>
      </div>
      <section className="section bg-surface mono-pattern build-band">
        <div className="wrap" style={{ display: "grid", gap: 18, justifyItems: "center", textAlign: "center" }}>
          <p className="eyebrow muted">Build a gift box</p>
          <h2 className="display-4" style={{ maxWidth: "18ch" }}>
            Choose two to four pieces. Add your words.
          </h2>
          <p className="muted measure">Pick any mix of gels and mists, write a note, and we&rsquo;ll wrap it by hand.</p>
          <Link href="/gifts/build-a-box" className="btn">
            Start a box
          </Link>
        </div>
      </section>
    </>
  );
}

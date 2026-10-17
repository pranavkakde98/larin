import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { AddToBag } from "@/components/AddToBag";
import { RitualWeek } from "@/components/RitualWeek";
import { ritual } from "@/content/site";
import { getProducts, getSets } from "@/lib/commerce";
import { inr } from "@/lib/format";
import { toLine } from "@/lib/line";

export const metadata: Metadata = {
  title: "The weekly ritual: skin cycling for the body",
  description: "Flowers for Myself on Monday, Wednesday and Friday, A Bath in the Rain on Tuesday, Thursday and Saturday, both on Sunday. One ritual, two bottles, zero guesswork.",
};

const names = { flowers: "Flowers for Myself", rain: "A Bath in the Rain", both: "Both" } as const;

export default async function Ritual() {
  const [products, sets] = await Promise.all([getProducts(), getSets()]);
  const duo = sets.find((s) => s.id === "duo")!;
  return (
    <>
      {/* Column placement lives in CSS (.ritual-hero) so phones stack instead of overlapping */}
      <section className="feature wrap section ritual-hero">
        <div className="text">
          <p className="eyebrow muted">The weekly ritual</p>
          <h1 className="display-5">{ritual.title}</h1>
          <p className="muted measure">{ritual.intro}</p>
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <AddToBag items={duo.products.map(toLine)} label={`Add the Duo · ${inr(duo.price)}`} />
            <Link href="/which-one" className="btn ghost">
              Which one first?
            </Link>
          </div>
        </div>
        <div className="media img-frame" style={{ aspectRatio: "1080/900" }}>
          <Image src="/media/ritual-shower.jpg" alt="A woman tilts her face into the shower, a sponge on her shoulder" width={1080} height={900} priority sizes="(max-width: 900px) 100vw, 50vw" />
        </div>
      </section>

      <section className="wrap" aria-labelledby="week-title" style={{ paddingBottom: "clamp(40px, 5vw, 72px)" }}>
        <h2 id="week-title" className="display-3" style={{ marginBottom: "clamp(20px, 2.5vw, 32px)" }}>
          Your week
        </h2>
        <RitualWeek products={products} duoPrice={duo.price} duoLines={duo.products.map(toLine)} />
      </section>

      <section className="wrap" aria-labelledby="days-title" style={{ paddingBottom: "var(--section)" }}>
        <h2 id="days-title" className="eyebrow muted" style={{ marginBottom: 8 }}>
          Day by day
        </h2>
        <ol className="day-list">
          {ritual.days.map((d) => (
            <li key={d.day}>
              <span className="d">{d.day}</span>
              <span className={`dot ${d.scent === "both" ? "flowers" : d.scent}`} aria-hidden="true" />
              {d.scent === "both" && <span className="dot rain" aria-hidden="true" />}
              <span className="n">{names[d.scent]}</span>
              <span className="t muted">{d.text}</span>
            </li>
          ))}
        </ol>
      </section>
    </>
  );
}

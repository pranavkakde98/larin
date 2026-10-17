import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Accordion } from "@/components/Accordion";
import { AddToBag } from "@/components/AddToBag";
import { LoopVideo } from "@/components/LoopVideo";
import { ritual, scentBySlug, scents } from "@/content/site";
import { getProducts, getSets } from "@/lib/commerce";
import { inr } from "@/lib/format";
import { toLine } from "@/lib/line";

export const dynamicParams = false;
export function generateStaticParams() {
  return scents.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: PageProps<"/scents/[slug]">): Promise<Metadata> {
  const s = scentBySlug((await params).slug);
  if (!s) return {};
  return {
    title: `${s.name}: shower gel and shimmer mist`,
    description: `${s.character} ${s.forSkin} The ${s.name} shower gel and alcohol-free shimmer hair & body mist from La Reiné.`,
    openGraph: { images: [{ url: s.hero.src }] },
  };
}

// Scent world: PDP-04 (one page spanning formats), PDP-06 notes, PDP-08 story, PDP-10 ritual.
export default async function ScentPage({ params }: PageProps<"/scents/[slug]">) {
  const scent = scentBySlug((await params).slug);
  if (!scent) notFound();
  const all = await getProducts();
  const items = all.filter((p) => p.scent === scent.id).sort((a) => (a.format === "gel" ? -1 : 1));
  const mist = items.find((p) => p.format === "mist")!;
  const set = (await getSets()).find((s) => s.scent === scent.id)!;
  const other = scents.find((s) => s.id !== scent.id)!;
  const days = ritual.days.filter((d) => d.scent === scent.id || d.scent === "both");
  const ink = scent.id === "flowers" ? "flowers" : "rain";

  return (
    <>
      <section className={`scent-hero bg-${ink}`}>
        <div className="text">
          <p className={`eyebrow t-${ink}`}>{scent.days}</p>
          <h1 className={`t-${ink}`}>{scent.name}</h1>
          <p className="lede">{scent.character}</p>
          {scent.story.map((p) => (
            <p key={p} className="measure">
              {p}
            </p>
          ))}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
            <AddToBag items={set.products.map(toLine)} label={`Add the ritual · ${inr(set.price)}`} className={`btn ${ink}`} />
            <a href="#formats" className="btn ghost">
              The two formats
            </a>
          </div>
        </div>
        <div className="media">
          {scent.loop ? (
            <LoopVideo mp4={scent.loop.mp4} webm={scent.loop.webm} poster={scent.loop.poster} />
          ) : (
            <Image src={scent.hero.src} alt={scent.hero.alt} width={scent.hero.w} height={scent.hero.h} priority sizes="(max-width: 860px) 100vw, 50vw" />
          )}
        </div>
      </section>

      <section id="formats" className="section wrap" aria-labelledby="formats-title">
        <div className="section-head">
          <div style={{ display: "grid", gap: 12 }}>
            <p className="eyebrow muted">Shower, then shimmer</p>
            <h2 id="formats-title">One scent, two ways to wear it.</h2>
          </div>
        </div>
        <div className="formats">
          {items.map((p, i) => (
            <article key={p.id} className="format-card reveal" style={{ ["--i" as string]: i }}>
              <Link href={`/products/${p.slug}`} className="img-frame hover-breathe">
                <Image src={p.images[0].src} alt={p.images[0].alt} width={p.images[0].w} height={p.images[0].h} sizes="(max-width: 520px) 100vw, (max-width: 1024px) 50vw, 25vw" />
              </Link>
              <div className="body">
                <p className={`label t-${ink}`}>{p.formatLabel}</p>
                <h3>
                  <Link href={`/products/${p.slug}`}>{p.format === "gel" ? "Shower gel" : "Shimmer mist"}</Link>
                </h3>
                <p className="italic muted" style={{ fontFamily: "var(--font-display)", fontSize: "var(--step-1)" }}>
                  {p.sceneLine}
                </p>
                <p className="muted" style={{ fontSize: "0.95rem" }}>
                  {p.highlights.join(" · ")}
                </p>
                <p className="price">
                  {inr(p.price)} <span className="muted">· {p.size}</span>
                </p>
                <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
                  <AddToBag items={[toLine(p)]} className="btn small" disabled={!p.inStock} context={`${p.name} ${p.formatLabel}`} />
                  <Link href={`/products/${p.slug}`} className="btn small ghost">
                    Details
                  </Link>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {mist.notes && (
        <section className="section wrap" style={{ paddingTop: 0 }} aria-labelledby="notes-title">
          <div style={{ display: "grid", gap: 12, marginBottom: 32 }}>
            <p className="eyebrow muted">The scent</p>
            <h2 id="notes-title" className="display-4">
              {mist.fragrance.replace(".", "")}, note by note.
            </h2>
          </div>
          <div className="notes reveal">
            <div>
              <p className="eyebrow muted">Top</p>
              <p className="n">{mist.notes.top}</p>
            </div>
            <div>
              <p className="eyebrow muted">Heart</p>
              <p className="n">{mist.notes.heart}</p>
            </div>
            <div>
              <p className="eyebrow muted">Base</p>
              <p className="n">{mist.notes.base}</p>
            </div>
          </div>
          <p className="muted" style={{ marginTop: 20, fontSize: "0.9rem" }}>
            Notes of the shimmer mist. The shower gel: {items[0].fragrance.toLowerCase()}
          </p>
        </section>
      )}

      <section className="section bg-paper" aria-labelledby="days-title">
        <div className="wrap" style={{ display: "grid", gap: 32 }}>
          <div style={{ display: "grid", gap: 12 }}>
            <p className="eyebrow muted">In the weekly ritual</p>
            <h2 id="days-title" className="display-4">
              {scent.forSkin}
            </h2>
          </div>
          <div style={{ display: "grid", gap: 0 }}>
            {days.map((d) => (
              <div key={d.day} className="row-between reveal" style={{ borderTop: "1px solid var(--line)", padding: "18px 0", justifyContent: "flex-start", gap: 32 }}>
                <span className={`eyebrow t-${ink}`} style={{ minWidth: 48 }}>
                  {d.day}
                </span>
                <span>{d.text}</span>
              </div>
            ))}
          </div>
          <Link href="/ritual" className="link-arrow">
            The full week <span>→</span>
          </Link>
        </div>
      </section>

      <section className="section wrap" aria-labelledby="faq-title">
        <div className="feature">
          <Link href={`/scents/${other.slug}`} className={`media img-frame hover-breathe`} style={{ aspectRatio: "4/5", maxWidth: 520 }}>
            <Image src={other.hero.src} alt={other.hero.alt} width={other.hero.w} height={other.hero.h} sizes="(max-width: 900px) 100vw, 40vw" />
          </Link>
          <div className="text">
            <p className="eyebrow muted">Pairs with</p>
            <h2 className="display-4">{other.name}</h2>
            <p className="muted">{other.character} {other.forSkin}</p>
            <Link href={`/scents/${other.slug}`} className="link-arrow">
              Enter the world <span>→</span>
            </Link>
          </div>
        </div>
        <div style={{ marginTop: "var(--section)", maxWidth: 820 }}>
          <h2 id="faq-title" className="display-3" style={{ marginBottom: 20 }}>
            Questions
          </h2>
          <Accordion items={[...items[0].faq, ...mist.faq.slice(0, 2)].map((f) => ({ title: f.q, body: <p>{f.a}</p> }))} />
        </div>
      </section>
    </>
  );
}

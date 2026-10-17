import Image from "next/image";
import Link from "next/link";
import { proofIcons } from "@/components/Icons";
import { Monogram } from "@/components/Monogram";
import { AddToBag } from "@/components/AddToBag";
import { ProductCard } from "@/components/ProductCard";
import { RitualWeek } from "@/components/RitualWeek";
import { chooser, founderNote, proof, ritual } from "@/content/site";
import { getProducts, getSets } from "@/lib/commerce";
import { inr } from "@/lib/format";
import { toLine } from "@/lib/line";

// Mist launch home: mist hero > the new mists > the weekly ritual > which one is for you > the collection
// (mists first) > founder > gifts. One statement per idea; the journal lives in the footer.
export default async function Home() {
  const products = await getProducts();
  const sets = await getSets();
  const duo = sets.find((s) => s.id === "duo")!;
  const mists = products.filter((p) => p.format === "mist");
  const fMist = mists.find((p) => p.scent === "flowers")!;
  const rMist = mists.find((p) => p.scent === "rain")!;
  const byNewest = [...mists, ...products.filter((p) => p.format !== "mist")];

  return (
    <>
      {/* HERO-05 split hero, mist-led for the launch: the headline on Linen, each world shows its new mist */}
      <section className="hero" aria-label="New shimmer mists in two scent worlds">
        <div className="hero-center">
          <div>
            <p className="eyebrow">
              <span className="new-tag">New</span> Shimmer hair &amp; body mists
            </p>
            <h1>Each scent, now in its lightest form.</h1>
            <p className="hero-sub muted">Alcohol-free mists for hair and body, in Flowers for Myself and A Bath in the Rain.</p>
            <div className="hero-ctas">
              <Link href="/shop?format=mist" className="btn hero-shop">
                Shop the mists
              </Link>
              <Link href="/shop" className="link-arrow">
                Shop all four <span>→</span>
              </Link>
            </div>
          </div>
        </div>
        <Link href={`/products/${fMist.slug}`} className="hero-half flowers">
          <div className="bg settle">
            <Image src={fMist.images[0].src} alt={fMist.images[0].alt} width={fMist.images[0].w} height={fMist.images[0].h} priority sizes="50vw" style={{ objectPosition: "50% 55%" }} />
          </div>
          <div className="hero-label">
            <p className="eyebrow">New · Shimmer mist</p>
            <h2>Flowers for Myself</h2>
            <span className="link-arrow">
              Discover <span>→</span>
            </span>
          </div>
        </Link>
        <Link href={`/products/${rMist.slug}`} className="hero-half rain">
          <div className="bg settle">
            <Image src={rMist.images[0].src} alt={rMist.images[0].alt} width={rMist.images[0].w} height={rMist.images[0].h} loading="eager" sizes="50vw" style={{ objectPosition: "60% 60%" }} />
          </div>
          <div className="hero-label">
            <p className="eyebrow">New · Shimmer mist</p>
            <h2>A Bath in the Rain</h2>
            <span className="link-arrow">
              Discover <span>→</span>
            </span>
          </div>
        </Link>
      </section>

      {/* The mist launch: what it is, how it feels, both mists to buy */}
      <section className="section wrap mist-launch" aria-labelledby="mist-title">
        <div className="feature">
          <div className="media img-frame reveal">
            <Image src="/media/mist-duo-underwater.jpg" alt="Both shimmer mists underwater among rose petals and bubbles" width={750} height={937} sizes="(max-width: 900px) 100vw, 750px" />
          </div>
          <div className="text">
            <p className="eyebrow reveal">
              <span className="new-tag">New</span> The shimmer mists
            </p>
            <h2 id="mist-title" className="display-4 reveal">
              Mist it on hair and skin. Never sticky.
            </h2>
            <ul className="mist-points reveal">
              <li>
                <strong>Alcohol-free.</strong> Gentle on hair and skin, without the dryness of alcohol-based sprays.
              </li>
              <li>
                <strong>For hair &amp; body.</strong> Hair lengths, shoulders and collarbones.
              </li>
              <li>
                <strong>A soft shimmer.</strong> A fine, weightless veil. Never sticky.
              </li>
            </ul>
            <ul className="mist-buy reveal">
              {mists.map((m) => (
                <li key={m.id}>
                  <Link href={`/products/${m.slug}`} className="mist-name">
                    <span className={`dot ${m.scent}`} aria-hidden="true" />
                    {m.name}
                  </Link>
                  <span className="price">
                    {inr(m.price)}
                    {m.mrp > m.price && (
                      <s>
                        <span className="sr-only">MRP </span>
                        {inr(m.mrp)}
                      </s>
                    )}
                  </span>
                  <AddToBag items={[toLine(m)]} label="Add" className="btn small ghost" context={`${m.name} shimmer mist`} />
                </li>
              ))}
            </ul>
            <div className="reveal" style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "center" }}>
              <AddToBag items={mists.map(toLine)} label={`Add both mists · ${inr(mists.reduce((n, m) => n + m.price, 0))}`} />
              {mists[0].priceNote && <span className="muted" style={{ fontSize: "0.9rem" }}>{mists[0].priceNote}</span>}
            </div>
          </div>
        </div>
      </section>

      {/* The signature: the founder's weekly skin cycling, second on the page */}
      <section className="section wrap home-ritual" aria-labelledby="ritual-title">
        <div className="section-head">
          <div style={{ display: "grid", gap: 12 }}>
            <p className="eyebrow muted">The weekly ritual</p>
            <h2 id="ritual-title" className="display-4">
              {ritual.title}
            </h2>
          </div>
          <Link href="/ritual" className="link-arrow">
            Why it works <span>→</span>
          </Link>
        </div>
        <RitualWeek products={products} duoPrice={duo.price} duoLines={duo.products.map(toLine)} showMists={false} />
      </section>

      {/* CONV-06 the founder's A or B */}
      <section className="ab" aria-labelledby="chooser-title">
        <div className="wrap ab-head">
          <h2 id="chooser-title" className="display-3">
            {chooser.question}
          </h2>
          <p className="muted">{chooser.sub}</p>
        </div>
        <div className="split-2">
          {chooser.options.map((o) => (
            <Link key={o.key} href={`/which-one?pick=${o.scent}`} className={`chooser-tile bg-${o.scent}`}>
              <span className={`key t-${o.scent}`} aria-hidden="true">
                {o.key}
              </span>
              <p className="q">{o.title}</p>
              <span className={`link-arrow t-${o.scent}`}>
                {o.body} <span>→</span>
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="section wrap" aria-labelledby="collection-title">
        <div className="section-head">
          <div style={{ display: "grid", gap: 12 }}>
            <p className="eyebrow muted">The collection</p>
            <h2 id="collection-title" className="display-4">
              Two scents, each as a gel and a mist.
            </h2>
          </div>
          <Link href="/shop" className="link-arrow">
            Shop all <span>→</span>
          </Link>
        </div>
        <div className="grid-products">
          {byNewest.map((p, i) => (
            <ProductCard key={p.id} p={p} i={i} />
          ))}
        </div>
        {/* TRUST-03 proof: only claims supplied by the founder, as one quiet line */}
        <ul className="proof-line" aria-label="What's inside">
          {proof.map((p) => {
            const Icon = proofIcons[p.icon as keyof typeof proofIcons];
            return (
              <li key={p.title}>
                <Icon />
                <span>
                  <strong>{p.title}</strong> {p.text.charAt(0).toLowerCase() + p.text.slice(1)}
                </span>
              </li>
            );
          })}
        </ul>
      </section>

      {/* TRUST-05 one founder moment */}
      <section className="section bg-surface founder" aria-labelledby="founder-title">
        <div className="wrap" style={{ display: "grid", gap: 28, position: "relative", zIndex: 1 }}>
          <p className="eyebrow muted" id="founder-title">
            A note from our founder
          </p>
          <blockquote className="reveal">
            &ldquo;{founderNote.paragraphs[0]}&rdquo;
          </blockquote>
          <p className="muted reveal">{founderNote.role}</p>
          <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
            <Link href="/our-story" className="link-arrow">
              Read the full note <span>→</span>
            </Link>
            <Link href="/journal" className="link-arrow">
              From the journal <span>→</span>
            </Link>
          </div>
        </div>
        <Monogram className="mono" />
      </section>

      {/* CONV-04 gifts: real photography of the Duo plus the handwritten note */}
      <section className="section wrap" aria-labelledby="gift-title">
        <div className="feature flip">
          <figure className="media gift-photo reveal">
            <div className="img-frame">
              <Image src="/media/duo-bath-tray.jpg" alt="Both La Reiné shower gels on a wooden bath tray with flowers and foam" width={1080} height={720} sizes="(max-width: 900px) 100vw, 50vw" />
            </div>
            <div className="giftcard gp-card" aria-hidden="true">
              <Monogram className="mono" />
              <p className="msg">Because you deserve the beautiful things on ordinary days.</p>
            </div>
          </figure>
          <div className="text">
            <p className="eyebrow muted reveal">Gifts</p>
            <h2 id="gift-title" className="display-4 reveal">
              Wrapped by hand, with your words inside.
            </h2>
            <p className="muted reveal">Choose two to four pieces, write a note, and we&rsquo;ll wrap it for you. Or send a single shimmer mist: the easy small gift. Prices never travel with a gift.</p>
            <div className="reveal" style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <Link href="/gifts/build-a-box" className="btn">
                Build a gift box
              </Link>
              <Link href="/gifts" className="btn ghost">
                Ready-made sets
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Accordion } from "@/components/Accordion";
import { BuyBox } from "@/components/BuyBox";
import { AddToBag } from "@/components/AddToBag";
import { Pincode } from "@/components/Pincode";
import { StickyBuyBar } from "@/components/StickyBuyBar";
import { ProductCard } from "@/components/ProductCard";
import { products as all } from "@/content/products";
import { settings } from "@/content/site";
import { getProduct, getProducts } from "@/lib/commerce";
import { inr } from "@/lib/format";
import { toLine } from "@/lib/line";

export const dynamicParams = false;
export function generateStaticParams() {
  return all.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: PageProps<"/products/[slug]">): Promise<Metadata> {
  const p = await getProduct((await params).slug);
  if (!p) return {};
  return {
    title: p.seo.title,
    description: p.seo.description,
    alternates: { canonical: `/products/${p.slug}` },
    openGraph: { images: [{ url: p.images[0].src, width: p.images[0].w, height: p.images[0].h, alt: p.images[0].alt }] },
  };
}

// PDP spine from the pattern library: PDP-01 gallery, 02 title + scene, 04 format switch, 05 buy box + INDIA-03,
// 07 smells/feels, 06 notes, 09 actives + INCI, 10 ritual bundle, 11 pairs-with, 13 FAQ, 15 legal, 14 sticky bar.
export default async function ProductPage({ params }: PageProps<"/products/[slug]">) {
  const p = await getProduct((await params).slug);
  if (!p) notFound();
  const products = await getProducts();
  const sib = products.find((x) => x.scent === p.scent && x.format !== p.format)!;
  const pair = products.find((x) => x.scent !== p.scent && x.format === p.format)!;
  const versions = products.filter((x) => x.scent === p.scent).sort((a) => (a.format === "gel" ? -1 : 1));
  const scentSlug = p.scent === "flowers" ? "flowers-for-myself" : "a-bath-in-the-rain";
  const line = toLine(p);

  const jsonld = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${p.name} ${p.formatLabel}`,
    description: p.intro,
    image: p.images.map((i) => `${settings.url}${i.src}`),
    brand: { "@type": "Brand", name: "La Reiné" },
    size: p.size,
    offers: {
      "@type": "Offer",
      priceCurrency: "INR",
      price: p.price,
      availability: p.inStock ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
      url: `${settings.url}/products/${p.slug}`,
    },
  };
  const crumbs = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: settings.url },
      { "@type": "ListItem", position: 2, name: p.name, item: `${settings.url}/scents/${scentSlug}` },
      { "@type": "ListItem", position: 3, name: p.formatLabel, item: `${settings.url}/products/${p.slug}` },
    ],
  };

  return (
    <>
      <div className="wrap">
        <div className="pdp">
          <div className="gallery" role="region" tabIndex={0} aria-label={`${p.name} ${p.formatLabel} images`}>
            {p.images.map((img, i) => (
              <div key={img.src} className="img-frame">
                <Image src={img.src} alt={img.alt} width={img.w} height={img.h} priority={i === 0} sizes={i === 0 ? "(max-width: 900px) 86vw, 58vw" : "(max-width: 900px) 86vw, 29vw"} />
              </div>
            ))}
          </div>

          <div className="pdp-info">
            <nav aria-label="Breadcrumb" className="label muted" style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
              <Link href="/shop" className="link">
                Shop
              </Link>
              <span aria-hidden="true">/</span>
              <Link href={`/scents/${scentSlug}`} className="link">
                {p.name}
              </Link>
            </nav>
            <div style={{ display: "grid", gap: 8 }}>
              <p className={`label t-${p.scent}`}>{p.formatLabel}</p>
              <h1>{p.name}</h1>
              <p className="scene">{p.sceneLine}</p>
            </div>
            <div style={{ display: "grid", gap: 4 }}>
              <p className="price-big">
                {inr(p.price)}
                {p.mrp > p.price && (
                  <span className="muted" style={{ fontSize: "1rem", marginLeft: 10 }}>
                    <s>{inr(p.mrp)}</s> MRP · {p.priceNote}
                  </span>
                )}
              </p>
              <p className="muted" style={{ fontSize: "0.85rem" }}>
                {p.size} · MRP inclusive of all taxes
              </p>
            </div>
            <p>{p.intro}</p>

            <div className="switch" role="group" aria-label="Format">
              {versions.map((v) => (
                <Link key={v.id} href={`/products/${v.slug}`} aria-current={v.id === p.id ? "true" : undefined}>
                  <span className="eyebrow">{v.format === "gel" ? "Shower gel" : "Shimmer mist"}</span>
                  <span className="muted">
                    {v.size} · {inr(v.price)}
                  </span>
                </Link>
              ))}
            </div>

            <BuyBox item={line} disabled={!p.inStock} />
            <Pincode />

            <div className="perks">
              <ul>
                <li>— Complimentary gift wrap and a handwritten note</li>
                <li>— Secure payment: UPI, cards and netbanking</li>
                <li>— Questions about your skin? <Link className="link" href="/help">Ask us</Link></li>
              </ul>
            </div>

            <Accordion
              openFirst
              items={[
                {
                  title: "What it does",
                  body: (
                    <>
                      {p.actives.map((a) => (
                        <p key={a.name}>
                          <strong style={{ fontWeight: 500 }}>{a.name}.</strong> {a.what}
                        </p>
                      ))}
                    </>
                  ),
                },
                {
                  title: "Smells like, feels like",
                  body: (
                    <>
                      <p>
                        <span className="eyebrow muted">Smells like</span>
                        <br />
                        {p.smellsLike}
                      </p>
                      <p>
                        <span className="eyebrow muted">Feels like</span>
                        <br />
                        {p.feelsLike}
                      </p>
                      <p>
                        <span className="eyebrow muted">Fragrance</span>
                        <br />
                        {p.fragrance}
                      </p>
                    </>
                  ),
                },
                ...(p.notes
                  ? [
                      {
                        title: "Notes",
                        body: (
                          <table className="legal-table">
                            <tbody>
                              <tr>
                                <td>Top</td>
                                <td>{p.notes.top}</td>
                              </tr>
                              <tr>
                                <td>Heart</td>
                                <td>{p.notes.heart}</td>
                              </tr>
                              <tr>
                                <td>Base</td>
                                <td>{p.notes.base}</td>
                              </tr>
                            </tbody>
                          </table>
                        ),
                      },
                    ]
                  : []),
                {
                  title: "How to use",
                  body: (
                    <ol>
                      {p.howTo.map((s) => (
                        <li key={s}>{s}</li>
                      ))}
                    </ol>
                  ),
                },
                {
                  title: "Ingredients",
                  body: <p className="pending">The full ingredient list is printed on the pack and is being added here.</p>,
                },
                {
                  title: "Product details",
                  body: (
                    <table className="legal-table">
                      <tbody>
                        {p.legal.map((l) => (
                          <tr key={l.label}>
                            <td>{l.label}</td>
                            <td className={l.pending ? "pending" : ""}>{l.value}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ),
                },
              ]}
            />
          </div>
        </div>
      </div>

      {/* Mist launch: how to wear it, out of the accordion and on the page */}
      {p.format === "mist" && (
        <section className={`section wrap how-wear`} aria-labelledby="wear-title">
          <div className="section-head">
            <div style={{ display: "grid", gap: 12 }}>
              <p className={`eyebrow t-${p.scent}`}>
                <span className="new-tag">New</span> How to wear it
              </p>
              <h2 id="wear-title" className="display-4">
                Hair, shoulders, collarbones.
              </h2>
            </div>
          </div>
          <ol className="wear-steps">
            {p.howTo.map((step, i) => (
              <li key={step}>
                <span className="n">{String(i + 1).padStart(2, "0")}</span>
                <p>{step}</p>
              </li>
            ))}
          </ol>
        </section>
      )}

      {/* PDP-10 complete the ritual */}
      <section className="section wrap" aria-labelledby="ritual-title">
        <div className={`bundle bg-${p.scent}`}>
          <div style={{ gridColumn: "1 / -1", display: "grid", gap: 8, marginBottom: 8 }}>
            <p className={`eyebrow t-${p.scent}`}>Complete the ritual</p>
            <h2 id="ritual-title" className="display-3">
              {p.ritualPairing}
            </h2>
          </div>
          {[p, sib].map((x, i) => (
            <div key={x.id} style={{ display: "contents" }}>
              <div className="item">
                <div className="img-frame">
                  <Image src={x.images[0].src} alt="" width={x.images[0].w} height={x.images[0].h} sizes="160px" />
                </div>
                <div>
                  <p className="label muted">{x.formatLabel}</p>
                  <p style={{ fontFamily: "var(--font-display)", fontSize: "1.3rem" }}>{x.name}</p>
                  <p className="price muted">{inr(x.price)}</p>
                </div>
              </div>
              {i === 0 && <span className="plus" aria-hidden="true">+</span>}
            </div>
          ))}
          <AddToBag items={[p, sib].map(toLine)} label={`Add both · ${inr(p.price + sib.price)}`} className={`btn ${p.scent}`} disabled={!p.inStock || !sib.inStock} />
        </div>
      </section>

      <section className="section wrap" style={{ paddingTop: 0 }} aria-labelledby="pairs-title">
        <div className="section-head">
          <div style={{ display: "grid", gap: 12 }}>
            <p className="eyebrow muted">The other world</p>
            <h2 id="pairs-title">Pairs with {pair.name}.</h2>
          </div>
        </div>
        <div className="grid-products two">
          {[pair, products.find((x) => x.scent !== p.scent && x.format !== p.format)!].map((x, i) => (
            <ProductCard key={x.id} p={x} i={i} />
          ))}
        </div>
      </section>

      <section className="section wrap" style={{ paddingTop: 0 }} aria-labelledby="pfaq-title">
        <div style={{ maxWidth: 900 }}>
          <h2 id="pfaq-title" className="display-3" style={{ marginBottom: 20 }}>
            Questions
          </h2>
          <Accordion items={p.faq.map((f) => ({ title: f.q, body: <p>{f.a}</p> }))} />
        </div>
      </section>

      <StickyBuyBar item={line} targetId="buy-main" disabled={!p.inStock} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify([jsonld, crumbs]).replace(/</g, "\\u003c") }} />
    </>
  );
}

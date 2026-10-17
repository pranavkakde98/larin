import type { Metadata } from "next";
import Link from "next/link";
import { AddToBag } from "@/components/AddToBag";
import { SetImage } from "@/components/SetImage";
import { CollectionTabs } from "@/components/CollectionTabs";
import { ProductCard } from "@/components/ProductCard";
import { getProducts, getSets } from "@/lib/commerce";
import { inr } from "@/lib/format";
import { toLine } from "@/lib/line";

export const metadata: Metadata = {
  title: "Shop shower gels, shimmer mists and sets",
  description: "Flowers for Myself and A Bath in the Rain shower gels and alcohol-free shimmer hair & body mists, plus the Duo and ritual sets.",
};

export default async function Shop() {
  const products = await getProducts();
  const sets = await getSets();
  return (
    <div className="wrap">
      <header className="page-head">
        <p className="eyebrow muted">Shop</p>
        <h1>Everything, in two scents.</h1>
      </header>
      <h2 className="sr-only">Products and sets</h2>
      <CollectionTabs
        tabs={[
          { key: "all", label: "All" },
          { key: "mist", label: "Shimmer mists · New" },
          { key: "gel", label: "Shower gels" },
          { key: "set", label: "Sets" },
        ]}
      >
        <div className="grid-products" style={{ paddingBottom: "var(--section)" }}>
          {[...products.filter((x) => x.format === "mist"), ...products.filter((x) => x.format !== "mist")].map((p, i) => (
            <div key={p.id} data-format={p.format}>
              <ProductCard p={p} i={i} />
            </div>
          ))}
          {sets.map((s, i) => (
            <div key={s.id} data-format="set">
              <article className="card reveal" style={{ ["--i" as string]: i }}>
                <SetImage products={s.products} photo={s.id === "duo" ? s.image : undefined} sizes="(max-width: 1024px) 50vw, 25vw" />
                <div className="card-body">
                  <p className={`eyebrow ${s.scent ? `t-${s.scent}` : "muted"}`}>Set of {s.items.length}</p>
                  <h3>
                    <Link href="/gifts" className="card-link">
                      {s.name}
                    </Link>
                  </h3>
                  <p className="scene">{s.line}</p>
                  <div className="meta">
                    <span className="muted">{s.products.map((p) => (p.format === "gel" ? "Gel" : "Mist")).join(" + ")}</span>
                    <span className="price">{inr(s.price)}</span>
                  </div>
                </div>
                <div style={{ position: "relative", zIndex: 2 }}>
                  <AddToBag items={s.products.map(toLine)} label="Add set" className="btn small ghost block" />
                </div>
              </article>
            </div>
          ))}
        </div>
      </CollectionTabs>
    </div>
  );
}

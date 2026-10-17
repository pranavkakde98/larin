import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/content/products";
import { toLine } from "@/lib/line";
import { inr } from "@/lib/format";
import { AddToBag } from "./AddToBag";

// Product card: VOICE-01 scene line, ART-02 scent colour on the eyebrow, quiet price.
export function ProductCard({ p, i = 0, sizes = "(max-width: 1024px) 50vw, 25vw" }: { p: Product; i?: number; sizes?: string }) {
  const img = p.images[0];
  return (
    <article className="card reveal" style={{ ["--i" as string]: i }}>
      <div className="img-frame hover-breathe">
        <Image src={img.src} alt={img.alt} width={img.w} height={img.h} sizes={sizes} />
      </div>
      <div className="quick">
        <AddToBag items={[toLine(p)]} label="Add" className="btn small light" disabled={!p.inStock} context={`${p.name} ${p.formatLabel}`} />
      </div>
      <div className="card-body">
        <p className={`label t-${p.scent}`}>
          {p.format === "mist" && <span className="new-tag">New</span>}
          {p.formatLabel}
        </p>
        <h3>
          <Link href={`/products/${p.slug}`} className="card-link">
            {p.name}
          </Link>
        </h3>
        <p className="scene">{p.sceneLine}</p>
        <div className="meta">
          <span className="muted">{p.size}</span>
          <span className="price">
            {inr(p.price)}
            {p.mrp > p.price && (
              <s>
                <span className="sr-only">MRP </span>
                {inr(p.mrp)}
              </s>
            )}
          </span>
        </div>
      </div>
      <div className="add-row">
        <AddToBag items={[toLine(p)]} label="Add to bag" className="btn small ghost block" disabled={!p.inStock} context={`${p.name} ${p.formatLabel}`} />
      </div>
    </article>
  );
}

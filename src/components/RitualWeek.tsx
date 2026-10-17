import Image from "next/image";
import Link from "next/link";
import type { Product } from "@/content/products";
import { ritual } from "@/content/site";
import { inr } from "@/lib/format";
import { toLine } from "@/lib/line";
import { AddToBag } from "./AddToBag";

// The weekly ritual as the founder's July "weekly skin cycling" post draws it: three soft tinted
// cards (Flowers days, Rain days, the Sunday reset) with each day's bottle, then the mist finish.
export function RitualWeek({ products, duoPrice, duoLines, showMists = true }: { products: Product[]; duoPrice: number; duoLines: ReturnType<typeof toLine>[]; showMists?: boolean }) {
  const by = (id: string) => products.find((p) => p.id === id)!;
  const flowers = by("flowers-gel");
  const rain = by("rain-gel");
  const mists = products.filter((p) => p.format === "mist");
  const day = (d: string) => ritual.days.find((x) => x.day === d)!.text;

  return (
    <div className="rw">
      <ol className="rw-cards">
        <li className="rw-card flowers">
          <p className="eyebrow t-flowers">Mon · Wed · Fri</p>
          <h3>
            <Link href={`/products/${flowers.slug}`}>Flowers for Myself</Link>
          </h3>
          <p className="rw-text">{day("Mon")}</p>
          <div className="rw-bottle">
            <Image src={flowers.images[0].src} alt="" width={flowers.images[0].w} height={flowers.images[0].h} sizes="(max-width: 900px) 40vw, 200px" />
          </div>
        </li>
        <li className="rw-card rain">
          <p className="eyebrow t-rain">Tue · Thu · Sat</p>
          <h3>
            <Link href={`/products/${rain.slug}`}>A Bath in the Rain</Link>
          </h3>
          <p className="rw-text">{day("Tue")}</p>
          <div className="rw-bottle">
            <Image src={rain.images[0].src} alt="" width={rain.images[0].w} height={rain.images[0].h} sizes="(max-width: 900px) 40vw, 200px" />
          </div>
        </li>
        <li className="rw-card sunday">
          <p className="eyebrow">Sunday · the reset</p>
          <h3>Both, in two steps.</h3>
          <ol className="rw-steps">
            <li>
              <span className="dot flowers" aria-hidden="true" />
              <span>
                <strong>Flowers for Myself</strong> on breakout-prone areas first.
              </span>
            </li>
            <li>
              <span className="dot rain" aria-hidden="true" />
              <span>
                <strong>A Bath in the Rain</strong> everywhere else.
              </span>
            </li>
          </ol>
          <div className="rw-pair" aria-hidden="true">
            <Image src={flowers.images[0].src} alt="" width={flowers.images[0].w} height={flowers.images[0].h} sizes="120px" />
            <Image src={rain.images[0].src} alt="" width={rain.images[0].w} height={rain.images[0].h} sizes="120px" />
          </div>
        </li>
      </ol>

      <div className="rw-foot">
        {showMists ? (
        <div className="rw-mist">
          <p className="eyebrow muted">Every day</p>
          <p className="rw-mist-line">Finish with the matching shimmer mist, on hair lengths and shoulders.</p>
          <ul>
            {mists.map((m) => (
              <li key={m.id}>
                <Link href={`/products/${m.slug}`} className="link">
                  <span className={`dot ${m.scent}`} aria-hidden="true" />
                  {m.name} mist
                </Link>
                <span className="price">{inr(m.price)}</span>
                <AddToBag items={[toLine(m)]} label="Add" className="btn small ghost" context={`${m.name} shimmer mist`} />
              </li>
            ))}
          </ul>
        </div>
        ) : (
          <p className="rw-mist-line">Every day, finish with the matching shimmer mist.</p>
        )}
        <div className="rw-cta">
          <AddToBag items={duoLines} label={`Add the Duo · ${inr(duoPrice)}`} />
        </div>
      </div>
    </div>
  );
}

import Image from "next/image";
import Link from "next/link";
import { Monogram } from "@/components/Monogram";
import { getProducts } from "@/lib/commerce";

// P12: a 404 with its own moment — the monogram and two doors back into the scent worlds.
export default async function NotFound() {
  const products = await getProducts();
  const flowers = products.find((p) => p.id === "flowers-gel")!;
  return (
    <div style={{ paddingBottom: "var(--section)" }}>
      <header className="wrap page-head nf-head">
        <Monogram className="nf-mono" />
        <p className="eyebrow muted">Page not found</p>
        <h1>This page drifted away.</h1>
        <p className="muted">The rest of the ritual is right here. Choose a world to step back into.</p>
      </header>
      <div className="wrap">
        <div className="nf-doors">
          <Link href="/scents/flowers-for-myself" className="nf-door bg-flowers">
            <div className="img-frame">
              <Image src={flowers.images[0].src} alt="" width={flowers.images[0].w} height={flowers.images[0].h} sizes="(max-width: 760px) 50vw, 40vw" />
            </div>
            <span className="eyebrow t-flowers">Mon · Wed · Fri</span>
            <span className="nf-name">Flowers for Myself</span>
          </Link>
          <Link href="/scents/a-bath-in-the-rain" className="nf-door bg-rain">
            <div className="img-frame">
              <Image src="/media/gel-rain-2.jpg" alt="" width={928} height={1152} sizes="(max-width: 760px) 50vw, 40vw" />
            </div>
            <span className="eyebrow t-rain">Tue · Thu · Sat</span>
            <span className="nf-name">A Bath in the Rain</span>
          </Link>
        </div>
        <p style={{ display: "flex", gap: 28, flexWrap: "wrap", justifyContent: "center", marginTop: 32 }}>
          <Link href="/" className="link-arrow">
            Home <span>→</span>
          </Link>
          <Link href="/shop" className="link-arrow">
            Shop all <span>→</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

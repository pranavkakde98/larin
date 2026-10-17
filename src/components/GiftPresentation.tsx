import Image from "next/image";
import type { Product } from "@/content/products";
import { Logo } from "./Logo";
import { Monogram } from "./Monogram";

// The gift in the brand's own language (brand book p12 monogram pattern, p30–p31 wordmark ribbon and
// tissue): the chosen products resting on monogram tissue, a black wordmark ribbon and the handwritten
// note. A brand graphic, not a photograph of packaging, until the founder confirms what ships.
export function GiftPresentation({
  products,
  message = "Because you deserve the beautiful things on ordinary days.",
  to,
  empty = "Your pieces will rest here.",
}: {
  products: Product[];
  message?: string;
  to?: string;
  empty?: string;
}) {
  return (
    <figure className="gift-tissue" aria-label="A La Reiné gift: the chosen pieces on monogram tissue, a wordmark ribbon and a handwritten note">
      <div className="gt-items" data-count={products.length}>
        {products.length === 0 ? (
          <p className="gt-empty">{empty}</p>
        ) : (
          products.slice(0, 4).map((p, i) => (
            <div key={`${p.id}-${i}`} className="gt-item">
              <Image src={p.images[0].src} alt={`${p.name} ${p.formatLabel}`} width={p.images[0].w} height={p.images[0].h} sizes="(max-width: 900px) 30vw, 180px" />
            </div>
          ))
        )}
      </div>
      <div className="gt-ribbon" aria-hidden="true">
        <Logo />
        <Logo />
        <Logo />
        <Logo />
      </div>
      <div className="giftcard gt-card" aria-hidden="true">
        <Monogram className="mono" />
        {to && <p className="eyebrow muted">For {to}</p>}
        <p className="msg">{message}</p>
      </div>
    </figure>
  );
}

import Image from "next/image";
import type { Img, Product } from "@/content/products";

// Audit finding 07: a set's main image shows exactly the products in it. A single photograph of the
// set is used when one exists (the Duo on its bath tray); otherwise the products sit side by side.
export function SetImage({ products, photo, sizes = "(max-width: 1024px) 50vw, 33vw" }: { products: Product[]; photo?: Img; sizes?: string }) {
  const label = `Contains ${products.map((p) => `${p.name} ${p.formatLabel}`).join(" and ")}`;
  if (photo) {
    return (
      <div className="set-photo img-frame hover-breathe">
        <Image src={photo.src} alt={`${photo.alt}. ${label}.`} width={photo.w} height={photo.h} sizes={sizes} />
      </div>
    );
  }
  return (
    <div className="set-pair hover-breathe" role="img" aria-label={label}>
      {products.map((p) => (
        <div key={p.id}>
          <Image src={p.images[0].src} alt="" width={p.images[0].w} height={p.images[0].h} sizes={sizes} />
        </div>
      ))}
    </div>
  );
}

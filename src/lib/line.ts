export interface CartLine {
  id: string; // product id
  slug: string;
  name: string;
  formatLabel: string;
  scent: "flowers" | "rain";
  price: number;
  image: string;
  qty: number;
}

// A gift box is its own group in the bag: its contents and note never merge with the
// shopper's own items or with another gift.
export interface GiftBox {
  id: string;
  to: string;
  message: string;
  items: CartLine[];
}

export const GIFT_TO_MAX = 40;
export const GIFT_MESSAGE_MAX = 160;
export const ORDER_NOTE_MAX = 200;

export const toLine = (p: {
  id: string;
  slug: string;
  name: string;
  formatLabel: string;
  scent: "flowers" | "rain";
  price: number;
  images: { src: string }[];
}): Omit<CartLine, "qty"> => ({
  id: p.id,
  slug: p.slug,
  name: p.name,
  formatLabel: p.formatLabel,
  scent: p.scent,
  price: p.price,
  image: p.images[0].src,
});

// Restore only well-formed data from browser storage (it may be stale or tampered with).
const str = (v: unknown, max: number) => (typeof v === "string" ? v.slice(0, max) : "");
export function sanitizeLine(v: unknown): CartLine | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const qty = Math.floor(Number(o.qty));
  const price = Number(o.price);
  if (typeof o.id !== "string" || !o.id || !(qty >= 1) || !(price > 0)) return null;
  if (o.scent !== "flowers" && o.scent !== "rain") return null;
  return {
    id: o.id,
    slug: str(o.slug, 120),
    name: str(o.name, 120),
    formatLabel: str(o.formatLabel, 80),
    scent: o.scent,
    price,
    image: str(o.image, 200),
    qty: Math.min(10, qty),
  };
}
export function sanitizeGift(v: unknown): GiftBox | null {
  if (!v || typeof v !== "object") return null;
  const o = v as Record<string, unknown>;
  const items = Array.isArray(o.items) ? o.items.map(sanitizeLine).filter((x): x is CartLine => !!x) : [];
  if (typeof o.id !== "string" || !items.length) return null;
  return { id: o.id, to: str(o.to, GIFT_TO_MAX), message: str(o.message, GIFT_MESSAGE_MAX), items };
}

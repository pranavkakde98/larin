import "server-only";
import { products as local, sets as localSets, type Product } from "@/content/products";

const WOO = "https://lareine.hypotenuse.in/wp-json/wc/store/v1/products?per_page=50";

interface WooProduct {
  id: number;
  prices: { price: string; regular_price: string; currency_minor_unit: number };
  is_in_stock: boolean;
}

// Read-only: prices and stock for products that exist in the client's WooCommerce store.
// Cached for 5 minutes. If the store is unreachable, local content prices are used.
async function wooPrices(): Promise<Map<number, { price: number; mrp: number; inStock: boolean }>> {
  const map = new Map<number, { price: number; mrp: number; inStock: boolean }>();
  try {
    const res = await fetch(WOO, { next: { revalidate: 300 }, signal: AbortSignal.timeout(8000) });
    if (!res.ok) return map;
    const data = (await res.json()) as WooProduct[];
    for (const p of data) {
      const d = 10 ** (p.prices.currency_minor_unit ?? 2);
      map.set(p.id, {
        price: Number(p.prices.price) / d,
        mrp: Number(p.prices.regular_price) / d,
        inStock: p.is_in_stock,
      });
    }
  } catch {
    // fall back to local prices
  }
  return map;
}

export async function getProducts(): Promise<Product[]> {
  const live = await wooPrices();
  return local.map((p) => {
    const w = p.wooId ? live.get(p.wooId) : undefined;
    if (!w || !w.price) return p;
    const mrp = Math.max(w.mrp || w.price, w.price);
    return {
      ...p,
      price: w.price,
      mrp,
      inStock: w.inStock,
      legal: p.legal.map((l) => (l.label === "MRP" ? { ...l, value: `₹${mrp} (inclusive of all taxes)` } : l)),
    };
  });
}

export async function getProduct(slug: string) {
  return (await getProducts()).find((p) => p.slug === slug) ?? null;
}

export async function getSets() {
  const all = await getProducts();
  return localSets.map((s) => {
    const items = s.items.map((id) => all.find((p) => p.id === id)!);
    return { ...s, products: items, price: items.reduce((n, p) => n + p.price, 0) };
  });
}

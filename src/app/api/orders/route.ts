import { randomBytes } from "node:crypto";
import { getProducts } from "@/lib/commerce";
import { rateLimited, save } from "@/lib/store";

const PAYMENTS = ["upi", "card", "netbanking"];

// Mock checkout: prices are re-validated on the server against the catalogue (never trusted from
// the browser), then the order is saved through lib/store. No payment, no live store.
export async function POST(req: Request) {
  const limited = rateLimited(req, "orders");
  if (limited) return limited;
  let body: {
    customer?: Record<string, string>;
    payment?: string;
    lines?: { id: string; qty: number }[];
    gift?: { wrap: boolean; note: string };
    gifts?: { to?: string; message?: string; items?: { id: string; qty: number }[] }[];
  };
  try {
    body = await req.json();
  } catch {
    return Response.json({ error: "Invalid JSON" }, { status: 400 });
  }
  const catalogue = await getProducts();
  const price = (raw: { id: string; qty: number }[] | undefined) =>
    (Array.isArray(raw) ? raw : [])
      .map((l) => {
        const p = catalogue.find((x) => x.id === l?.id);
        const qty = Math.max(1, Math.min(10, Math.floor(Number(l?.qty) || 0)));
        return p && p.inStock ? { id: p.id, name: p.name, formatLabel: p.formatLabel, qty, price: p.price } : null;
      })
      .filter((x): x is NonNullable<typeof x> => x !== null);
  const lines = price(body.lines);
  const gifts = (Array.isArray(body.gifts) ? body.gifts : []).slice(0, 10)
    .map((g) => ({ to: String(g?.to ?? "").slice(0, 40), message: String(g?.message ?? "").slice(0, 160), items: price(g?.items) }))
    .filter((g) => g.items.length);
  if (!lines.length && !gifts.length) return Response.json({ error: "Empty order" }, { status: 400 });
  const raw = body.customer ?? {};
  const clip = (k: string, n: number) => String(raw[k] ?? "").trim().slice(0, n);
  const c = {
    name: clip("name", 80),
    email: clip("email", 200),
    phone: clip("phone", 20),
    address: clip("address", 200),
    city: clip("city", 60),
    state: clip("state", 60),
    pincode: clip("pincode", 6),
  };
  if (!c.name || !/^\S+@\S+\.\S+$/.test(c.email) || !/^[6-9]\d{9}$/.test(c.phone.replace(/\D/g, "").slice(-10)) || !/^[1-8]\d{5}$/.test(c.pincode)) {
    return Response.json({ error: "Missing customer details" }, { status: 400 });
  }
  const payment = PAYMENTS.includes(String(body.payment)) ? String(body.payment) : null;
  if (!payment) return Response.json({ error: "Unknown payment method" }, { status: 400 });
  const id = "LR-" + new Date().toISOString().slice(2, 10).replace(/-/g, "") + "-" + randomBytes(2).toString("hex").toUpperCase();
  const sum = (ls: { qty: number; price: number }[]) => ls.reduce((n, l) => n + l.qty * l.price, 0);
  const total = sum(lines) + gifts.reduce((n, g) => n + sum(g.items), 0);
  const order = {
    id,
    mode: "mock",
    createdAt: new Date().toISOString(),
    payment,
    customer: c,
    gift: { wrap: !!body.gift?.wrap, note: String(body.gift?.note ?? "").slice(0, 200) },
    lines,
    gifts,
    total,
  };
  const failed = await save("orders.json", order);
  if (failed) return failed;
  return Response.json({ id, total, lines, gifts, customer: { name: c.name } });
}

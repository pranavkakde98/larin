import { rateLimited, save } from "@/lib/store";

export async function POST(req: Request) {
  const limited = rateLimited(req, "contact");
  if (limited) return limited;
  const d = await req.json().catch(() => null);
  if (!d || !d.name || !/^\S+@\S+\.\S+$/.test(String(d.email)) || String(d.message ?? "").trim().length < 5) {
    return Response.json({ error: "Invalid message" }, { status: 400 });
  }
  const clip = (s: unknown, n: number) => String(s ?? "").slice(0, n);
  const failed = await save("contact.json", { name: clip(d.name, 120), email: clip(d.email, 200), order: clip(d.order, 40), message: clip(d.message, 4000), at: new Date().toISOString() });
  return failed ?? Response.json({ ok: true });
}

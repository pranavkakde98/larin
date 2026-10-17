import { rateLimited, save } from "@/lib/store";

export async function POST(req: Request) {
  const limited = rateLimited(req, "newsletter");
  if (limited) return limited;
  const { email } = await req.json().catch(() => ({ email: "" }));
  if (!/^\S+@\S+\.\S+$/.test(String(email))) return Response.json({ error: "Invalid email" }, { status: 400 });
  const failed = await save("newsletter.json", { email: String(email).slice(0, 200), at: new Date().toISOString() });
  return failed ?? Response.json({ ok: true });
}

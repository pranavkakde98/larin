import "server-only";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

// Where form submissions go (orders, newsletter, contact). Never the live store.
// Development: local JSON files in .data/. Production hosts such as Vercel have a read-only
// filesystem, so production needs a hosted store; until one is configured, submissions fail
// with a clear 503 instead of appearing to succeed. LAREINE_STORE=file forces local files
// (for `next start` on this machine only).
const DIR = path.join(process.cwd(), ".data");
const useFiles = process.env.NODE_ENV !== "production" || process.env.LAREINE_STORE === "file";

export class StoreUnavailableError extends Error {}

export async function append(file: string, record: unknown) {
  if (!useFiles) throw new StoreUnavailableError(`No production store configured for ${file}`);
  await mkdir(DIR, { recursive: true });
  const p = path.join(DIR, file);
  let list: unknown[] = [];
  try {
    list = JSON.parse(await readFile(p, "utf8"));
  } catch {}
  list.push(record);
  await writeFile(p, JSON.stringify(list, null, 2));
}

// Saves a record and maps failures to responses. Returns null on success.
export async function save(file: string, record: unknown): Promise<Response | null> {
  try {
    await append(file, record);
    return null;
  } catch (e) {
    if (e instanceof StoreUnavailableError) {
      return Response.json({ error: "Sign-ups open soon. Please try again later." }, { status: 503 });
    }
    console.error(`store: could not save ${file}`, e);
    return Response.json({ error: "Could not save. Please try again." }, { status: 500 });
  }
}

// Basic per-IP limit: `max` requests per minute per route, per server instance.
const hits = new Map<string, number[]>();
export function rateLimited(req: Request, route: string, max = 5): Response | null {
  const ip = req.headers.get("x-forwarded-for")?.split(",")[0].trim() || req.headers.get("x-real-ip") || "local";
  const key = `${route}:${ip}`;
  const now = Date.now();
  const recent = (hits.get(key) ?? []).filter((t) => now - t < 60_000);
  if (recent.length >= max) {
    return Response.json({ error: "Too many requests. Please wait a minute." }, { status: 429, headers: { "Retry-After": "60" } });
  }
  recent.push(now);
  hits.set(key, recent);
  if (hits.size > 5000) hits.clear();
  return null;
}

import type { MetadataRoute } from "next";
import { products } from "@/content/products";
import { posts, scents, settings } from "@/content/site";

export default function sitemap(): MetadataRoute.Sitemap {
  const u = (p: string) => `${settings.url}${p}`;
  const fixed = ["/", "/shop", "/ritual", "/which-one", "/gifts", "/gifts/build-a-box", "/our-story", "/journal", "/help", "/shipping", "/refund-policy", "/privacy", "/terms"];
  return [
    ...fixed.map((p) => ({ url: u(p) })),
    ...scents.map((s) => ({ url: u(`/scents/${s.slug}`) })),
    ...products.map((p) => ({ url: u(`/products/${p.slug}`) })),
    ...posts.map((p) => ({ url: u(`/journal/${p.slug}`) })),
  ];
}

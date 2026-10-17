import type { MetadataRoute } from "next";
import { settings } from "@/content/site";

export default function robots(): MetadataRoute.Robots {
  return { rules: [{ userAgent: "*", allow: "/", disallow: ["/checkout", "/order/", "/api/"] }], sitemap: `${settings.url}/sitemap.xml` };
}

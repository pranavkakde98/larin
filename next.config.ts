import type { NextConfig } from "next";

// Classic caching model: this is a small, mostly static store, so Cache Components
// and Partial Prefetching (which require each other) are left off.
const nextConfig: NextConfig = {
  images: {
    qualities: [75, 85],
    formats: ["image/avif", "image/webp"],
  },
  // 301s from the old WordPress URLs. They only matter if this site replaces the old one.
  async redirects() {
    const r = (source: string, destination: string) => ({ source, destination, permanent: true });
    return [
      r("/flower-for-myself", "/scents/flowers-for-myself"),
      r("/bath-in-the-rain", "/scents/a-bath-in-the-rain"),
      r("/product/flowers-for-myself", "/products/flowers-for-myself-shower-gel"),
      r("/product/bath-in-the-rain", "/products/a-bath-in-the-rain-shower-gel"),
      r("/about", "/our-story"),
      r("/blogs", "/journal"),
      r("/hello-world", "/journal"),
      r("/contact", "/help"),
      r("/return-refund-policy", "/refund-policy"),
      r("/terms-and-conditions", "/terms"),
      r("/privacy-policy", "/privacy"),
      r("/cart", "/checkout"),
      r("/wishlist", "/"),
      r("/my-account", "/"),
    ];
  },
};

export default nextConfig;

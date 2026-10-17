"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

// MOTION-01: reveal once on scroll. Content stays visible without JS: the `js` class
// (which hides .reveal elements) is only added after hydration, and elements already in
// view are revealed immediately.
export function RevealInit() {
  const pathname = usePathname();
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    root.classList.add("js");
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            e.target.classList.add("in");
            io.unobserve(e.target);
          }
        }
      },
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    const scan = () =>
      document.querySelectorAll<HTMLElement>(".reveal:not(.in)").forEach((el) => {
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight * 0.95) el.classList.add("in");
        else io.observe(el);
      });
    scan();
    const t = setTimeout(scan, 300);
    return () => {
      clearTimeout(t);
      io.disconnect();
    };
  }, [pathname]);
  return null;
}

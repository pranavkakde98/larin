"use client";

import { useEffect, useRef } from "react";

// P8: footer link groups. Open on wider screens; on phones they start collapsed so the footer
// is a short list of headings rather than a 1,200px wall of links.
export function FooterGroup({ title, children }: { title: string; children: React.ReactNode }) {
  const ref = useRef<HTMLDetailsElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const mq = window.matchMedia("(max-width: 600px)");
    const sync = () => {
      el.open = !mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);
  return (
    <details ref={ref} open>
      <summary>
        <h2>{title}</h2>
      </summary>
      {children}
    </details>
  );
}

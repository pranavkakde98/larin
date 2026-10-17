"use client";

import { useState, useSyncExternalStore } from "react";

const noop = () => () => {};

// Tabs filter a server-rendered grid by data-format, so cards stay server components.
// `?format=gel|mist|set` in the URL preselects a tab (links from the menu and the chooser).
export function CollectionTabs({ children, tabs, param = "format" }: { children: React.ReactNode; tabs: { key: string; label: string }[]; param?: string }) {
  const fromUrl = useSyncExternalStore(
    noop,
    () => new URLSearchParams(window.location.search).get(param),
    () => null,
  );
  const [chosen, setChosen] = useState<string | null>(null);
  const valid = (k: string | null) => (k && tabs.some((t) => t.key === k) ? k : null);
  const active = valid(chosen) ?? valid(fromUrl) ?? tabs[0].key;
  return (
    <div data-active={active} className="collection">
      <div className="tabs" role="group" aria-label="Filter products" style={{ marginBottom: 32 }}>
        {tabs.map((t) => (
          <button key={t.key} type="button" aria-pressed={active === t.key} onClick={() => setChosen(t.key)}>
            {t.label}
          </button>
        ))}
      </div>
      <style>{tabs
        .filter((t) => t.key !== "all")
        .map((t) => `.collection[data-active="${t.key}"] [data-format]:not([data-format~="${t.key}"]){display:none}`)
        .join("")}</style>
      {children}
    </div>
  );
}

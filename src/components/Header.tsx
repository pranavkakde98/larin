"use client";

import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import type { ProductLite as Product } from "@/content/products";
import { useCart, toLine } from "@/lib/cart";
import { inr } from "@/lib/format";
import { AddToBag } from "./AddToBag";
import { Dialog } from "./Dialog";
import { IconBag, IconClose, IconMenu } from "./Icons";
import { Logo } from "./Logo";

type Scent = "flowers" | "rain";

// NAV-05 flat nav with NAV-02 scent as the primary axis.
export function Header({ products }: { products: Product[] }) {
  const pathname = usePathname();
  const { count, setOpen } = useCart();
  const [solid, setSolid] = useState(false);
  const [panel, setPanel] = useState<Scent | null>(null);
  const [menu, setMenu] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const on = () => setSolid(window.scrollY > 40);
    const raf = requestAnimationFrame(on);
    window.addEventListener("scroll", on, { passive: true });
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", on);
    };
  }, []);

  // Close menus on navigation: track the path they were opened on.
  const [openedOn, setOpenedOn] = useState(pathname);
  if (openedOn !== pathname) {
    setOpenedOn(pathname);
    setPanel(null);
    setMenu(false);
  }

  useEffect(() => {
    if (!panel) return;
    const k = (e: KeyboardEvent) => {
      if (e.key === "Escape") setPanel(null);
    };
    window.addEventListener("keydown", k);
    return () => window.removeEventListener("keydown", k);
  }, [panel]);

  const openPanel = (s: Scent) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setPanel(s);
  };
  const scheduleClose = () => {
    closeTimer.current = setTimeout(() => setPanel(null), 160);
  };

  const scentLink = (s: Scent, label: string, short: string, slug: string) => (
    <Link
      href={`/scents/${slug}`}
      aria-current={pathname === `/scents/${slug}` ? "page" : undefined}
      onMouseEnter={() => openPanel(s)}
      onMouseLeave={scheduleClose}
      onFocus={() => openPanel(s)}
      aria-expanded={panel === s}
      aria-controls={`panel-${s}`}
    >
      <span className={`dot ${s} nav-dot`} aria-hidden="true" />
      <span className="nav-long">{label}</span>
      <span className="nav-short">{short}</span>
    </Link>
  );

  // Phase A: the home hero opens on Linen, so the header is never transparent over photography.
  const cls = ["header", solid && "solid", panel && "panel-open"].filter(Boolean).join(" ");

  return (
    <>
      <header className={cls}>
        <div className="wrap header-inner">
          <button className="icon-btn menu-btn" aria-label="Open menu" aria-expanded={menu} onClick={() => setMenu(true)}>
            <IconMenu />
          </button>
          <nav className="nav" aria-label="Scents">
            <Link href="/shop" aria-current={pathname === "/shop" ? "page" : undefined}>
              Shop
            </Link>
            <Link href="/shop?format=mist" className="nav-new">
              <span className="new-tag">New</span>Mists
            </Link>
            {scentLink("flowers", "Flowers for Myself", "Flowers", "flowers-for-myself")}
            {scentLink("rain", "A Bath in the Rain", "Rain", "a-bath-in-the-rain")}
          </nav>
          <Link href="/" className="header-logo" aria-label="La Reiné, home">
            <Logo title="La Reiné" />
          </Link>
          <nav className="nav right" aria-label="Discover">
            <Link href="/ritual" aria-current={pathname === "/ritual" ? "page" : undefined}>
              The Ritual
            </Link>
            <Link href="/gifts" aria-current={pathname.startsWith("/gifts") ? "page" : undefined}>
              Gifts
            </Link>
            <Link href="/our-story" aria-current={pathname === "/our-story" ? "page" : undefined}>
              Our Story
            </Link>
            <button className="navlink" onClick={() => setOpen(true)} aria-label={`Bag, ${count} items`}>
              Bag
              <span className="bag-count" aria-hidden="true">
                <span>{count}</span>
              </span>
            </button>
          </nav>
          <button className="icon-btn mobile-only bag-btn-mobile" onClick={() => setOpen(true)} aria-label={`Bag, ${count} items`}>
            <IconBag />
            {count > 0 && (
              <span className="bag-count" aria-hidden="true">
                <span>{count}</span>
              </span>
            )}
          </button>
        </div>

        {panel && (
          <div
            id={`panel-${panel}`}
            className={`scent-panel ${panel}`}
            onMouseEnter={() => openPanel(panel)}
            onMouseLeave={scheduleClose}
          >
            <div className="wrap scent-panel-inner">
              <div style={{ display: "grid", gap: 10 }}>
                <p className={`eyebrow t-${panel}`}>{panel === "flowers" ? "Monday · Wednesday · Friday" : "Tuesday · Thursday · Saturday"}</p>
                <p className="display-3">{panel === "flowers" ? "Softness, kept for yourself." : "Fresh, calm, rain-kissed."}</p>
                <Link className="link-arrow" href={`/scents/${panel === "flowers" ? "flowers-for-myself" : "a-bath-in-the-rain"}`} onClick={() => setPanel(null)}>
                  Enter the world <span>→</span>
                </Link>
              </div>
              {products
                .filter((p) => p.scent === panel)
                .map((p) => (
                  <div key={p.id} className="panel-card">
                    <Link href={`/products/${p.slug}`} className="img-frame" onClick={() => setPanel(null)}>
                      <Image src={p.images[0].src} alt={p.images[0].alt} width={p.images[0].w} height={p.images[0].h} sizes="96px" />
                    </Link>
                    <div style={{ display: "grid", gap: 6 }}>
                      <p className="label muted">{p.formatLabel}</p>
                      <Link href={`/products/${p.slug}`} className="display-2" style={{ fontSize: "1.4rem" }} onClick={() => setPanel(null)}>
                        {p.name}
                      </Link>
                      <div className="row-between" style={{ justifyContent: "flex-start", gap: 16 }}>
                        <span className="price">{inr(p.price)}</span>
                        <AddToBag items={[toLine(p)]} label="Add" className="btn small" context={`${p.name} ${p.formatLabel}`} />
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        )}
      </header>

      <Dialog open={menu} onClose={() => setMenu(false)} side="left" label="Menu">
        <div className="sheet-head">
          <Logo className="" />
          <button className="icon-btn" aria-label="Close menu" onClick={() => setMenu(false)} data-autofocus>
            <IconClose />
          </button>
        </div>
        <div className="sheet-body">
          <nav className="menu-links" aria-label="Main" style={{ marginTop: 8 }}>
            <Link href="/shop">Shop all</Link>
            <Link href="/shop?format=mist">
              <span className="new-tag">New</span>Shimmer mists
            </Link>
          </nav>
          <div className="menu-tiles">
            <Link href="/scents/flowers-for-myself" className="menu-tile" style={{ background: "var(--flowers)" }}>
              <Image src="/media/gel-flowers-1.jpg" alt="" width={928} height={1152} sizes="50vw" />
              <span>Flowers for Myself</span>
            </Link>
            <Link href="/scents/a-bath-in-the-rain" className="menu-tile" style={{ background: "var(--rain)" }}>
              <Image src="/media/gel-rain-1.jpg" alt="" width={928} height={1152} sizes="50vw" />
              <span>A Bath in the Rain</span>
            </Link>
          </div>
          <nav className="menu-links" aria-label="More">
            <Link href="/shop?format=gel">Shower gels</Link>
            <Link href="/shop?format=mist">Shimmer mists</Link>
            <Link href="/ritual">The Ritual</Link>
            <Link href="/which-one">Which one is for me?</Link>
            <Link href="/gifts">Gifts</Link>
            <Link href="/our-story">Our Story</Link>
            <Link href="/journal">Journal</Link>
            <Link href="/help">Help</Link>
          </nav>
        </div>
      </Dialog>
    </>
  );
}

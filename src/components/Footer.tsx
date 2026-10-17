import Link from "next/link";
import { products } from "@/content/products";
import { settings } from "@/content/site";
import { Logo } from "./Logo";
import { Monogram } from "./Monogram";
import { FooterGroup } from "./FooterGroup";
import { Newsletter } from "./Newsletter";

// CONV-10 newsletter with a gift, TRUST-07 fraud note, ART-05 monogram texture.
export function Footer() {
  return (
    <footer className="footer">
      <div className="wrap">
        <div className="footer-grid">
          <div>
            <Link href="/" className="footer-logo" aria-label="La Reiné, home">
              <Logo />
            </Link>
            <p className="lede" style={{ marginTop: 20, fontSize: "var(--step-1)" }}>
              Early access to new scents, and a small gift with your first order.
            </p>
            <Newsletter />
          </div>
          <div>
            <FooterGroup title="Shop">
            <ul>
              {products.map((p) => (
                <li key={p.id}>
                  <Link className="link" href={`/products/${p.slug}`}>
                    {p.name} {p.format === "gel" ? "gel" : "mist"}
                  </Link>
                </li>
              ))}
              <li>
                <Link className="link" href="/gifts">
                  Sets and gifts
                </Link>
              </li>
            </ul>
            </FooterGroup>
          </div>
          <div>
            <FooterGroup title="Ritual">
            <ul>
              <li>
                <Link className="link" href="/ritual">
                  The weekly ritual
                </Link>
              </li>
              <li>
                <Link className="link" href="/which-one">
                  Which one is for me?
                </Link>
              </li>
              <li>
                <Link className="link" href="/our-story">
                  Our story
                </Link>
              </li>
              <li>
                <Link className="link" href="/journal">
                  Journal
                </Link>
              </li>
            </ul>
            </FooterGroup>
          </div>
          <div>
            <FooterGroup title="Help">
            <ul>
              <li>
                <Link className="link" href="/help">
                  Help and contact
                </Link>
              </li>
              <li>
                <Link className="link" href="/shipping">
                  Shipping
                </Link>
              </li>
              <li>
                <Link className="link" href="/refund-policy">
                  Returns and refunds
                </Link>
              </li>
              <li>
                <Link className="link" href="/privacy">
                  Privacy
                </Link>
              </li>
              <li>
                <Link className="link" href="/terms">
                  Terms
                </Link>
              </li>
            </ul>
            </FooterGroup>
          </div>
        </div>
        <p className="notice" style={{ marginTop: 48, maxWidth: 720 }}>
          La Reiné will never ask for your OTP, card PIN or bank details by phone, email or message, and never asks for payment outside this website.
        </p>
        <div className="footer-base">
          <span>© 2026 La Reiné. {settings.tagline}</span>
          <span>Made with care in India</span>
        </div>
      </div>
      <Monogram className="mono" />
    </footer>
  );
}

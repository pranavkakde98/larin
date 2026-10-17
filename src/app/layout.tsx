import Link from "next/link";
import type { Metadata, Viewport } from "next";
import { Antonio, Cormorant_Garamond, Jost } from "next/font/google";
import { CartDrawer } from "@/components/CartDrawer";
import { Footer } from "@/components/Footer";
import { Header } from "@/components/Header";
import { RevealInit } from "@/components/Reveal";
import { lite } from "@/content/products";
import { settings } from "@/content/site";
import { getProducts } from "@/lib/commerce";
import { CartProvider } from "@/lib/cart";
import "./globals.css";

const display = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  style: ["normal", "italic"],
  variable: "--ff-display",
  display: "swap",
});
const label = Antonio({ subsets: ["latin"], weight: ["400"], variable: "--ff-label", display: "swap", preload: false });
const body = Jost({ subsets: ["latin"], weight: ["300", "400", "500"], variable: "--ff-body", display: "swap" });

export const metadata: Metadata = {
  metadataBase: new URL(settings.url),
  title: {
    default: "La Reiné · Shower gels and shimmer mists for an everyday ritual",
    template: "%s · La Reiné",
  },
  description:
    "Two scent worlds, one weekly ritual. Flowers for Myself and A Bath in the Rain shower gels and alcohol-free shimmer hair & body mists. Every Bathé Luxury.",
  openGraph: {
    type: "website",
    siteName: "La Reiné",
    locale: "en_IN",
    images: [{ url: "/media/og.jpg", width: 1200, height: 630, alt: "La Reiné shower gels and shimmer mists" }],
  },
  twitter: { card: "summary_large_image" },
};

export const viewport: Viewport = {
  themeColor: "#F7EEE5",
};

export default async function RootLayout({ children }: LayoutProps<"/">) {
  const products = (await getProducts()).map(lite);
  const org = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "La Reiné",
    url: settings.url,
    logo: `${settings.url}/media/logo.svg`,
    slogan: settings.tagline,
  };
  return (
    <html lang="en-IN" className={`${display.variable} ${label.variable} ${body.variable}`}>
      <body>
        <a href="#main" className="skip">
          Skip to content
        </a>
        <CartProvider>
          {settings.announcement && (
            <Link href="/gifts" className="announce">
              {settings.announcement}
            </Link>
          )}
          <Header products={products} />
          <main id="main">{children}</main>
          <Footer />
          <CartDrawer products={products} />
        </CartProvider>
        <RevealInit />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(org).replace(/</g, "\\u003c") }} />
      </body>
    </html>
  );
}

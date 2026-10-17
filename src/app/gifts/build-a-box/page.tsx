import type { Metadata } from "next";
import { GiftBuilder } from "@/components/GiftBuilder";
import { lite } from "@/content/products";
import { getProducts } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Build a gift box",
  description: "Choose two to four La Reiné gels and mists, write a handwritten note, and we'll wrap it by hand.",
};

export default async function BuildABox() {
  const products = (await getProducts()).map(lite);
  return (
    <div className="wrap" style={{ paddingBottom: "var(--section)" }}>
      <header className="page-head">
        <p className="eyebrow muted">Gifts</p>
        <h1>Build a gift box.</h1>
      </header>
      <GiftBuilder products={products} />
    </div>
  );
}

import type { Metadata } from "next";
import { Chooser } from "@/components/Chooser";
import { lite } from "@/content/products";
import { getProducts, getSets } from "@/lib/commerce";

export const metadata: Metadata = {
  title: "Which one is for you?",
  description: "Breakouts on your back, chest or arms, or skin that feels tight after every shower? Find your La Reiné scent in one question.",
};

export default async function WhichOne() {
  const products = await getProducts();
  const sets = await getSets();
  return <Chooser products={products.map(lite)} sets={sets.map((s) => ({ id: s.id, scent: s.scent ?? null, products: s.products.map(lite), price: s.price, name: s.name }))} />;
}

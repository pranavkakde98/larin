import type { Metadata } from "next";
import { OrderConfirmation } from "@/components/OrderConfirmation";

export const metadata: Metadata = { title: "Thank you", robots: { index: false } };

export default async function Order({ params }: PageProps<"/order/[id]">) {
  const { id } = await params;
  return <OrderConfirmation id={id} />;
}

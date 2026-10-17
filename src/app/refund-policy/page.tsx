import type { Metadata } from "next";
import { Policy } from "@/components/Policy";

export const metadata: Metadata = { title: "Returns and refunds" };

export default function Page() {
  return <Policy k="return-refund-policy" title="Returns and refunds" />;
}

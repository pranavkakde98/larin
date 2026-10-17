import type { Metadata } from "next";
import { Policy } from "@/components/Policy";

export const metadata: Metadata = { title: "Terms and conditions" };

export default function Page() {
  return <Policy k="terms-and-conditions" title="Terms and conditions" />;
}

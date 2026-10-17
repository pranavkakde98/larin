import type { Metadata } from "next";
import { Policy } from "@/components/Policy";

export const metadata: Metadata = { title: "Privacy policy" };

export default function Page() {
  return <Policy k="privacy-policy" title="Privacy policy" />;
}

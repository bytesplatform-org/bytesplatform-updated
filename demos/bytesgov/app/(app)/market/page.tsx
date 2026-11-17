import type { Metadata } from "next";
import { MarketView } from "@/components/MarketView";

export const metadata: Metadata = { title: "Market intel" };

export default function Page() {
  return <MarketView />;
}

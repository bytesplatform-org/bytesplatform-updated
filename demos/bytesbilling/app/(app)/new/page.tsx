import type { Metadata } from "next";
import View from "@/components/views/NewInvoice";

export const metadata: Metadata = { title: "New invoice" };

export default function Page() {
  return <View />;
}

import type { Metadata } from "next";
import View from "@/components/views/InvoiceDetail";

export const metadata: Metadata = { title: "Invoice" };

export default function Page() {
  return <View />;
}

import type { Metadata } from "next";
import View from "@/components/views/Invoices";

export const metadata: Metadata = { title: "Invoices" };

export default function Page() {
  return <View />;
}

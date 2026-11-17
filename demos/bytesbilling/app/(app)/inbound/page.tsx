import type { Metadata } from "next";
import View from "@/components/views/Inbound";

export const metadata: Metadata = { title: "Inbound" };

export default function Page() {
  return <View />;
}

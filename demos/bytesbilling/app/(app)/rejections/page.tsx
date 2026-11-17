import type { Metadata } from "next";
import View from "@/components/views/Rejections";

export const metadata: Metadata = { title: "Rejections" };

export default function Page() {
  return <View />;
}

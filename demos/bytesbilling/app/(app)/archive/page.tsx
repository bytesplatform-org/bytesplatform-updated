import type { Metadata } from "next";
import View from "@/components/views/Archive";

export const metadata: Metadata = { title: "Archive" };

export default function Page() {
  return <View />;
}

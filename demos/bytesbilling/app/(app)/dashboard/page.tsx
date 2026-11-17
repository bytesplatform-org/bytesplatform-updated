import type { Metadata } from "next";
import View from "@/components/views/Dashboard";

export const metadata: Metadata = { title: "Dashboard" };

export default function Page() {
  return <View />;
}

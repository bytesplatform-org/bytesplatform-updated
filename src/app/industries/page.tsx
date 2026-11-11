import type { Metadata } from "next";
import IndustriesPage from "@/components/industries/IndustriesPage";

export const metadata: Metadata = {
  title: { absolute: "Industry-Specific Software Development | BytesPlatform" },
  description:
    "Industry-specific software development for federal contractors, retail, banking and health: custom software development by industry. Explore your sector.",
  alternates: { canonical: "/industries" },
  openGraph: {
    title: "Industry-Specific Software Development | BytesPlatform",
    description:
      "Industry-specific software development for federal contractors, retail, banking and health: custom software development by industry. Explore your sector.",
    url: "/industries",
  },
};

export default function Page() {
  return <IndustriesPage />;
}

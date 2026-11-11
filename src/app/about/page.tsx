import type { Metadata } from "next";
import AboutPage from "@/components/about/AboutPage";

export const metadata: Metadata = {
  title: { absolute: "About BytesPlatform | Texas Digital Transformation Company" },
  description:
    "Meet BytesPlatform, a Texas-based digital transformation company building web, app, AI and CRM platforms for clients across the US. Get to know us.",
  alternates: { canonical: "/about" },
  openGraph: {
    title: "About BytesPlatform | Texas Digital Transformation Company",
    description:
      "Meet BytesPlatform, a Texas-based digital transformation company building web, app, AI and CRM platforms for clients across the US. Get to know us.",
    url: "/about",
  },
};

export default function Page() {
  return <AboutPage />;
}

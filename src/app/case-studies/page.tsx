import type { Metadata } from "next";
import CaseStudiesPage from "@/components/casestudies/CaseStudiesPage";

const title = "Case Studies & Live Demos: BytesGov, BytesBilling | BytesPlatform";
const description =
  "How we built BytesGov for federal contractors and BytesBilling for UAE e-invoicing. Read the case studies, then try each platform in a live demo.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/case-studies" },
  openGraph: { title, description, url: "/case-studies" },
};

export default function Page() {
  return <CaseStudiesPage />;
}

import type { Metadata } from "next";
import GovContractorsPage from "@/components/govcon/GovContractorsPage";

const title = "Government Websites, Portals & ERPs | Section 508 Ready | BytesPlatform";
const description =
  "Accessible, secure websites, portals, CRMs and ERPs for government agencies and contractors, delivered with Section 508 and security evidence.";

// Rebuilt daily so the server-rendered countdown (shown without JavaScript) stays current.
export const revalidate = 86400;

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/government-contractors" },
  openGraph: { title, description, url: "/government-contractors" },
};

export default function Page() {
  return <GovContractorsPage />;
}

import type { Metadata } from "next";
import EInvoicingPage from "@/components/einvoicing/EInvoicingPage";

export const metadata: Metadata = {
  title: { absolute: "UAE E-Invoicing: 2027 Deadlines, Rules & ERP Readiness" },
  description:
    "UAE e-invoicing starts 1 Jan 2027 for AED 50M+ firms. Check UAE e-invoicing requirements, PINT AE and ASP deadlines, then get ERP-ready: book a free audit.",
  alternates: { canonical: "/e-invoicing" },
  openGraph: {
    title: "UAE E-Invoicing: 2027 Deadlines, Rules & ERP Readiness",
    description:
      "UAE e-invoicing starts 1 Jan 2027 for AED 50M+ firms. Check UAE e-invoicing requirements, PINT AE and ASP deadlines, then get ERP-ready: book a free audit.",
    url: "/e-invoicing",
  },
};

export default function Page() {
  return <EInvoicingPage />;
}

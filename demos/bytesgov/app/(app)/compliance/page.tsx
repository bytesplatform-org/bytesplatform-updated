import type { Metadata } from "next";
import { Suspense } from "react";
import { ComplianceView } from "@/components/ComplianceView";

export const metadata: Metadata = { title: "Compliance" };

export default function Page() {
  return (
    <Suspense>
      <ComplianceView />
    </Suspense>
  );
}

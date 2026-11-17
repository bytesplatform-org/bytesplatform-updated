import type { Metadata } from "next";
import { Suspense } from "react";
import { ProposalStudio } from "@/components/ProposalStudio";

export const metadata: Metadata = { title: "Proposal Studio" };

export default function Page() {
  return (
    <Suspense>
      <ProposalStudio />
    </Suspense>
  );
}

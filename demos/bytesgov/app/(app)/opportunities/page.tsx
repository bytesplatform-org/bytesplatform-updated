import type { Metadata } from "next";
import { Suspense } from "react";
import { OpportunitiesView } from "@/components/OpportunitiesView";

export const metadata: Metadata = { title: "Opportunities" };

export default function Page() {
  return (
    <Suspense>
      <OpportunitiesView />
    </Suspense>
  );
}

import type { Metadata } from "next";
import { ContractsView } from "@/components/ContractsView";

export const metadata: Metadata = { title: "Contracts" };

export default function Page() {
  return <ContractsView />;
}

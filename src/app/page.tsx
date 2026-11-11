import type { Metadata } from "next";
import IntroExperience from "@/components/IntroExperience";

const title = "AI Development Company | Custom AI & Agents | BytesPlatform";
const description =
  "BytesPlatform is a Texas-based AI development company building custom AI agents, generative AI and ML solutions for US clients. Book a strategy call.";

export const metadata: Metadata = {
  title: { absolute: title },
  description,
  alternates: { canonical: "/" },
  openGraph: { type: "website", locale: "en_US", siteName: "BytesPlatform", title, description, url: "/" },
  twitter: { title, description },
};

export default function HomePage() {
  return <IntroExperience />;
}

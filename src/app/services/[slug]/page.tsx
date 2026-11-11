import type { Metadata } from "next";
import { notFound } from "next/navigation";
import ServicePage from "@/components/services/ServicePage";
import { serviceContent } from "@/data/serviceContent";
import { serviceLinks, type ServiceSlug } from "@/data/services";

type Props = { params: Promise<{ slug: string }> };

export const dynamicParams = false;

export function generateStaticParams() {
  return serviceLinks.map(({ slug }) => ({ slug }));
}

const find = (slug: string) => serviceContent[slug as ServiceSlug];

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const content = find((await params).slug);
  if (!content) return {};
  const url = `/services/${content.slug}`;
  return {
    title: { absolute: content.meta.title },
    description: content.meta.description,
    alternates: { canonical: url },
    openGraph: { title: content.meta.title, description: content.meta.description, url },
  };
}

export default async function Page({ params }: Props) {
  const content = find((await params).slug);
  if (!content) notFound();
  return <ServicePage content={content} indexed />;
}

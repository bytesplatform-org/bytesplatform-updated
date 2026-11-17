import type { Metadata } from "next";
import { notFound } from "next/navigation";
import GovServicePage from "@/components/govcon/GovServicePage";
import { findGovernmentService, governmentServices, govServicePath } from "@/data/governmentServices";
import { site } from "@/data/site";

type Props = { params: Promise<{ slug: string }> };

// Only the six services exist; any other slug is the normal 404.
export const dynamicParams = false;

export function generateStaticParams() {
  return governmentServices.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const service = findGovernmentService((await params).slug);
  if (!service) return {};
  const title = `${service.title} | Bytes Platform`;
  const url = govServicePath(service.slug);
  return {
    title: { absolute: title },
    description: service.summary,
    alternates: { canonical: url },
    openGraph: { title, description: service.summary, url },
  };
}

export default async function Page({ params }: Props) {
  const service = findGovernmentService((await params).slug);
  if (!service) notFound();
  const related = service.related.map(findGovernmentService).filter((item) => item !== undefined);
  const url = `${site.url}${govServicePath(service.slug)}`;

  const jsonLd = [
    {
      "@context": "https://schema.org",
      "@type": "Service",
      name: service.title,
      description: service.summary,
      serviceType: service.title,
      url,
      areaServed: { "@type": "Country", name: "United States" },
      audience: { "@type": "Audience", audienceType: "Government agencies and government contractors" },
      provider: { "@type": "Organization", name: site.name, legalName: site.legalName, url: site.url },
    },
    {
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Government", item: `${site.url}/government-contractors` },
        { "@type": "ListItem", position: 2, name: "Services", item: `${site.url}/government-contractors#services` },
        { "@type": "ListItem", position: 3, name: service.title, item: url },
      ],
    },
  ];

  return (
    <>
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <GovServicePage service={service} related={related} />
    </>
  );
}

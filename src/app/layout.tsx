import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { site } from "@/data/site";
import ScrollIndicator from "@/components/ui/ScrollIndicator";
import RouteTransition from "@/components/ui/RouteTransition";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});


export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  // Google Search Console ownership check.
  verification: { google: "rl2IGjb2-1Ljfgxs0D_OWf_nP52hLtDoMw5oHBfBUHw" },
  title: {
    default: "BytesPlatform. We Build Intelligent Digital Experiences",
    template: "%s · BytesPlatform",
  },
  description:
    "BytesPlatform is a Texas-based digital studio building websites, mobile apps, AI automation, and CRM platforms, with SEO and digital marketing to help businesses grow.",
  keywords: [
    "AI development studio",
    "AI agents",
    "AI automation",
    "web application development",
    "mobile app development",
    "CRM development",
    "SaaS product development",
    "custom software development",
    "digital transformation",
    "Bytes Platform",
    "BytesPlatform",
  ],
  authors: [{ name: "BytesPlatform" }],
  creator: "BytesPlatform",
  publisher: "BytesPlatform",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: site.url,
    siteName: "BytesPlatform",
    title: "BytesPlatform. We Build Intelligent Digital Experiences",
    description:
      "AI-powered products, scalable applications and intelligent systems, designed and engineered in-house.",
  },
  twitter: {
    card: "summary_large_image",
    title: "BytesPlatform. We Build Intelligent Digital Experiences",
    description:
      "AI-powered products, scalable applications and intelligent systems, designed and engineered in-house.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
};

export const viewport: Viewport = {
  themeColor: "#f5f2ea",
  colorScheme: "light",
  width: "device-width",
  initialScale: 1,
};

const ORG_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  name: site.name,
  legalName: site.legalName,
  alternateName: "Bytes Platform",
  url: site.url,
  description:
    "Technology studio building AI-powered products, web and mobile applications, CRM platforms and intelligent automation.",
  email: site.email,
  telephone: site.phoneHref.slice(4),
  sameAs: Object.values(site.social),
  address: {
    "@type": "PostalAddress",
    streetAddress: site.address.street,
    addressLocality: site.address.city,
    addressRegion: "TX",
    addressCountry: "US",
  },
  areaServed: "Worldwide",
  knowsAbout: [
    "Artificial Intelligence",
    "AI Agents",
    "Automation",
    "Web Application Development",
    "Mobile Application Development",
    "CRM Platforms",
    "SaaS",
    "Custom Software Development",
    "Digital Transformation",
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={inter.variable}
      // The hold script below marks <html> before React hydrates.
      suppressHydrationWarning
    >
      <head>
        {/* Runs as the HTML parses, before first paint and long before the JS
            bundle: holds every CSS intro (and their failsafes) under the
            loader from the very first frame. RouteTransition releases it; if
            the loader never comes alive, let go with its own 8s failsafe. */}
        <script
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{
            __html: `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches){var d=document.documentElement;d.setAttribute('data-site-loading','');d.setAttribute('data-site-transition','');setTimeout(function(){if(!document.querySelector('[data-live]')){d.removeAttribute('data-site-loading');d.removeAttribute('data-site-transition')}},8000)}}catch(e){}`,
          }}
        />
      </head>
      <body className="relative antialiased">
        <Script id="restart-on-refresh" strategy="beforeInteractive">
          {`if (performance.getEntriesByType('navigation')[0]?.type === 'reload') {
            history.scrollRestoration = 'manual';
            if (location.hash) history.replaceState(history.state, '', location.pathname + location.search);
            window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
          }`}
        </Script>
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(ORG_JSONLD) }}
        />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[120] focus:rounded-full focus:bg-ink focus:px-5 focus:py-2.5 focus:text-paper"
        >
          Skip to content
        </a>
        {/* First in the body: the HTML streams, so the loader must arrive
            (and paint) before any of the page beneath it. */}
        <RouteTransition />
        <main id="main">{children}</main>
        <ScrollIndicator />
      </body>
    </html>
  );
}

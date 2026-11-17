import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  style: ["normal", "italic"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: { default: "BytesGov · Demo workspace", template: "%s · BytesGov demo" },
  description:
    "A click-through demo of BytesGov: calibrated win probability, compliance matrices and proposal drafts for federal contractors. Sample data only.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#f0f1fa",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh">{children}</body>
    </html>
  );
}

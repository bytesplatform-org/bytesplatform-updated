import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { StoreProvider } from "@/lib/store";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });

export const metadata: Metadata = {
  title: { default: "BytesBilling demo", template: "%s · BytesBilling demo" },
  description:
    "Click-through demo of BytesBilling: PINT AE validation, Peppol and FTA tracking, rejections, inbound matching and a write-once archive. Sample data only.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = { themeColor: "#f0f1fa" };

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={inter.variable}>
      <body className="min-h-dvh antialiased">
        <StoreProvider>{children}</StoreProvider>
      </body>
    </html>
  );
}

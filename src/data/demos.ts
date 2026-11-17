/**
 * Where the product demos live. The demo apps are in `demos/` and run beside
 * the site with `npm run dev:all`, which points these at localhost. In
 * production, set the env vars to wherever each demo is deployed; without one,
 * BytesGov falls back to its live demo and BytesBilling to a demo request.
 */
export const demoUrls = {
  bytesgov: process.env.NEXT_PUBLIC_BYTESGOV_DEMO_URL || "https://demo.bytesgov.com/login",
  bytesbilling: process.env.NEXT_PUBLIC_BYTESBILLING_DEMO_URL || null,
} as const;

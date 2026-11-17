import path from "node:path";
import type { NextConfig } from "next";

// A standalone demo app. It shares the repo's node_modules, so Turbopack's
// root is the repository, two levels up.
const nextConfig: NextConfig = {
  reactStrictMode: true,
  turbopack: { root: path.join(__dirname, "../..") },
};

export default nextConfig;

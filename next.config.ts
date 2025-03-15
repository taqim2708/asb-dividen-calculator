import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  output: 'export',
  distDir: 'out',
  images: { unoptimized: true },
  basePath: "/asb-dividen-calculator",
  assetPrefix: "/asb-dividen-calculator",
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Vercel has its own adapter: with output:"standalone" its Turbopack build
  // skips next-server.js.nft.json and fails with ENOENT. Local/sandbox
  // deployment (.zscripts/build.sh) still requires the standalone output.
  ...(process.env.VERCEL ? {} : { output: "standalone" as const }),
  /* config options here */
  typescript: {
    ignoreBuildErrors: true,
  },
  reactStrictMode: false,
};

export default nextConfig;

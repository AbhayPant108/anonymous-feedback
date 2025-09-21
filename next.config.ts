import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  typescript: {
    // ✅ Ignore TypeScript build errors
    // (not recommended for production unless you know what you're doing)
    ignoreBuildErrors: true,
  },
  eslint: {
    // ✅ Ignore ESLint errors during builds
    ignoreDuringBuilds: true,
  },

};

export default nextConfig;

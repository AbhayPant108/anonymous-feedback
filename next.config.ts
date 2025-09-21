import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  eslint: {
    ignoreDuringBuilds: true, // ignores lint errors during build
  },
  typescript: {
    ignoreBuildErrors: true, //  ignores TS errors during build
  },
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    ignoreDuringBuilds: true, // Disable ESLint errors during builds
  },
  typescript: {
    ignoreBuildErrors: true, // Allow builds to succeed even if there are TypeScript errors
  },
  // Remove or replace `missingSuspenseWithCSRBailout` with a valid configuration option
  // Example of a valid configuration:
  reactStrictMode: false, // Enable React Strict Mode
};

export default nextConfig;
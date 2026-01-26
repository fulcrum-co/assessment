import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Exclude @react-pdf/renderer from serverless bundling
  // It uses native modules that need special handling
  serverExternalPackages: ['@react-pdf/renderer'],
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Turbopack configuration to silence workspace root warning
  turbopack: {
    // Set the root directory of the project
    root: __dirname,
  },
  // Add any other config options here
};

export default nextConfig;

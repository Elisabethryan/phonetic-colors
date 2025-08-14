import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  eslint: {
    // 🚫 Don't run ESLint during production builds TODO Ta bort
    ignoreDuringBuilds: true,
  },
};

export default nextConfig;

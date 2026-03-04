import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  transpilePackages: [
    "@heroui/react",
    "@heroui/system",
    "@heroui/dom-animation",
  ],
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "**",
      },
    ],
  },
  reactStrictMode: true,
};

export default nextConfig;

import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'api.uniapi.top',
        port: '',
      },
    ],
  },
};

export default nextConfig;

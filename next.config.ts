import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  /* config options here */
  images: {
    formats: ['image/avif', 'image/webp'],
    remotePatterns: [],
  },
  // Vercel 배포 최적화
  output: 'standalone',
};

export default nextConfig;

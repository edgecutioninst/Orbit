import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.githubusercontent.com', // Catches any GitHub avatar server
        port: '',
        pathname: '/**',
      },
      {
        protocol: 'https',
        hostname: '*.googleusercontent.com', // Catches lh3, lh4, lh5, etc.
        port: '',
        pathname: '/**',
      }
    ]
  },
  reactCompiler: true,
};

export default nextConfig;
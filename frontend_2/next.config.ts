import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "images.unsplash.com",
      },
         {
        protocol: "https",
        hostname: "plus.unsplash.com",
      },
      // It's highly recommended to also whitelist your backend domain
      // in case your API starts returning your own hosted images later
      {
        protocol: "https",
        hostname: "**.fastapicloud.dev",
      },
      {
        protocol: "https",
        hostname: "**.netlify.app",
      }
    ],
  },
};

export default nextConfig;
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
        hostname: "**.supabase.co",
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

 async rewrites() {
    return [
      // Proxy Auth routes
      {
        source: "/api/auth/:path*",
        destination: "https://kcmart.fastapicloud.dev/auth/:path*",
      },

      //    {
      //   source: "/api/auth/:path*",
      //   destination: "http://127.0.0.1:8000/auth/:path*",
      // },
      // Proxy User routes (for /me)
      {
        source: "/api/users/:path*",
        destination: "https://kcmart.fastapicloud.dev/users/:path*",
      },
      // Proxy GraphQL
      {
        source: "/api/graphql",
        destination: "https://kcmart.fastapicloud.dev/graphql",
      },

      //    {
      //   source: "/api/graphql",
      //   destination: "http://127.0.0.1:8000/graphql",
      // },
    ];
  },

};

export default nextConfig;




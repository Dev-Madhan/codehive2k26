import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      { protocol: "https", hostname: "lh3.googleusercontent.com" },
      { protocol: "https", hostname: "avatars.githubusercontent.com" },
      { protocol: "https", hostname: "**.tigrisfiles.io" },
      { protocol: "https", hostname: "t3.storage.dev" },
      { protocol: "https", hostname: "fly.storage.tigris.dev" },
    ],
  },
  async redirects() {
    return [
      {
        source: "/auth/signin",
        destination: "/auth",
        permanent: true,
      },
      {
        source: "/auth/sign-in",
        destination: "/auth",
        permanent: true,
      },
    ];
  },
};

export default nextConfig;

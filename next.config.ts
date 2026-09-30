import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  skipTrailingSlashRedirect: true,
  async headers() {
    return [
      {
        source: "/:path*.glb",
        headers: [
          {
            key: "Content-Type",
            value: "model/gltf-binary",
          },
          {
            key: "Access-Control-Allow-Origin",
            value: "*",
          },
        ],
      },
      {
        source: "/:path*.webm",
        headers: [
          {
            key: "Content-Type",
            value: "video/webm",
          },
        ],
      },
      {
        source: "/:path*.json",
        headers: [
          {
            key: "Content-Type",
            value: "application/json",
          },
        ],
      },
      {
        source: "/:path*.ttf",
        headers: [
          {
            key: "Content-Type",
            value: "font/ttf",
          },
        ],
      },
    ];
  },
};

export default nextConfig;

import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
      ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "")
      : (process.env.VERCEL_PROJECT_PRODUCTION_URL
          ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
          : "https://codehive2k26.vercel.app");

  return {
    rules: [
      {
        userAgent: "*",
        allow: ["/", "/events", "/events/*", "/auth", "/auth/*"],
        disallow: [
          "/admin",
          "/admin/*",
          "/api",
          "/api/*",
          "/dashboard",
          "/dashboard/*",
        ],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}

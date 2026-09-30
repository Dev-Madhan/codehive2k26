import fs from "fs";
import path from "path";
import { NextRequest } from "next/server";

export async function GET(
  request: NextRequest,
  context: { params: Promise<{ slug: string[] }> }
) {
  const { slug } = await context.params;
  const decodedPath = slug.map((s) => decodeURIComponent(s).trim()).join("/");

  const searchPaths = [
    path.join(process.cwd(), "public", "models", decodedPath),
    path.join(process.cwd(), "public", "github_web", "models", decodedPath),
  ];

  for (const p of searchPaths) {
    if (fs.existsSync(p) && fs.statSync(p).isFile()) {
      const buffer = fs.readFileSync(p);
      return new Response(buffer, {
        headers: {
          "Content-Type": "model/gltf-binary",
          "Access-Control-Allow-Origin": "*",
          "Cache-Control": "public, max-age=31536000, immutable",
        },
      });
    }
  }

  return new Response("Not Found", { status: 404 });
}

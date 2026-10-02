import { NextRequest, NextResponse } from "next/server";
import { uploadToTigris, TIGRIS_FOLDERS } from "@/lib/tigris";
import crypto from "crypto";

// Max file size: 10 MB (allows single PDF with multiple team member IDs)
const MAX_SIZE = 10 * 1024 * 1024;
const ALLOWED_TYPES: Record<string, string> = {
  "application/pdf": "pdf",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
  "image/png": "png",
  "image/webp": "webp",
};

/**
 * POST /api/upload/college-id
 * Accepts a raw binary body (application/pdf, image/*).
 * Uploads directly to Tigris AWS S3 Bucket.
 * Returns { url, key } on success.
 */
export async function POST(req: NextRequest) {
  try {
    const rawContentType = req.headers.get("content-type") ?? "";
    const contentType = rawContentType.split(";")[0].trim().toLowerCase();
    const contentLength = Number(req.headers.get("content-length") ?? 0);

    // Validate MIME type
    const ext = ALLOWED_TYPES[contentType];
    if (!ext) {
      return NextResponse.json(
        { error: "Only PDF documents (and JPG/PNG images) are accepted." },
        { status: 415 }
      );
    }

    // Validate size (guard before streaming entire body)
    if (contentLength > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds the 10 MB size limit." },
        { status: 413 }
      );
    }

    const arrayBuffer = await req.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    // Double-check size after reading
    if (buffer.byteLength > MAX_SIZE) {
      return NextResponse.json(
        { error: "File exceeds the 5 MB size limit." },
        { status: 413 }
      );
    }

    // Generate unique key for Tigris S3 storage
    const filename = `${Date.now()}-${crypto.randomUUID()}.${ext}`;
    const key = `${TIGRIS_FOLDERS.COLLEGE_IDS}/${filename}`;

    const result = await uploadToTigris({
      buffer,
      key,
      contentType,
    });

    if (!result.success || !result.url) {
      return NextResponse.json(
        { error: result.error ?? "Upload failed. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({ url: result.url, key: result.key }, { status: 200 });
  } catch (error) {
    console.error("[college-id upload]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during upload." },
      { status: 500 }
    );
  }
}


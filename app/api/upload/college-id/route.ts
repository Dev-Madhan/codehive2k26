import { NextRequest, NextResponse } from "next/server";
import { uploadToTigris, TIGRIS_FOLDERS } from "@/lib/tigris";
import crypto from "crypto";
import { checkRateLimit, getClientIp, RATE_LIMIT_TIERS } from "@/lib/rate-limiter";

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
 * Verify binary magic bytes to prevent spoofed MIME types and polyglot payloads
 */
function isValidMagicBytes(buffer: Buffer, contentType: string): boolean {
  if (buffer.length < 12) return false;

  // PDF: %PDF- (0x25 0x50 0x44 0x46 0x2D)
  if (contentType === "application/pdf") {
    return (
      buffer[0] === 0x25 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x44 &&
      buffer[3] === 0x46 &&
      buffer[4] === 0x2d
    );
  }

  // JPEG / JPG: 0xFF 0xD8 0xFF
  if (contentType === "image/jpeg" || contentType === "image/jpg") {
    return buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  }

  // PNG: 0x89 0x50 0x4E 0x47 0x0D 0x0A 0x1A 0x0A
  if (contentType === "image/png") {
    return (
      buffer[0] === 0x89 &&
      buffer[1] === 0x50 &&
      buffer[2] === 0x4e &&
      buffer[3] === 0x47 &&
      buffer[4] === 0x0d &&
      buffer[5] === 0x0a &&
      buffer[6] === 0x1a &&
      buffer[7] === 0x0a
    );
  }

  // WEBP: RIFF....WEBP
  if (contentType === "image/webp") {
    return (
      buffer[0] === 0x52 &&
      buffer[1] === 0x49 &&
      buffer[2] === 0x46 &&
      buffer[3] === 0x46 &&
      buffer[8] === 0x57 &&
      buffer[9] === 0x45 &&
      buffer[10] === 0x42 &&
      buffer[11] === 0x50
    );
  }

  return false;
}

/**
 * POST /api/upload/college-id
 * Accepts a raw binary body (application/pdf, image/*).
 * Protected by:
 * 1. Per-IP Burst Rate Limiting
 * 2. Binary Magic Bytes Verification
 * 3. Pre-stream Content-Length bounding
 */
export async function POST(req: NextRequest) {
  try {
    // 1. IP-based Rate Limiting Defense
    const ip = getClientIp(req.headers);
    const rateLimit = await checkRateLimit(`upload:${ip}`, RATE_LIMIT_TIERS.UPLOAD);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          error: "Upload limit exceeded. Please wait a few minutes before uploading again.",
          retryAfter: rateLimit.resetSeconds,
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetSeconds.toString(),
          },
        }
      );
    }

    const rawContentType = req.headers.get("content-type") ?? "";
    const contentType = rawContentType.split(";")[0].trim().toLowerCase();
    const contentLength = Number(req.headers.get("content-length") ?? 0);

    // Validate claimed MIME type
    const ext = ALLOWED_TYPES[contentType];
    if (!ext) {
      return NextResponse.json(
        { error: "Only PDF documents (and JPG/PNG/WEBP images) are accepted." },
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
        { error: "File exceeds the 10 MB size limit." },
        { status: 413 }
      );
    }

    // 2. Binary Magic Bytes Inspection (Anti-Polyglot / Spoofing)
    if (!isValidMagicBytes(buffer, contentType)) {
      return NextResponse.json(
        { error: "File signature mismatch. The file content does not match its claimed type." },
        { status: 400 }
      );
    }

    // 3. Generate unique key for Tigris S3 storage
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
    console.error("[college-id upload error]", error);
    return NextResponse.json(
      { error: "An unexpected error occurred during upload." },
      { status: 500 }
    );
  }
}

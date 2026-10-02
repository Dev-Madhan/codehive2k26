import {
  S3Client,
  PutObjectCommand,
  DeleteObjectCommand,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { getSignedUrl } from "@aws-sdk/s3-request-presigner";
import { env } from "@/env";

// Tigris S3 Endpoint: default is https://t3.storage.dev (or https://fly.storage.tigris.dev)
const endpoint =
  process.env.TIGRIS_ENDPOINT_URL ||
  process.env.AWS_ENDPOINT_URL_S3 ||
  env.TIGRIS_ENDPOINT_URL ||
  env.AWS_ENDPOINT_URL_S3 ||
  "https://t3.storage.dev";

const region =
  process.env.TIGRIS_REGION ||
  process.env.AWS_REGION ||
  env.TIGRIS_REGION ||
  env.AWS_REGION ||
  "auto";

export const s3Client = new S3Client({
  region,
  endpoint,
  credentials: {
    accessKeyId:
      process.env.TIGRIS_STORAGE_ACCESS_KEY_ID ||
      process.env.AWS_ACCESS_KEY_ID ||
      env.TIGRIS_STORAGE_ACCESS_KEY_ID ||
      env.AWS_ACCESS_KEY_ID ||
      "",
    secretAccessKey:
      process.env.TIGRIS_STORAGE_SECRET_ACCESS_KEY ||
      process.env.AWS_SECRET_ACCESS_KEY ||
      env.TIGRIS_STORAGE_SECRET_ACCESS_KEY ||
      env.AWS_SECRET_ACCESS_KEY ||
      "",
  },
  forcePathStyle: false,
});

export const TIGRIS_BUCKET =
  process.env.TIGRIS_BUCKET_NAME ||
  process.env.AWS_BUCKET_NAME ||
  env.TIGRIS_BUCKET_NAME ||
  env.AWS_BUCKET_NAME ||
  "codehive";

export const TIGRIS_FOLDERS = {
  PARTICIPANTS: "participants",
  COLLEGE_IDS: "college-ids",
  EVENTS: "events",
  SPONSORS: "sponsors",
  CERTIFICATES: "certificates",
  GALLERY: "gallery",
} as const;

export interface UploadOptions {
  buffer: Buffer | Uint8Array;
  key: string;
  contentType: string;
  bucket?: string;
}

export interface UploadResult {
  success: boolean;
  url?: string;
  key?: string;
  error?: string;
}

/**
 * Returns the public URL for an object stored in Tigris.
 * If TIGRIS_PUBLIC_URL is provided, uses that prefix.
 * Default Tigris format: https://<bucket>.t3.tigrisfiles.io/<key>
 */
export function getTigrisPublicUrl(key: string, bucket: string = TIGRIS_BUCKET): string {
  const publicPrefix = process.env.TIGRIS_PUBLIC_URL || env.TIGRIS_PUBLIC_URL;
  if (publicPrefix) {
    return `${publicPrefix.replace(/\/$/, "")}/${key}`;
  }
  return `https://${bucket}.t3.tigrisfiles.io/${key}`;
}

/**
 * Upload a binary buffer to Tigris S3 bucket.
 */
export async function uploadToTigris({
  buffer,
  key,
  contentType,
  bucket = TIGRIS_BUCKET,
}: UploadOptions): Promise<UploadResult> {
  try {
    const command = new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: buffer,
      ContentType: contentType,
    });

    await s3Client.send(command);

    const publicUrl = getTigrisPublicUrl(key, bucket);

    return {
      success: true,
      url: publicUrl,
      key,
    };
  } catch (error) {
    console.error("Tigris S3 upload error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to upload asset to Tigris S3",
    };
  }
}

/**
 * Generate a pre-signed URL to view or download a file from Tigris.
 */
export async function getTigrisSignedUrl(
  key: string,
  expiresInSeconds: number = 3600,
  bucket: string = TIGRIS_BUCKET
): Promise<string> {
  const command = new GetObjectCommand({
    Bucket: bucket,
    Key: key,
  });

  return getSignedUrl(s3Client, command, { expiresIn: expiresInSeconds });
}

/**
 * Delete a media asset from Tigris S3 bucket by its key.
 */
export async function deleteFromTigris(
  key: string,
  bucket: string = TIGRIS_BUCKET
): Promise<{ success: boolean; error?: string }> {
  try {
    const command = new DeleteObjectCommand({
      Bucket: bucket,
      Key: key,
    });

    await s3Client.send(command);
    return { success: true };
  } catch (error) {
    console.error("Tigris S3 delete error:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete asset from Tigris S3",
    };
  }
}

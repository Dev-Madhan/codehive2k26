import { v2 as cloudinary } from "cloudinary";
import { env } from "@/env";

cloudinary.config({
  cloud_name: env.CLOUDINARY_CLOUD_NAME,
  api_key: env.CLOUDINARY_API_KEY,
  api_secret: env.CLOUDINARY_API_SECRET,
  secure: true,
});

export const CLOUDINARY_FOLDERS = {
  PARTICIPANTS: "codehive/participants",
  EVENTS: "codehive/events",
  SPONSORS: "codehive/sponsors",
  CERTIFICATES: "codehive/certificates",
  GALLERY: "codehive/gallery",
} as const;

/**
 * Upload a file/buffer to Cloudinary under a specific folder.
 */
export async function uploadToCloudinary(
  fileBase64: string,
  folder: string = CLOUDINARY_FOLDERS.PARTICIPANTS
) {
  try {
    const result = await cloudinary.uploader.upload(fileBase64, {
      folder,
      resource_type: "auto",
      allowed_formats: ["jpg", "jpeg", "png", "webp", "pdf"],
      transformation: [
        { quality: "auto:good" },
        { fetch_format: "auto" },
      ],
    });

    return {
      success: true,
      url: result.secure_url,
      publicId: result.public_id,
    };
  } catch (error) {
    console.error("Cloudinary upload error:", error);
    return {
      success: false,
      error: "Failed to upload asset to Cloudinary",
    };
  }
}

/**
 * Delete a media asset from Cloudinary by its public ID.
 */
export async function deleteFromCloudinary(publicId: string) {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return { success: result.result === "ok" };
  } catch (error) {
    console.error("Cloudinary delete error:", error);
    return { success: false, error: "Failed to delete asset from Cloudinary" };
  }
}

export { cloudinary };

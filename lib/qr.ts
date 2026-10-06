import QRCode from "qrcode";
import crypto from "crypto";

/**
 * Generate an opaque, cryptographically secure QR token for a registration.
 * Format: CH26-<random_hex>
 */
export function generateQrToken(): string {
  return `CH26-${crypto.randomBytes(8).toString("hex").toUpperCase()}`;
}

/**
 * Generate a unique registration number.
 * Format: CH26-XXXXXX
 */
export function generateRegistrationNumber(): string {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "CH26-";
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return result;
}

/**
 * Generate QR code as a base64 Data URL for display or inclusion in emails.
 */
export async function generateQrDataUrl(token: string): Promise<string> {
  try {
    return await QRCode.toDataURL(token, {
      width: 320,
      margin: 2,
      color: {
        dark: "#000000",
        light: "#ffffff",
      },
      errorCorrectionLevel: "H",
    });
  } catch (error) {
    console.error("Failed to generate QR data URL:", error);
    throw new Error("QR generation failed");
  }
}

/**
 * Generate QR code as an SVG string.
 */
export async function generateQrSvg(token: string): Promise<string> {
  try {
    return await QRCode.toString(token, {
      type: "svg",
      margin: 2,
      errorCorrectionLevel: "H",
    });
  } catch (error) {
    console.error("Failed to generate QR SVG:", error);
    throw new Error("QR SVG generation failed");
  }
}

/**
 * Generate QR code as a PNG Buffer for embedding in emails via CID attachments.
 * Compatible with Gmail, Outlook, Apple Mail, and standard email clients.
 */
export async function generateQrBuffer(content: string): Promise<Buffer> {
  try {
    return await QRCode.toBuffer(content, {
      width: 320,
      margin: 1,
      color: {
        dark: "#000000",
        light: "#FFFFFF",
      },
      errorCorrectionLevel: "H",
    });
  } catch (error) {
    console.error("Failed to generate QR buffer:", error);
    throw new Error("QR buffer generation failed");
  }
}

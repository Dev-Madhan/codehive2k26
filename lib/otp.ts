import crypto from "crypto";
import prisma from "@/lib/prisma";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const OTP_LENGTH = 6;
const OTP_EXPIRY_MINUTES = 10;
const MAX_ATTEMPTS = 5;
const RATE_LIMIT_WINDOW_MINUTES = 15;
const RATE_LIMIT_MAX_SENDS = 3;

// ---------------------------------------------------------------------------
// OTP Generation — Cryptographically secure
// ---------------------------------------------------------------------------

export function generateOTP(): string {
  const otp = crypto.randomInt(
    Math.pow(10, OTP_LENGTH - 1),
    Math.pow(10, OTP_LENGTH)
  );
  return otp.toString();
}

// ---------------------------------------------------------------------------
// Hashing — SHA-256, never store plaintext OTP
// ---------------------------------------------------------------------------

export function hashOTP(otp: string): string {
  return crypto.createHash("sha256").update(otp).digest("hex");
}

// ---------------------------------------------------------------------------
// Timing-safe comparison to prevent timing attacks
// ---------------------------------------------------------------------------

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}

// ---------------------------------------------------------------------------
// Rate Limiting — Prevent OTP spam (in-DB approach)
// ---------------------------------------------------------------------------

export async function checkRateLimit(email: string): Promise<boolean> {
  const windowStart = new Date(
    Date.now() - RATE_LIMIT_WINDOW_MINUTES * 60 * 1000
  );

  const recentOTPs = await prisma.verification.count({
    where: {
      identifier: email,
      createdAt: { gte: windowStart },
    },
  });

  return recentOTPs < RATE_LIMIT_MAX_SENDS;
}

// ---------------------------------------------------------------------------
// Store OTP — Invalidate old ones first, then store hashed version
// ---------------------------------------------------------------------------

export async function storeOTP(email: string, otp: string): Promise<void> {
  const hashedOtp = hashOTP(otp);
  const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000);

  // Invalidate all existing OTPs for this email
  await prisma.verification.deleteMany({
    where: { identifier: email },
  });

  // Store new hashed OTP
  await prisma.verification.create({
    data: {
      identifier: email,
      value: JSON.stringify({
        hash: hashedOtp,
        attempts: 0,
      }),
      expiresAt,
    },
  });
}

// ---------------------------------------------------------------------------
// Verify OTP — Check hash, expiry, and attempt limits
// ---------------------------------------------------------------------------

export interface VerifyOTPResult {
  success: boolean;
  error?: string;
}

export async function verifyOTP(
  email: string,
  otp: string
): Promise<VerifyOTPResult> {
  const record = await prisma.verification.findFirst({
    where: { identifier: email },
    orderBy: { createdAt: "desc" },
  });

  if (!record) {
    return { success: false, error: "No OTP found. Please request a new one." };
  }

  // Check expiry
  if (new Date() > record.expiresAt) {
    await prisma.verification.delete({ where: { id: record.id } });
    return { success: false, error: "OTP has expired. Please request a new one." };
  }

  // Parse stored data
  const stored = JSON.parse(record.value) as {
    hash: string;
    attempts: number;
  };

  // Check attempt limit
  if (stored.attempts >= MAX_ATTEMPTS) {
    await prisma.verification.delete({ where: { id: record.id } });
    return {
      success: false,
      error: "Too many failed attempts. Please request a new OTP.",
    };
  }

  // Timing-safe hash comparison
  const incomingHash = hashOTP(otp);
  const isValid = timingSafeEqual(incomingHash, stored.hash);

  if (!isValid) {
    // Increment attempt counter
    await prisma.verification.update({
      where: { id: record.id },
      data: {
        value: JSON.stringify({
          ...stored,
          attempts: stored.attempts + 1,
        }),
      },
    });

    const remaining = MAX_ATTEMPTS - stored.attempts - 1;
    return {
      success: false,
      error: `Invalid OTP. ${remaining} attempt${remaining !== 1 ? "s" : ""} remaining.`,
    };
  }

  // OTP is valid — clean up
  await prisma.verification.delete({ where: { id: record.id } });

  return { success: true };
}

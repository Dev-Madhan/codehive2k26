import crypto from "crypto";

const VERIFICATION_TOKEN_EXPIRY_MINUTES = 15;

function getVerificationSecret(): string {
  const secret = process.env.BETTER_AUTH_SECRET;
  if (!secret) {
    if (process.env.NODE_ENV === "production") {
      throw new Error("[Security Alert] BETTER_AUTH_SECRET must be configured in production.");
    }
    return "dev-local-ephemeral-secret-codehive2k26";
  }
  return secret;
}

/**
 * Generate a signed verification token after successful OTP validation for an email address
 */
export function generateVerificationToken(email: string): string {
  const payload = JSON.stringify({
    email: email.toLowerCase().trim(),
    verified: true,
    expiresAt: new Date(
      Date.now() + VERIFICATION_TOKEN_EXPIRY_MINUTES * 60 * 1000
    ).toISOString(),
  });

  const secret = getVerificationSecret();
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  // Base64-encode the payload + hmac
  const token = Buffer.from(`${payload}::${hmac}`).toString("base64");
  return token;
}

/**
 * Verify a previously issued verification token with timing-safe HMAC check
 */
export function validateVerificationToken(token: string): {
  valid: boolean;
  email?: string;
} {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [payload, hmac] = decoded.split("::");

    if (!payload || !hmac) return { valid: false };

    const secret = getVerificationSecret();
    const expectedHmac = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    const hmacBuf = Buffer.from(hmac, "hex");
    const expectedBuf = Buffer.from(expectedHmac, "hex");

    if (
      hmacBuf.length !== expectedBuf.length ||
      !crypto.timingSafeEqual(hmacBuf, expectedBuf)
    ) {
      return { valid: false };
    }

    const data = JSON.parse(payload);
    if (!data.verified || new Date(data.expiresAt) < new Date()) {
      return { valid: false };
    }

    return { valid: true, email: data.email };
  } catch {
    return { valid: false };
  }
}

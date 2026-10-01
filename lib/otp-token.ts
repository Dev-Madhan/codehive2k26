import crypto from "crypto";

const VERIFICATION_TOKEN_EXPIRY_MINUTES = 15;

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

  const secret = process.env.BETTER_AUTH_SECRET || "codehive-fallback-secret";
  const hmac = crypto.createHmac("sha256", secret).update(payload).digest("hex");

  // Base64-encode the payload + hmac
  const token = Buffer.from(`${payload}::${hmac}`).toString("base64");
  return token;
}

/**
 * Verify a previously issued verification token
 */
export function validateVerificationToken(token: string): {
  valid: boolean;
  email?: string;
} {
  try {
    const decoded = Buffer.from(token, "base64").toString("utf-8");
    const [payload, hmac] = decoded.split("::");

    if (!payload || !hmac) return { valid: false };

    const secret = process.env.BETTER_AUTH_SECRET || "codehive-fallback-secret";
    const expectedHmac = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (hmac !== expectedHmac) return { valid: false };

    const data = JSON.parse(payload);
    if (!data.verified || new Date(data.expiresAt) < new Date()) {
      return { valid: false };
    }

    return { valid: true, email: data.email };
  } catch {
    return { valid: false };
  }
}

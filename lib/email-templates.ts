// ---------------------------------------------------------------------------
// Branded HTML Email Templates for CodeHive 2K26
// ---------------------------------------------------------------------------

/**
 * Generate a beautiful OTP verification email.
 */
export function otpEmailTemplate(otp: string, expiryMinutes: number = 10): string {
  // Split OTP digits for the spaced-out display
  const digits = otp.split("").map(
    (d) =>
      `<span style="display: inline-block; width: 44px; height: 52px; line-height: 52px; background: linear-gradient(135deg, #0A1930, #12345C); border: 1px solid #00D9FF33; border-radius: 8px; font-size: 24px; font-weight: 700; color: #00D9FF; text-align: center; margin: 0 4px; font-family: 'Courier New', monospace;">${d}</span>`
  );

  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
</head>
<body style="margin: 0; padding: 0; background-color: #0A0F1C; font-family: 'Segoe UI', Arial, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #0A0F1C; padding: 40px 16px;">
    <tr>
      <td align="center">
        <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width: 520px; background-color: #020817; border-radius: 16px; border: 1px solid #12345C; overflow: hidden;">

          <!-- Header -->
          <tr>
            <td style="background: linear-gradient(135deg, #00D9FF15, #2DFFB915); padding: 32px 32px 20px; text-align: center;">
              <h1 style="margin: 0; font-size: 26px; font-weight: 800; color: #00D9FF; letter-spacing: 1px;">CodeHive 2K26</h1>
              <p style="margin: 8px 0 0; font-size: 14px; color: #8FA6C2;">Email Verification</p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px;">
              <p style="color: #E2E8F0; font-size: 15px; line-height: 1.6; margin: 0 0 24px;">
                Use the following code to verify your email address. This code will expire in <strong style="color: #2DFFB9;">${expiryMinutes} minutes</strong>.
              </p>

              <!-- OTP Digits -->
              <div style="text-align: center; margin: 28px 0;">
                ${digits.join("")}
              </div>

              <!-- Warning -->
              <div style="background-color: #0A1930; border-left: 3px solid #FF6B6B; border-radius: 4px; padding: 12px 16px; margin: 24px 0;">
                <p style="margin: 0; font-size: 13px; color: #FF6B6B;">
                  ⚠️ Do not share this code with anyone. Our team will never ask for your OTP.
                </p>
              </div>

              <p style="color: #8FA6C2; font-size: 13px; line-height: 1.5; margin: 20px 0 0;">
                If you didn't request this code, you can safely ignore this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #12345C; padding: 20px 32px; text-align: center;">
              <p style="margin: 0; font-size: 12px; color: #4A5568;">
                © ${new Date().getFullYear()} CodeHive 2K26 — All rights reserved
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim();
}

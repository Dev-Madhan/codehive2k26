// ---------------------------------------------------------------------------
// Branded HTML Email Templates for CodeHive 2K26 (Monochrome / B&W Edition)
// ---------------------------------------------------------------------------

/**
 * Generate a high-contrast Black & White OTP verification email matching
 * the CodeHive 2K26 brutalist design system (Space Grotesk, Inter, JetBrains Mono).
 */
export function otpEmailTemplate(otp: string, expiryMinutes: number = 10): string {
  // Split OTP digits into sharp, high-contrast monospace character tiles
  const digits = otp.split("").map(
    (d) =>
      `<span style="display: inline-block; width: 44px; height: 52px; line-height: 52px; background-color: #000000; border: 2px solid #FFFFFF; font-size: 26px; font-weight: 800; color: #FFFFFF; text-align: center; margin: 0 4px; font-family: 'JetBrains Mono', 'Courier New', monospace; letter-spacing: 0;">${d}</span>`
  );

  return `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verification Code - CodeHive 2K26</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700;800&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #000000;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #E5E5E5;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    a[x-apple-data-detectors],
    .no-link-style a {
      color: inherit !important;
      text-decoration: none !important;
      font-size: inherit !important;
      font-family: inherit !important;
      font-weight: inherit !important;
      line-height: inherit !important;
    }
    u + #body a {
      color: inherit !important;
      text-decoration: none !important;
    }
    @media only screen and (max-width: 600px) {
      .email-wrapper {
        width: 100% !important;
        padding: 12px !important;
      }
      .digit-box {
        width: 36px !important;
        height: 46px !important;
        line-height: 46px !important;
        font-size: 22px !important;
        margin: 0 2px !important;
      }
    }
  </style>
</head>
<body id="body" style="margin: 0; padding: 0; background-color: #000000; color: #E5E5E5; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color: #000000; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Frame -->
        <table role="presentation" class="email-wrapper" width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%; background-color: #0F0F0F; border: 1px solid #262626; border-collapse: collapse;">

          <!-- Top Pure White Accent Line -->
          <tr>
            <td height="3" style="background: #FFFFFF; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 32px 24px 22px 24px; text-align: center; border-bottom: 1px solid #262626;">
              <!-- Monospaced Badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 12px auto;">
                <tr>
                  <td style="background-color: #161616; border: 1px solid #262626; padding: 5px 14px;">
                    <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1.5px;">
                      [ IDENTITY VERIFICATION // SECURE GATEWAY ]
                    </span>
                  </td>
                </tr>
              </table>

              <h1 style="margin: 0 0 6px 0; font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 26px; font-weight: 800; color: #FFFFFF; letter-spacing: 1.5px; text-transform: uppercase;">
                CODEHIVE 2K26
              </h1>
              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; color: #737373; letter-spacing: 1px; text-transform: uppercase;">
                National Level Technical Symposium &amp; Hackathon
              </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 32px 24px;">
              <p style="margin: 0 0 16px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #A3A3A3;">
                Hello,
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #E5E5E5; line-height: 1.6;">
                Use the one-time passcode below to authorize your email address for CodeHive 2K26 registration. This code will expire in <strong style="color: #FFFFFF;">${expiryMinutes} minutes</strong>.
              </p>

              <!-- OTP Passcode Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border: 2px solid #FFFFFF; text-align: center; margin: 26px 0;">
                <tr>
                  <td style="padding: 26px 16px;">
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 14px;">
                      [ ONE-TIME VERIFICATION CODE ]
                    </div>

                    <!-- OTP Digits Frame -->
                    <div style="text-align: center; margin: 6px 0;">
                      ${digits.join("")}
                    </div>

                    <p style="margin: 14px 0 0 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373; letter-spacing: 1px;">
                      DO NOT SHARE THIS PASSCODE WITH ANYONE
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border-left: 3px solid #FFFFFF; border-top: 1px solid #262626; border-right: 1px solid #262626; border-bottom: 1px solid #262626; margin: 24px 0;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #D4D4D4; line-height: 1.5;">
                      <strong style="color: #FFFFFF; font-family: 'JetBrains Mono', monospace;">// SECURITY NOTICE:</strong> The CodeHive committee will never ask for your verification code. If you did not request this code, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #737373; line-height: 1.5;">
                This is an automated system transmission. Please do not reply directly to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #262626; padding: 22px 20px; text-align: center; background-color: #080808;">
              <p style="margin: 0 0 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 1px;">
                CODEHIVE 2K26 ORGANIZING COMMITTEE &bull; SECURE GATEWAY
              </p>
              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; color: #404040;">
                Department of Computer Science &amp; Engineering &bull; All Rights Reserved
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

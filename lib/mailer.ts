import nodemailer from "nodemailer";
import { env } from "@/env";
import { generateQrBuffer } from "@/lib/qr";

// ---------------------------------------------------------------------------
// Singleton Nodemailer transporter (Gmail SMTP with App Password)
// ---------------------------------------------------------------------------

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST,
  port: Number(env.SMTP_PORT),
  secure: false, // STARTTLS on port 587
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  pool: true, // Reuse connections for better performance
  maxConnections: 5,
  maxMessages: 100,
});

// ---------------------------------------------------------------------------
// sendMail — generic wrapper with attachment & error handling
// ---------------------------------------------------------------------------

export interface MailAttachment {
  filename: string;
  content: Buffer | string;
  cid?: string;
  contentType?: string;
  encoding?: string;
}

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
  attachments?: MailAttachment[];
}

export async function sendMail({ to, subject, html, attachments }: MailOptions) {
  try {
    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
      attachments,
    });

    console.log(`✉️  Email sent to ${to} — MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("📧 Email delivery failure:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// ---------------------------------------------------------------------------
// Helper: Resolve Live Real-Time Digital Pass URL
// ---------------------------------------------------------------------------

function getLivePassUrl(registrationNumber: string): string {
  // If NEXT_PUBLIC_APP_URL is a public domain (like https://codehive2k26.vercel.app), use it.
  // If running on localhost, fallback to the canonical production deployment so smartphone camera scans work in real-time.
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (configuredUrl && !configuredUrl.includes("localhost") && !configuredUrl.includes("127.0.0.1")) {
    return `${configuredUrl.replace(/\/+$/, "")}/registration/${registrationNumber}`;
  }

  if (process.env.VERCEL_PROJECT_PRODUCTION_URL) {
    return `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}/registration/${registrationNumber}`;
  }

  return `https://codehive2k26.vercel.app/registration/${registrationNumber}`;
}

// ---------------------------------------------------------------------------
// Registration Confirmation Email Template (Inter Font, Real-Time Pass, CID QR)
// ---------------------------------------------------------------------------

export interface SendRegistrationEmailParams {
  to: string;
  participantName: string;
  eventName: string;
  registrationNumber: string;
  venue: string;
  date: string;
  qrCodeUrl?: string;
  qrBuffer?: Buffer;
  passUrl?: string;
  teamName?: string | null;
  college?: string;
  department?: string;
  members?: Array<{
    name: string;
    phone: string;
    transportOptIn?: boolean;
    pickupRoute?: string | null;
    pickupStop?: string | null;
    pickupLandmark?: string | null;
  }>;
  transportOptIn?: boolean;
  samePickupForTeam?: boolean;
  pickupRoute?: string | null;
  pickupStop?: string | null;
  pickupLandmark?: string | null;
  passengersCount?: number;
}

export async function sendRegistrationConfirmationEmail(
  params: SendRegistrationEmailParams
) {
  const isTeam = Boolean(params.teamName || (params.members && params.members.length > 0));
  const livePassUrl = params.passUrl || getLivePassUrl(params.registrationNumber);

  // Generate QR buffer if not explicitly passed
  let qrBuffer = params.qrBuffer;
  if (!qrBuffer) {
    try {
      // The QR code encodes the live digital pass verification URL.
      // When scanned with any smartphone camera, it opens the attendee's live verified pass in real time.
      qrBuffer = await generateQrBuffer(livePassUrl);
    } catch (err) {
      console.error("QR Code Buffer generation fallback error:", err);
    }
  }

  const attachments: MailAttachment[] = [];
  let qrImageMarkup = "";

  if (qrBuffer) {
    const qrCid = `pass-qr-${params.registrationNumber}@codehive`;
    attachments.push({
      filename: `codehive-pass-${params.registrationNumber}.png`,
      content: qrBuffer,
      cid: qrCid,
      contentType: "image/png",
    });

    qrImageMarkup = `
      <img
        src="cid:${qrCid}"
        alt="Pass QR Code ${params.registrationNumber}"
        width="170"
        height="170"
        style="display: block; width: 170px; height: 170px; margin: 0 auto; border: 0; outline: none; text-decoration: none;"
      />
    `;
  } else if (params.qrCodeUrl && !params.qrCodeUrl.startsWith("data:")) {
    // Hosted external HTTPS URL
    qrImageMarkup = `
      <img
        src="${params.qrCodeUrl}"
        alt="Pass QR Code ${params.registrationNumber}"
        width="170"
        height="170"
        style="display: block; width: 170px; height: 170px; margin: 0 auto; border: 0;"
      />
    `;
  }

  const htmlContent = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Official Event Pass - ${params.eventName} | CodeHive 2K26</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700;800&display=swap" rel="stylesheet">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #030712;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #e2e8f0;
    }
    table {
      border-collapse: collapse;
      mso-table-lspace: 0pt;
      mso-table-rspace: 0pt;
    }
    img {
      border: 0;
      height: auto;
      line-height: 100%;
      outline: none;
      text-decoration: none;
    }
    a {
      color: #38bdf8;
      text-decoration: none;
    }
    @media only screen and (max-width: 620px) {
      .email-wrapper {
        width: 100% !important;
        padding: 12px !important;
      }
      .content-container {
        padding: 20px 16px !important;
      }
      .pass-code-text {
        font-size: 26px !important;
        letter-spacing: 4px !important;
      }
    }
  </style>
</head>
<body style="margin: 0; padding: 0; background-color: #030712; color: #e2e8f0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #030712; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" class="email-wrapper" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%; background-color: #080f1e; border: 1px solid #1e293b; border-collapse: collapse; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          
          <!-- Top Accent Bar -->
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #2563eb, #38bdf8, #2563eb); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td align="center" style="padding: 32px 24px 20px 24px; border-bottom: 1px solid #1e293b; text-align: center;">
              <!-- Verification Pill Badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 14px auto;">
                <tr>
                  <td style="background-color: rgba(56, 189, 248, 0.1); border: 1px solid rgba(56, 189, 248, 0.35); padding: 5px 14px; border-radius: 9999px;">
                    <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px; display: inline-flex; align-items: center;">
                      <span style="color: #10b981; margin-right: 6px;">&#9679;</span> OFFICIAL ENTRY PASS // VERIFIED
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Main Brand Title -->
              <h1 style="margin: 0 0 6px 0; font-family: 'Inter', sans-serif; font-size: 26px; font-weight: 800; color: #ffffff; letter-spacing: 1.5px; text-transform: uppercase;">
                CODEHIVE 2K26
              </h1>
              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; color: #94a3b8; letter-spacing: 1px; text-transform: uppercase;">
                National Level Technical Symposium &amp; Hackathon
              </p>
            </td>
          </tr>

          <!-- Body Container -->
          <tr>
            <td class="content-container" style="padding: 28px 24px;">

              <!-- Event Details Spotlight Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #040914; border: 1px solid #1e293b; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
                      &gt; REGISTERED EVENT
                    </div>
                    <h2 style="margin: 0 0 16px 0; font-family: 'Inter', sans-serif; font-size: 22px; font-weight: 700; color: #ffffff; letter-spacing: -0.3px;">
                      ${params.eventName}
                    </h2>

                    <!-- Event Metadata Table -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
                      <tr>
                        <td width="90" style="padding: 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">DATE:</td>
                        <td style="padding: 6px 0; font-family: 'Inter', sans-serif; font-weight: 600; color: #f8fafc;">${params.date}</td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">VENUE:</td>
                        <td style="padding: 6px 0; font-family: 'Inter', sans-serif; font-weight: 600; color: #38bdf8;">${params.venue}</td>
                      </tr>
                      ${
                        params.college
                          ? `<tr>
                              <td style="padding: 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">COLLEGE:</td>
                              <td style="padding: 6px 0; font-family: 'Inter', sans-serif; color: #cbd5e1;">${params.college}</td>
                            </tr>`
                          : ""
                      }
                      ${
                        params.department
                          ? `<tr>
                              <td style="padding: 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase;">DEPT:</td>
                              <td style="padding: 6px 0; font-family: 'Inter', sans-serif; color: #cbd5e1;">${params.department}</td>
                            </tr>`
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Pass Code Highlight Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #050e24; border: 2px solid #2563eb; margin-bottom: 24px; text-align: center;">
                <tr>
                  <td style="padding: 24px 18px;">
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #60a5fa; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">
                      [ OFFICIAL EVENT PASS CODE ]
                    </div>
                    <div class="pass-code-text" style="font-family: 'JetBrains Mono', monospace; font-size: 34px; font-weight: 800; letter-spacing: 6px; color: #38bdf8; margin: 8px 0;">
                      ${params.registrationNumber}
                    </div>
                    <p style="margin: 8px 0 0 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #94a3b8; line-height: 1.5;">
                      Quote this 6-character pass code at the registration desk or present the QR code below for gate authorization.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Scannable Real-Time QR Gate Pass Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #040914; border: 1px solid #1e293b; margin-bottom: 24px; text-align: center;">
                <tr>
                  <td style="padding: 26px 20px;">
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #f8fafc; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
                      REAL-TIME GATE SCANNER PASS
                    </div>
                    <p style="margin: 0 0 16px 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #64748b;">
                      Scan with any smartphone camera or gate optical scanner for real-time live pass verification.
                    </p>

                    <!-- Pure White QR Frame for 100% Optical Scanning Reliability -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #ffffff; border: 2px solid #38bdf8; border-radius: 4px;">
                      <tr>
                        <td align="center" style="padding: 14px;">
                          ${qrImageMarkup}
                        </td>
                      </tr>
                    </table>

                    <div style="margin-top: 12px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748b;">
                      Pass ID: <span style="color: #94a3b8; font-weight: 600;">${params.registrationNumber}</span> &bull; Status: <span style="color: #10b981; font-weight: 600;">ACTIVE</span>
                    </div>

                    <!-- Direct Real-Time Pass Link Button -->
                    <div style="margin-top: 18px;">
                      <a href="${livePassUrl}" target="_blank" style="display: inline-block; background-color: #2563eb; color: #ffffff; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 700; text-transform: uppercase; letter-spacing: 1px; padding: 11px 24px; border-radius: 2px; border: 1px solid #38bdf8; text-decoration: none; box-shadow: 0 4px 12px rgba(37, 99, 235, 0.35);">
                        View Live Digital Pass &rarr;
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Vel Tech Campus Transportation Details -->
              ${
                params.transportOptIn
                  ? `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #040d21; border: 1px solid #0284c7; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 18px 20px;">
                      <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; border-bottom: 1px solid #1e3a5f; padding-bottom: 6px;">
                        🚌 VEL TECH CAMPUS TRANSPORTATION PASS (AC / NON-AC)
                      </div>
                      <p style="margin: 0 0 10px 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #cbd5e1; line-height: 1.5;">
                        Complimentary campus bus service reserved for <strong style="color: #ffffff;">${params.passengersCount || 1} passenger(s)</strong>.
                      </p>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12px; color: #cbd5e1; line-height: 1.6;">
                        <tr>
                          <td style="padding: 4px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748b; width: 140px; text-transform: uppercase;">Route Corridor:</td>
                          <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-weight: 600; color: #ffffff;">${params.pickupRoute || "Vel Tech Bus Network"}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748b; text-transform: uppercase;">Boarding Stop:</td>
                          <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-weight: 600; color: #38bdf8;">${params.pickupStop || "Designated Stop"}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748b; text-transform: uppercase;">Exact Landmark:</td>
                          <td style="padding: 4px 0; font-family: 'Inter', sans-serif; color: #f1f5f9;">${params.pickupLandmark || "Not Specified"}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #64748b; text-transform: uppercase;">Pickup Time:</td>
                          <td style="padding: 4px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #fbbf24;">Confirm exact timing with the transport coordinator</td>
                        </tr>
                      </table>
                      <div style="margin-top: 10px; padding: 8px 12px; background-color: #02122c; border-left: 3px solid #38bdf8; font-family: 'Inter', sans-serif; font-size: 11px; color: #94a3b8; line-height: 1.4;">
                        Note: The student transport coordinator and bus captain will confirm exact pickup timing with the team leader via mobile. Use the route, stop, and landmark above to identify your boarding point.
                      </div>
                    </td>
                  </tr>
                </table>
              `
                  : `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #040914; border: 1px solid #1e293b; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 12px 18px; font-family: 'Inter', sans-serif; font-size: 12px; color: #94a3b8;">
                      <strong style="color: #cbd5e1;">Transportation:</strong> Self-Arranged Commute directly to Vel Tech campus.
                    </td>
                  </tr>
                </table>
              `
              }

              <!-- Participant & Team Details -->
              ${
                isTeam
                  ? `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #040914; border: 1px solid #1e293b; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 18px 20px;">
                      <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #38bdf8; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #1e293b; padding-bottom: 6px;">
                        TEAM CREDENTIALS: ${params.teamName ? params.teamName.toUpperCase() : "CONFIRMED SQUAD"}
                      </div>
                      <p style="margin: 0 0 8px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #e2e8f0;">
                        <strong style="color: #ffffff;">Team Leader:</strong> ${params.participantName}
                      </p>
                      ${
                        params.members && params.members.length > 0
                          ? `
                        <div style="margin-top: 12px;">
                          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #64748b; text-transform: uppercase; margin-bottom: 6px;">
                            Team Members:
                          </div>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12px; color: #cbd5e1;">
                            ${params.members
                              .map(
                                (m, idx) => `
                              <tr>
                                <td style="padding: 3px 0; font-family: 'Inter', sans-serif;">
                                  <span style="color: #38bdf8; font-family: 'JetBrains Mono', monospace; margin-right: 6px;">[0${idx + 1}]</span>
                                  <strong style="color: #ffffff;">${m.name}</strong>
                                  <span style="color: #64748b; margin-left: 4px;">(${m.phone})</span>
                                </td>
                              </tr>
                            `
                              )
                              .join("")}
                          </table>
                        </div>
                      `
                          : ""
                      }
                    </td>
                  </tr>
                </table>
              `
                  : `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #040914; border: 1px solid #1e293b; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 16px 20px;">
                      <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #cbd5e1;">
                        <span style="color: #64748b; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; font-size: 11px; margin-right: 8px;">ATTENDEE:</span>
                        <strong style="color: #ffffff;">${params.participantName}</strong>
                      </p>
                    </td>
                  </tr>
                </table>
              `
              }

              <!-- Gate Entry Instructions -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #040914; border-left: 4px solid #38bdf8; border-top: 1px solid #1e293b; border-right: 1px solid #1e293b; border-bottom: 1px solid #1e293b; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="font-family: 'Inter', sans-serif; font-size: 13px; font-weight: 700; color: #ffffff; margin-bottom: 8px;">
                      Event Day Instructions
                    </div>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-family: 'Inter', sans-serif; font-size: 12px; color: #94a3b8; line-height: 1.6;">
                      <tr>
                        <td width="16" valign="top" style="color: #38bdf8; font-weight: bold;">&bull;</td>
                        <td style="padding-bottom: 6px;">Bring your physical college ID card and this digital entry pass.</td>
                      </tr>
                      <tr>
                        <td width="16" valign="top" style="color: #38bdf8; font-weight: bold;">&bull;</td>
                        <td style="padding-bottom: 6px;">Present the Pass Code or QR code at the registration desk for on-site gate check-in.</td>
                      </tr>
                      <tr>
                        <td width="16" valign="top" style="color: #38bdf8; font-weight: bold;">&bull;</td>
                        <td style="padding-bottom: 6px;">Please report 30 minutes prior to event commencement.</td>
                      </tr>
                      <tr>
                        <td width="16" valign="top" style="color: #38bdf8; font-weight: bold;">&bull;</td>
                        <td>This pass is non-transferable and valid exclusively for registered participants.</td>
                      </tr>
                    </table>
                  </td>
                </tr>
              </table>

            </td>
          </tr>

          <!-- Footer Section -->
          <tr>
            <td style="border-top: 1px solid #1e293b; padding: 24px 20px; text-align: center; background-color: #030712;">
              <p style="margin: 0 0 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #64748b; text-transform: uppercase; letter-spacing: 1px;">
                CODEHIVE 2K26 ORGANIZING COMMITTEE &bull; SECURE GATE VERIFICATION SYSTEM
              </p>
              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; color: #475569;">
                Department of Computer Science &amp; Engineering &bull; Official Digital Verification Service
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendMail({
    to: params.to,
    subject: `Official Event Pass [${params.registrationNumber}] — ${params.eventName} | CodeHive 2K26`,
    html: htmlContent,
    attachments,
  });
}

// ---------------------------------------------------------------------------
// Email OTP verification (Inter Font, High-Tech Verification Design)
// ---------------------------------------------------------------------------

export interface SendOtpEmailParams {
  to: string;
  otp: string;
  eventName?: string;
}

export async function sendOtpEmail(params: SendOtpEmailParams) {
  const eventContext = params.eventName
    ? `for ${params.eventName}`
    : "for event registration";

  const htmlContent = `
<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html xmlns="http://www.w3.org/1999/xhtml" lang="en">
<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Verification Code - CodeHive 2K26</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700;800&display=swap" rel="stylesheet">
</head>
<body style="margin: 0; padding: 0; background-color: #030712; color: #e2e8f0; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #030712; padding: 32px 12px;">
    <tr>
      <td align="center">
        <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="560" style="max-width: 560px; width: 100%; background-color: #080f1e; border: 1px solid #1e293b; box-shadow: 0 20px 40px rgba(0,0,0,0.6);">
          <tr>
            <td height="4" style="background: linear-gradient(90deg, #2563eb, #38bdf8, #2563eb); font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>
          <tr>
            <td style="padding: 32px 24px 20px 24px; text-align: center; border-bottom: 1px solid #1e293b;">
              <h1 style="margin: 0 0 6px 0; font-family: 'Inter', sans-serif; font-size: 24px; font-weight: 800; color: #38bdf8; letter-spacing: 2px; text-transform: uppercase;">
                CODEHIVE 2K26
              </h1>
              <p style="margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #64748b; letter-spacing: 1.5px; text-transform: uppercase;">
                &gt; Identity Authorization System
              </p>
            </td>
          </tr>
          <tr>
            <td style="padding: 32px 24px;">
              <p style="margin: 0 0 16px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #94a3b8;">
                Hello,
              </p>
              <p style="margin: 0 0 24px 0; font-family: 'Inter', sans-serif; font-size: 14px; color: #cbd5e1; line-height: 1.6;">
                Use the verification code below to authorize your email address ${eventContext}. This code is valid for <strong>5 minutes</strong>.
              </p>

              <!-- OTP Code Display Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #040914; border: 1px solid #2563eb; text-align: center; margin: 24px 0;">
                <tr>
                  <td style="padding: 24px 16px;">
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #60a5fa; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">
                      [ ONE-TIME PASSCODE ]
                    </div>
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #38bdf8; padding-left: 10px;">
                      ${params.otp}
                    </div>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #64748b; line-height: 1.5;">
                If you did not initiate this request, you can safely ignore this email. Never share your verification code with anyone.
              </p>
            </td>
          </tr>
          <tr>
            <td style="border-top: 1px solid #1e293b; padding: 20px; text-align: center; background-color: #030712;">
              <p style="margin: 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #475569; letter-spacing: 1px;">
                SECURE ACCESS // CODEHIVE 2K26 ORGANIZING COMMITTEE
              </p>
            </td>
          </tr>
        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  return sendMail({
    to: params.to,
    subject: `${params.otp} is your CodeHive 2K26 Verification Code`,
    html: htmlContent,
  });
}

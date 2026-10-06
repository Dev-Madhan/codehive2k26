import nodemailer from "nodemailer";
import { env } from "@/env";
import { generateQrBuffer } from "@/lib/qr";

// ---------------------------------------------------------------------------
// Singleton Nodemailer transporter (Gmail SMTP with App Password)
// ---------------------------------------------------------------------------

const smtpPort = Number(env.SMTP_PORT) || 587;

const transporter = nodemailer.createTransport({
  host: env.SMTP_HOST || "smtp.gmail.com",
  port: smtpPort,
  secure: smtpPort === 465, // STARTTLS for 587, SSL for 465
  auth: {
    user: env.SMTP_USER,
    pass: env.SMTP_PASS,
  },
  pool: true, // Reuse connections for better performance
  maxConnections: 5,
  maxMessages: 100,
  connectionTimeout: 10000, // 10s connection timeout
  greetingTimeout: 10000,
  socketTimeout: 15000,
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
  text?: string;
  attachments?: MailAttachment[];
}

export async function sendMail({ to, subject, html, text, attachments }: MailOptions) {
  try {
    const plainText =
      text ||
      html
        .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
        .replace(/<[^>]+>/g, " ")
        .replace(/\s+/g, " ")
        .trim();

    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      text: plainText,
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
    email?: string;
    college?: string;
    department?: string;
    year?: string;
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
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700;800&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #000000;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #E5E5E5;
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
      color: #FFFFFF;
      text-decoration: underline;
    }
    /* Neutralize email client auto-link styling (dates, addresses, phone numbers) */
    a[x-apple-data-detectors],
    .no-link-style a,
    span.MsoHyperlink {
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
<body id="body" style="margin: 0; padding: 0; background-color: #000000; color: #E5E5E5; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #000000; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" class="email-wrapper" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%; background-color: #0F0F0F; border: 1px solid #262626; border-collapse: collapse;">
          
          <!-- Top Accent Bar -->
          <tr>
            <td height="3" style="background: #FFFFFF; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td align="center" style="padding: 32px 24px 20px 24px; border-bottom: 1px solid #262626; text-align: center;">
              <!-- Verification Pill Badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 14px auto;">
                <tr>
                  <td style="background-color: #161616; border: 1px solid #404040; padding: 5px 14px; border-radius: 0px;">
                    <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1.5px; display: inline-flex; align-items: center;">
                      <span style="color: #FFFFFF; margin-right: 6px;">&#9679;</span> OFFICIAL ENTRY PASS // VERIFIED
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Main Brand Title -->
              <h1 style="margin: 0 0 6px 0; font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 26px; font-weight: 800; color: #FFFFFF; letter-spacing: 1.5px; text-transform: uppercase;">
                CODEHIVE 2K26
              </h1>
              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; color: #737373; letter-spacing: 1px; text-transform: uppercase;">
                National Level Technical Symposium &amp; Hackathon
              </p>
            </td>
          </tr>

          <!-- Body Container -->
          <tr>
            <td class="content-container" style="padding: 28px 24px;">

              <!-- Event Details Spotlight Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border: 1px solid #262626; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #A3A3A3; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
                      &gt; REGISTERED EVENT
                    </div>
                    <h2 style="margin: 0 0 16px 0; font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 22px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px;">
                      ${params.eventName}
                    </h2>

                    <!-- Event Metadata Table -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
                      <tr>
                        <td width="90" style="padding: 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #737373; text-transform: uppercase;">DATE:</td>
                        <td style="padding: 6px 0; font-family: 'Inter', sans-serif; font-weight: 600; color: #FFFFFF !important;">
                          <span style="color: #FFFFFF !important; text-decoration: none !important;">${params.date}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #737373; text-transform: uppercase;">VENUE:</td>
                        <td style="padding: 6px 0; font-family: 'Inter', sans-serif; font-weight: 600; color: #FFFFFF !important;">
                          <span style="color: #FFFFFF !important; text-decoration: none !important;">${params.venue}</span>
                        </td>
                      </tr>
                      ${
                        params.college
                          ? `<tr>
                              <td style="padding: 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #737373; text-transform: uppercase;">COLLEGE:</td>
                              <td style="padding: 6px 0; font-family: 'Inter', sans-serif; color: #E5E5E5 !important;">
                                <span style="color: #E5E5E5 !important; text-decoration: none !important;">${params.college}</span>
                              </td>
                            </tr>`
                          : ""
                      }
                      ${
                        params.department
                          ? `<tr>
                              <td style="padding: 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #737373; text-transform: uppercase;">DEPT:</td>
                              <td style="padding: 6px 0; font-family: 'Inter', sans-serif; color: #E5E5E5 !important;">
                                <span style="color: #E5E5E5 !important; text-decoration: none !important;">${params.department}</span>
                              </td>
                            </tr>`
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Pass Code Highlight Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border: 2px solid #FFFFFF; margin-bottom: 24px; text-align: center;">
                <tr>
                  <td style="padding: 24px 18px;">
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">
                      [ OFFICIAL EVENT PASS CODE ]
                    </div>
                    <div class="pass-code-text" style="font-family: 'JetBrains Mono', monospace; font-size: 34px; font-weight: 800; letter-spacing: 6px; color: #FFFFFF; margin: 8px 0;">
                      ${params.registrationNumber}
                    </div>
                    <p style="margin: 8px 0 0 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #A3A3A3; line-height: 1.5;">
                      Quote this 6-character pass code at the registration desk or present the QR code below for gate authorization.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Scannable Real-Time QR Gate Pass Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border: 1px solid #262626; margin-bottom: 24px; text-align: center;">
                <tr>
                  <td style="padding: 26px 20px;">
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
                      [ REAL-TIME GATE SCANNER PASS ]
                    </div>
                    <p style="margin: 0 0 16px 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #737373;">
                      Scan with any smartphone camera or gate optical scanner for real-time live pass verification.
                    </p>

                    <!-- Pure White QR Frame for 100% Optical Scanning Reliability -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #FFFFFF; border: 2px solid #262626; border-radius: 0px;">
                      <tr>
                        <td align="center" style="padding: 14px;">
                          ${qrImageMarkup}
                        </td>
                      </tr>
                    </table>

                    <div style="margin-top: 14px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373;">
                      PASS ID: <span style="color: #FFFFFF; font-weight: 600;">${params.registrationNumber}</span> &bull; STATUS: <span style="color: #FFFFFF; font-weight: 700;">ACTIVE // VERIFIED</span>
                    </div>

                    <!-- Direct Real-Time Pass Link Button -->
                    <div style="margin-top: 18px;">
                      <a href="${livePassUrl}" target="_blank" style="display: inline-block; background-color: #FFFFFF; color: #000000; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 12px 26px; border-radius: 0px; border: 1px solid #FFFFFF; text-decoration: none;">
                        [ VIEW LIVE PASS ] &rarr;
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Campus Transportation Details -->
              ${
                params.transportOptIn
                  ? `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border: 1px solid #262626; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 18px 20px;">
                      <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; border-bottom: 1px solid #262626; padding-bottom: 6px;">
                        [ CAMPUS TRANSPORTATION PASS // 6:00 AM ONWARDS ]
                      </div>
                      <p style="margin: 0 0 10px 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #E5E5E5; line-height: 1.5;">
                        Complimentary campus bus service reserved for <strong style="color: #FFFFFF;">${params.passengersCount || 1} passenger(s)</strong>.
                      </p>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12px; color: #E5E5E5; line-height: 1.6;">
                        <tr>
                          <td style="padding: 4px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373; width: 140px; text-transform: uppercase;">Route Corridor:</td>
                          <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-weight: 600; color: #FFFFFF;">${params.pickupRoute || "Bus Network"}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373; text-transform: uppercase;">Boarding Stop:</td>
                          <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-weight: 600; color: #FFFFFF;">${params.pickupStop || "Designated Stop"}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373; text-transform: uppercase;">Exact Landmark:</td>
                          <td style="padding: 4px 0; font-family: 'Inter', sans-serif; color: #E5E5E5;">${params.pickupLandmark || "Not Specified"}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373; text-transform: uppercase;">Reporting Time:</td>
                          <td style="padding: 4px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #FFFFFF;">10 Mins Prior to Pickup (Fleet operates from 05:45 AM)</td>
                        </tr>
                      </table>
                      ${
                        !params.samePickupForTeam && params.members && params.members.length > 0
                          ? `
                        <div style="margin-top: 14px; border-top: 1px solid #262626; padding-top: 10px;">
                          <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #737373; text-transform: uppercase; margin-bottom: 8px;">
                            // INDIVIDUAL COMMUTE ROSTER (${params.passengersCount || 1} BUS SEAT(S) RESERVED)
                          </div>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 11px; line-height: 1.5;">
                            <tr>
                              <td style="padding: 4px 0; font-family: 'Inter', sans-serif;">
                                <strong style="color: #FFFFFF;">Leader (${params.participantName}):</strong>
                                <span style="color: #E5E5E5;">${params.pickupRoute} &gt; ${params.pickupStop}</span>
                                <span style="color: #737373; font-size: 10px;">(${params.pickupLandmark})</span>
                              </td>
                            </tr>
                            ${params.members
                              .map(
                                (m, idx) => `
                              <tr>
                                <td style="padding: 4px 0; font-family: 'Inter', sans-serif;">
                                  <strong style="color: #FFFFFF;">Member 0${idx + 2} (${m.name}):</strong>
                                  ${
                                    m.transportOptIn
                                      ? `<span style="color: #E5E5E5;">${m.pickupRoute} &gt; ${m.pickupStop}</span> <span style="color: #737373; font-size: 10px;">(${m.pickupLandmark})</span>`
                                      : `<span style="color: #A3A3A3; font-style: italic;">🚗 Own Transportation (Self-Arranged Commute directly to campus)</span>`
                                  }
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
                      <div style="margin-top: 10px; padding: 8px 12px; background-color: #161616; border-left: 3px solid #FFFFFF; font-family: 'Inter', sans-serif; font-size: 11px; color: #A3A3A3; line-height: 1.4;">
                        Note: The student transport coordinator and bus captain will coordinate with the team leader via mobile. Please be at your designated boarding stop 10 minutes prior to scheduled pickup time.
                      </div>
                    </td>
                  </tr>
                </table>
              `
                  : `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border: 1px solid #262626; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 12px 18px; font-family: 'Inter', sans-serif; font-size: 12px; color: #737373;">
                      <strong style="color: #E5E5E5;">Transportation:</strong> Self-Arranged Commute directly to campus.
                    </td>
                  </tr>
                </table>
              `
              }

              <!-- Participant & Team Details -->
              ${
                isTeam
                  ? `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border: 1px solid #262626; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 18px 20px;">
                      <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #262626; padding-bottom: 6px;">
                        TEAM CREDENTIALS: ${params.teamName ? params.teamName.toUpperCase() : "CONFIRMED SQUAD"}
                      </div>
                      <p style="margin: 0 0 8px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #E2E8F0;">
                        <strong style="color: #FFFFFF;">Team Leader:</strong> ${params.participantName}
                      </p>
                      ${
                        params.members && params.members.length > 0
                          ? `
                        <div style="margin-top: 12px;">
                          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #737373; text-transform: uppercase; margin-bottom: 6px;">
                            Team Members:
                          </div>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12px; color: #CBD5E1;">
                            ${params.members
                              .map(
                                (m, idx) => `
                              <tr>
                                <td style="padding: 3px 0; font-family: 'Inter', sans-serif;">
                                  <span style="color: #737373; font-family: 'JetBrains Mono', monospace; margin-right: 6px;">[0${idx + 2}]</span>
                                  <strong style="color: #FFFFFF;">${m.name}</strong>
                                  <span style="color: #737373; margin-left: 4px;">(${m.phone}${m.email ? ` &bull; ${m.email}` : ""}${m.department ? ` &bull; ${m.department}` : ""})</span>
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
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border: 1px solid #262626; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 16px 20px;">
                      <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #E5E5E5;">
                        <span style="color: #737373; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; font-size: 11px; margin-right: 8px;">ATTENDEE:</span>
                        <strong style="color: #FFFFFF;">${params.participantName}</strong>
                      </p>
                    </td>
                  </tr>
                </table>
              `
              }

              <!-- Gate Entry Instructions -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border-left: 4px solid #FFFFFF; border-top: 1px solid #262626; border-right: 1px solid #262626; border-bottom: 1px solid #262626; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 13px; font-weight: 700; color: #FFFFFF; margin-bottom: 8px;">
                      EVENT DAY INSTRUCTIONS
                    </div>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-family: 'Inter', sans-serif; font-size: 12px; color: #A3A3A3; line-height: 1.6;">
                      <tr>
                        <td width="16" valign="top" style="color: #FFFFFF; font-weight: bold;">&bull;</td>
                        <td style="padding-bottom: 6px;">Bring your physical college ID card and this digital entry pass.</td>
                      </tr>
                      <tr>
                        <td width="16" valign="top" style="color: #FFFFFF; font-weight: bold;">&bull;</td>
                        <td style="padding-bottom: 6px;">Present the Pass Code or QR code at the registration desk for on-site gate check-in.</td>
                      </tr>
                      <tr>
                        <td width="16" valign="top" style="color: #FFFFFF; font-weight: bold;">&bull;</td>
                        <td style="padding-bottom: 6px;">Please report 30 minutes prior to event commencement.</td>
                      </tr>
                      <tr>
                        <td width="16" valign="top" style="color: #FFFFFF; font-weight: bold;">&bull;</td>
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
            <td style="border-top: 1px solid #262626; padding: 24px 20px; text-align: center; background-color: #080808;">
              <p style="margin: 0 0 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 1px;">
                CODEHIVE 2K26 ORGANIZING COMMITTEE &bull; SECURE GATE VERIFICATION SYSTEM
              </p>
              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; color: #404040;">
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
// Email OTP verification (Monochrome / B&W Edition, Space Grotesk + JetBrains Mono)
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
      .otp-code-text {
        font-size: 28px !important;
        letter-spacing: 6px !important;
      }
    }
  </style>
</head>
<body id="body" style="margin: 0; padding: 0; background-color: #000000; color: #E5E5E5; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #000000; padding: 32px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Frame -->
        <table role="presentation" class="email-wrapper" border="0" cellpadding="0" cellspacing="0" width="560" style="max-width: 560px; width: 100%; background-color: #0F0F0F; border: 1px solid #262626; border-collapse: collapse;">
          
          <!-- Top Pure White Accent Bar -->
          <tr>
            <td height="3" style="background: #FFFFFF; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header -->
          <tr>
            <td style="padding: 32px 24px 22px 24px; text-align: center; border-bottom: 1px solid #262626;">
              <!-- Monospaced Badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 12px auto;">
                <tr>
                  <td style="background-color: #161616; border: 1px solid #404040; padding: 5px 14px;">
                    <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1.5px;">
                      CODEHIVE 2K26 &bull; REGISTRATION
                    </span>
                  </td>
                </tr>
              </table>

              <h1 style="margin: 0 0 6px 0; font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 26px; font-weight: 800; color: #FFFFFF; letter-spacing: 1.5px; text-transform: uppercase;">
                CODEHIVE 2K26
              </h1>
              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; color: #737373; letter-spacing: 1.5px; text-transform: uppercase;">
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
                Thank you for registering for CodeHive 2K26 ${eventContext}. Please use the verification code below to verify your email address. This code is valid for <strong style="color: #FFFFFF;">10 minutes</strong>.
              </p>

              <!-- OTP Code Display Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border: 2px solid #FFFFFF; text-align: center; margin: 26px 0;">
                <tr>
                  <td style="padding: 26px 16px;">
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 10px;">
                      VERIFICATION CODE
                    </div>
                    <div class="otp-code-text" style="font-family: 'JetBrains Mono', monospace; font-size: 38px; font-weight: 800; letter-spacing: 10px; color: #FFFFFF; padding-left: 10px;">
                      ${params.otp}
                    </div>
                    <p style="margin: 12px 0 0 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373; letter-spacing: 1px;">
                      Enter this code in your registration form to verify your email
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Security Notice -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border-left: 3px solid #FFFFFF; border-top: 1px solid #262626; border-right: 1px solid #262626; border-bottom: 1px solid #262626; margin: 24px 0;">
                <tr>
                  <td style="padding: 14px 16px;">
                    <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #D4D4D4; line-height: 1.5;">
                      <strong style="color: #FFFFFF; font-family: 'JetBrains Mono', monospace;">Notice:</strong> If you did not initiate this registration, you can safely ignore this email.
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 20px 0 0 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #737373; line-height: 1.5;">
                This is an automated event notification. Please do not reply directly to this email.
              </p>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="border-top: 1px solid #262626; padding: 22px 20px; text-align: center; background-color: #080808;">
              <p style="margin: 0 0 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 1px;">
                CODEHIVE 2K26 ORGANIZING COMMITTEE
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
  `;

  return sendMail({
    to: params.to,
    subject: `CodeHive 2K26 - Verification Code: ${params.otp}`,
    html: htmlContent,
  });
}


export async function sendEventPostponedEmail(
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
  <title>UPDATED EVENT PASS - POSTPONED - ${params.eventName} | CodeHive 2K26</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=JetBrains+Mono:wght@600;700;800&family=Space+Grotesk:wght@600;700;800&display=swap" rel="stylesheet">
  <style type="text/css">
    body {
      margin: 0;
      padding: 0;
      background-color: #000000;
      font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;
      -webkit-font-smoothing: antialiased;
      -moz-osx-font-smoothing: grayscale;
      color: #E5E5E5;
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
      color: #FFFFFF;
      text-decoration: underline;
    }
    /* Neutralize email client auto-link styling (dates, addresses, phone numbers) */
    a[x-apple-data-detectors],
    .no-link-style a,
    span.MsoHyperlink {
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
<body id="body" style="margin: 0; padding: 0; background-color: #000000; color: #E5E5E5; font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #000000; padding: 24px 12px;">
    <tr>
      <td align="center">
        <!-- Main Email Container -->
        <table role="presentation" class="email-wrapper" border="0" cellpadding="0" cellspacing="0" width="600" style="max-width: 600px; width: 100%; background-color: #0F0F0F; border: 1px solid #262626; border-collapse: collapse;">
          
          <!-- Top Accent Bar -->
          <tr>
            <td height="3" style="background: #FFFFFF; font-size: 0; line-height: 0;">&nbsp;</td>
          </tr>

          <!-- Header Section -->
          <tr>
            <td align="center" style="padding: 32px 24px 20px 24px; border-bottom: 1px solid #262626; text-align: center;">
              <!-- Verification Pill Badge -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto 14px auto;">
                <tr>
                  <td style="background-color: #161616; border: 1px solid #404040; padding: 5px 14px; border-radius: 0px;">
                    <span style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1.5px; display: inline-flex; align-items: center;">
                      <span style="color: #FFFFFF; margin-right: 6px;">&#9679;</span> OFFICIAL ENTRY PASS // VERIFIED
                    </span>
                  </td>
                </tr>
              </table>

              <!-- Postponed Banner -->
<table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #FFFFFF; margin-bottom: 20px;"><tr><td align="center" style="padding: 12px; font-family: 'JetBrains Mono', monospace; font-size: 13px; font-weight: 800; color: #000000; text-transform: uppercase; letter-spacing: 2px;">IMPORTANT NOTICE: EVENT POSTPONED TO OCT 23</td></tr></table>
<!-- Main Brand Title -->
              <h1 style="margin: 0 0 6px 0; font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 26px; font-weight: 800; color: #FFFFFF; letter-spacing: 1.5px; text-transform: uppercase;">
                CODEHIVE 2K26
              </h1>
              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 12px; font-weight: 500; color: #737373; letter-spacing: 1px; text-transform: uppercase;">
                National Level Technical Symposium &amp; Hackathon
              </p>
            </td>
          </tr>

          <!-- Body Container -->
          <tr>
            <td class="content-container" style="padding: 28px 24px;">

              <!-- Event Details Spotlight Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border: 1px solid #262626; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 20px;">
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #A3A3A3; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 6px;">
                      &gt; REGISTERED EVENT
                    </div>
                    <h2 style="margin: 0 0 16px 0; font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 22px; font-weight: 700; color: #FFFFFF; letter-spacing: -0.3px;">
                      ${params.eventName}
                    </h2>

                    <!-- Event Metadata Table -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 13px;">
                      <tr>
                        <td width="90" style="padding: 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #737373; text-transform: uppercase;">DATE:</td>
                        <td style="padding: 6px 0; font-family: 'Inter', sans-serif; font-weight: 600; color: #FFFFFF !important;">
                          <span style="color: #FFFFFF !important; text-decoration: none !important;">${params.date}</span>
                        </td>
                      </tr>
                      <tr>
                        <td style="padding: 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #737373; text-transform: uppercase;">VENUE:</td>
                        <td style="padding: 6px 0; font-family: 'Inter', sans-serif; font-weight: 600; color: #FFFFFF !important;">
                          <span style="color: #FFFFFF !important; text-decoration: none !important;">${params.venue}</span>
                        </td>
                      </tr>
                      ${
                        params.college
                          ? `<tr>
                              <td style="padding: 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #737373; text-transform: uppercase;">COLLEGE:</td>
                              <td style="padding: 6px 0; font-family: 'Inter', sans-serif; color: #E5E5E5 !important;">
                                <span style="color: #E5E5E5 !important; text-decoration: none !important;">${params.college}</span>
                              </td>
                            </tr>`
                          : ""
                      }
                      ${
                        params.department
                          ? `<tr>
                              <td style="padding: 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #737373; text-transform: uppercase;">DEPT:</td>
                              <td style="padding: 6px 0; font-family: 'Inter', sans-serif; color: #E5E5E5 !important;">
                                <span style="color: #E5E5E5 !important; text-decoration: none !important;">${params.department}</span>
                              </td>
                            </tr>`
                          : ""
                      }
                    </table>
                  </td>
                </tr>
              </table>

              <!-- Pass Code Highlight Card -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border: 2px solid #FFFFFF; margin-bottom: 24px; text-align: center;">
                <tr>
                  <td style="padding: 24px 18px;">
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 2px; margin-bottom: 8px;">
                      [ OFFICIAL EVENT PASS CODE ]
                    </div>
                    <div class="pass-code-text" style="font-family: 'JetBrains Mono', monospace; font-size: 34px; font-weight: 800; letter-spacing: 6px; color: #FFFFFF; margin: 8px 0;">
                      ${params.registrationNumber}
                    </div>
                    <p style="margin: 8px 0 0 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #A3A3A3; line-height: 1.5;">
                      Quote this 6-character pass code at the registration desk or present the QR code below for gate authorization.
                    </p>
                  </td>
                </tr>
              </table>

              <!-- Scannable Real-Time QR Gate Pass Box -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border: 1px solid #262626; margin-bottom: 24px; text-align: center;">
                <tr>
                  <td style="padding: 26px 20px;">
                    <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 4px;">
                      [ REAL-TIME GATE SCANNER PASS ]
                    </div>
                    <p style="margin: 0 0 16px 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #737373;">
                      Scan with any smartphone camera or gate optical scanner for real-time live pass verification.
                    </p>

                    <!-- Pure White QR Frame for 100% Optical Scanning Reliability -->
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" style="margin: 0 auto; background-color: #FFFFFF; border: 2px solid #262626; border-radius: 0px;">
                      <tr>
                        <td align="center" style="padding: 14px;">
                          ${qrImageMarkup}
                        </td>
                      </tr>
                    </table>

                    <div style="margin-top: 14px; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373;">
                      PASS ID: <span style="color: #FFFFFF; font-weight: 600;">${params.registrationNumber}</span> &bull; STATUS: <span style="color: #FFFFFF; font-weight: 700;">ACTIVE // VERIFIED</span>
                    </div>

                    <!-- Direct Real-Time Pass Link Button -->
                    <div style="margin-top: 18px;">
                      <a href="${livePassUrl}" target="_blank" style="display: inline-block; background-color: #FFFFFF; color: #000000; font-family: 'JetBrains Mono', monospace; font-size: 12px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; padding: 12px 26px; border-radius: 0px; border: 1px solid #FFFFFF; text-decoration: none;">
                        [ VIEW LIVE PASS ] &rarr;
                      </a>
                    </div>
                  </td>
                </tr>
              </table>

              <!-- Campus Transportation Details -->
              ${
                params.transportOptIn
                  ? `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border: 1px solid #262626; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 18px 20px;">
                      <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 8px; border-bottom: 1px solid #262626; padding-bottom: 6px;">
                        [ CAMPUS TRANSPORTATION PASS // 6:00 AM ONWARDS ]
                      </div>
                      <p style="margin: 0 0 10px 0; font-family: 'Inter', sans-serif; font-size: 12px; color: #E5E5E5; line-height: 1.5;">
                        Complimentary campus bus service reserved for <strong style="color: #FFFFFF;">${params.passengersCount || 1} passenger(s)</strong>.
                      </p>
                      <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12px; color: #E5E5E5; line-height: 1.6;">
                        <tr>
                          <td style="padding: 4px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373; width: 140px; text-transform: uppercase;">Route Corridor:</td>
                          <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-weight: 600; color: #FFFFFF;">${params.pickupRoute || "Bus Network"}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373; text-transform: uppercase;">Boarding Stop:</td>
                          <td style="padding: 4px 0; font-family: 'Inter', sans-serif; font-weight: 600; color: #FFFFFF;">${params.pickupStop || "Designated Stop"}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373; text-transform: uppercase;">Exact Landmark:</td>
                          <td style="padding: 4px 0; font-family: 'Inter', sans-serif; color: #E5E5E5;">${params.pickupLandmark || "Not Specified"}</td>
                        </tr>
                        <tr>
                          <td style="padding: 4px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; color: #737373; text-transform: uppercase;">Reporting Time:</td>
                          <td style="padding: 4px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #FFFFFF;">10 Mins Prior to Pickup (Fleet operates from 05:45 AM)</td>
                        </tr>
                      </table>
                      ${
                        !params.samePickupForTeam && params.members && params.members.length > 0
                          ? `
                        <div style="margin-top: 14px; border-top: 1px solid #262626; padding-top: 10px;">
                          <div style="font-family: 'JetBrains Mono', monospace; font-size: 10px; font-weight: 700; color: #737373; text-transform: uppercase; margin-bottom: 8px;">
                            // INDIVIDUAL COMMUTE ROSTER (${params.passengersCount || 1} BUS SEAT(S) RESERVED)
                          </div>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 11px; line-height: 1.5;">
                            <tr>
                              <td style="padding: 4px 0; font-family: 'Inter', sans-serif;">
                                <strong style="color: #FFFFFF;">Leader (${params.participantName}):</strong>
                                <span style="color: #E5E5E5;">${params.pickupRoute} &gt; ${params.pickupStop}</span>
                                <span style="color: #737373; font-size: 10px;">(${params.pickupLandmark})</span>
                              </td>
                            </tr>
                            ${params.members
                              .map(
                                (m, idx) => `
                              <tr>
                                <td style="padding: 4px 0; font-family: 'Inter', sans-serif;">
                                  <strong style="color: #FFFFFF;">Member 0${idx + 2} (${m.name}):</strong>
                                  ${
                                    m.transportOptIn
                                      ? `<span style="color: #E5E5E5;">${m.pickupRoute} &gt; ${m.pickupStop}</span> <span style="color: #737373; font-size: 10px;">(${m.pickupLandmark})</span>`
                                      : `<span style="color: #A3A3A3; font-style: italic;">🚗 Own Transportation (Self-Arranged Commute directly to campus)</span>`
                                  }
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
                      <div style="margin-top: 10px; padding: 8px 12px; background-color: #161616; border-left: 3px solid #FFFFFF; font-family: 'Inter', sans-serif; font-size: 11px; color: #A3A3A3; line-height: 1.4;">
                        Note: The student transport coordinator and bus captain will coordinate with the team leader via mobile. Please be at your designated boarding stop 10 minutes prior to scheduled pickup time.
                      </div>
                    </td>
                  </tr>
                </table>
              `
                  : `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border: 1px solid #262626; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 12px 18px; font-family: 'Inter', sans-serif; font-size: 12px; color: #737373;">
                      <strong style="color: #E5E5E5;">Transportation:</strong> Self-Arranged Commute directly to campus.
                    </td>
                  </tr>
                </table>
              `
              }

              <!-- Participant & Team Details -->
              ${
                isTeam
                  ? `
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border: 1px solid #262626; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 18px 20px;">
                      <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #FFFFFF; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 10px; border-bottom: 1px solid #262626; padding-bottom: 6px;">
                        TEAM CREDENTIALS: ${params.teamName ? params.teamName.toUpperCase() : "CONFIRMED SQUAD"}
                      </div>
                      <p style="margin: 0 0 8px 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #E2E8F0;">
                        <strong style="color: #FFFFFF;">Team Leader:</strong> ${params.participantName}
                      </p>
                      ${
                        params.members && params.members.length > 0
                          ? `
                        <div style="margin-top: 12px;">
                          <div style="font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 600; color: #737373; text-transform: uppercase; margin-bottom: 6px;">
                            Team Members:
                          </div>
                          <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-size: 12px; color: #CBD5E1;">
                            ${params.members
                              .map(
                                (m, idx) => `
                              <tr>
                                <td style="padding: 3px 0; font-family: 'Inter', sans-serif;">
                                  <span style="color: #737373; font-family: 'JetBrains Mono', monospace; margin-right: 6px;">[0${idx + 1}]</span>
                                  <strong style="color: #FFFFFF;">${m.name}</strong>
                                  <span style="color: #737373; margin-left: 4px;">(${m.phone})</span>
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
                <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border: 1px solid #262626; margin-bottom: 24px;">
                  <tr>
                    <td style="padding: 16px 20px;">
                      <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 13px; color: #E5E5E5;">
                        <span style="color: #737373; font-family: 'JetBrains Mono', monospace; text-transform: uppercase; font-size: 11px; margin-right: 8px;">ATTENDEE:</span>
                        <strong style="color: #FFFFFF;">${params.participantName}</strong>
                      </p>
                    </td>
                  </tr>
                </table>
              `
              }

              <!-- Gate Entry Instructions -->
              <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="background-color: #080808; border-left: 4px solid #FFFFFF; border-top: 1px solid #262626; border-right: 1px solid #262626; border-bottom: 1px solid #262626; margin-bottom: 24px;">
                <tr>
                  <td style="padding: 18px 20px;">
                    <div style="font-family: 'Space Grotesk', 'Inter', sans-serif; font-size: 13px; font-weight: 700; color: #FFFFFF; margin-bottom: 8px;">
                      EVENT DAY INSTRUCTIONS
                    </div>
                    <table role="presentation" border="0" cellpadding="0" cellspacing="0" width="100%" style="font-family: 'Inter', sans-serif; font-size: 12px; color: #A3A3A3; line-height: 1.6;">
                      <tr>
                        <td width="16" valign="top" style="color: #FFFFFF; font-weight: bold;">&bull;</td>
                        <td style="padding-bottom: 6px;">Bring your physical college ID card and this digital entry pass.</td>
                      </tr>
                      <tr>
                        <td width="16" valign="top" style="color: #FFFFFF; font-weight: bold;">&bull;</td>
                        <td style="padding-bottom: 6px;">Present the Pass Code or QR code at the registration desk for on-site gate check-in.</td>
                      </tr>
                      <tr>
                        <td width="16" valign="top" style="color: #FFFFFF; font-weight: bold;">&bull;</td>
                        <td style="padding-bottom: 6px;">Please report 30 minutes prior to event commencement.</td>
                      </tr>
                      <tr>
                        <td width="16" valign="top" style="color: #FFFFFF; font-weight: bold;">&bull;</td>
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
            <td style="border-top: 1px solid #262626; padding: 24px 20px; text-align: center; background-color: #080808;">
              <p style="margin: 0 0 6px 0; font-family: 'JetBrains Mono', monospace; font-size: 11px; font-weight: 700; color: #737373; text-transform: uppercase; letter-spacing: 1px;">
                CODEHIVE 2K26 ORGANIZING COMMITTEE &bull; SECURE GATE VERIFICATION SYSTEM
              </p>
              <p style="margin: 0; font-family: 'Inter', sans-serif; font-size: 11px; color: #404040;">
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
// Email OTP verification (Monochrome / B&W Edition, Space Grotesk + JetBrains Mono)
// ---------------------------------------------------------------------------


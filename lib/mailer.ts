import nodemailer from "nodemailer";
import { env } from "@/env";

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
// sendMail — generic wrapper with error handling
// ---------------------------------------------------------------------------

export interface MailOptions {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: MailOptions) {
  try {
    const info = await transporter.sendMail({
      from: env.EMAIL_FROM,
      to,
      subject,
      html,
    });

    console.log(`✉️  Email sent to ${to} — MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error("📧 Email delivery failure:", error);
    return { success: false, error: "Failed to send email" };
  }
}

// ---------------------------------------------------------------------------
// Registration confirmation email (replaces the old Resend version)
// ---------------------------------------------------------------------------

export interface SendRegistrationEmailParams {
  to: string;
  participantName: string;
  eventName: string;
  registrationNumber: string;
  venue: string;
  date: string;
  qrCodeUrl: string;
}

export async function sendRegistrationConfirmationEmail(
  params: SendRegistrationEmailParams
) {
  return sendMail({
    to: params.to,
    subject: `Registration Confirmed — ${params.eventName} | CodeHive 2K26`,
    html: `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; background-color: #020817; color: #F8FBFF; padding: 32px; border-radius: 12px; max-width: 600px; margin: auto;">
        <div style="text-align: center; margin-bottom: 24px;">
          <h1 style="color: #00D9FF; margin-bottom: 4px; font-size: 28px;">CodeHive 2K26</h1>
          <h2 style="color: #2DFFB9; margin-top: 0; font-weight: 500;">Registration Confirmed ✓</h2>
        </div>

        <p>Hi <strong>${params.participantName}</strong>,</p>
        <p>You have successfully registered for <strong style="color: #00D9FF;">${params.eventName}</strong>.</p>

        <div style="background-color: #0A1930; border: 1px solid #12345C; border-radius: 8px; padding: 20px; margin: 24px 0;">
          <p style="margin: 6px 0;"><strong>Registration ID:</strong> <span style="font-family: 'Courier New', monospace; color: #00D9FF; font-size: 16px;">${params.registrationNumber}</span></p>
          <p style="margin: 6px 0;"><strong>Venue:</strong> ${params.venue}</p>
          <p style="margin: 6px 0;"><strong>Date:</strong> ${params.date}</p>
        </div>

        <div style="text-align: center; margin: 28px 0;">
          <p style="margin-bottom: 12px; font-weight: 600;">Your Event-Day Check-in QR Code:</p>
          <img src="${params.qrCodeUrl}" alt="Check-in QR Code" style="width: 200px; height: 200px; border-radius: 10px; border: 2px solid #00D9FF;" />
          <p style="font-size: 12px; color: #8FA6C2; margin-top: 10px;">Show this QR code at the registration desk on event day.</p>
        </div>

        <hr style="border: none; border-top: 1px solid #12345C; margin: 28px 0;" />
        <p style="font-size: 12px; color: #8FA6C2; text-align: center;">CodeHive 2K26 Organizing Committee</p>
      </div>
    `,
  });
}

// ---------------------------------------------------------------------------
// Email OTP verification (Nodemailer)
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

  return sendMail({
    to: params.to,
    subject: `${params.otp} is your CodeHive 2K26 Verification Code`,
    html: `
      <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #03060e; color: #e2e8f0; padding: 40px 20px; max-width: 560px; margin: 0 auto; border: 1px solid #152a54;">
        <div style="text-align: center; margin-bottom: 28px; border-bottom: 1px solid #152a54; padding-bottom: 20px;">
          <h1 style="color: #38bdf8; margin: 0 0 6px 0; font-size: 24px; font-weight: 800; letter-spacing: 2px;">CODEHIVE 2K26</h1>
          <p style="color: #64748b; font-size: 12px; margin: 0; text-transform: uppercase; letter-spacing: 1.5px; font-family: monospace;">&gt; Identity Authorization System</p>
        </div>

        <p style="font-size: 14px; color: #94a3b8; margin: 0 0 16px 0;">Hello,</p>
        <p style="font-size: 14px; color: #cbd5e1; line-height: 1.6; margin: 0 0 24px 0;">
          Use the verification code below to authorize your email address ${eventContext}. This code is valid for <strong>5 minutes</strong>.
        </p>

        <div style="background-color: #060d1a; border: 1px solid #1d4ed8; padding: 24px; text-align: center; margin: 24px 0;">
          <span style="font-size: 11px; font-family: monospace; color: #60a5fa; text-transform: uppercase; letter-spacing: 2px; display: block; margin-bottom: 8px;">[ One-Time Passcode ]</span>
          <div style="font-family: 'Courier New', Courier, monospace; font-size: 38px; font-weight: 800; letter-spacing: 12px; color: #38bdf8; text-shadow: 0 0 20px rgba(56, 189, 248, 0.4); padding-left: 12px;">
            ${params.otp}
          </div>
        </div>

        <p style="font-size: 12px; color: #64748b; line-height: 1.5; margin: 20px 0 0 0;">
          If you did not initiate this request, you can safely ignore this email. Do not share this verification code with anyone.
        </p>

        <div style="border-top: 1px solid #152a54; margin-top: 32px; padding-top: 20px; text-align: center;">
          <p style="font-size: 11px; color: #475569; margin: 0; font-family: monospace;">
            SECURE ACCESS // CODEHIVE 2K26 ORGANIZING COMMITTEE
          </p>
        </div>
      </div>
    `,
  });
}

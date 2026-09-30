import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY || "re_dummy_for_build");

export interface SendRegistrationEmailParams {
  to: string;
  participantName: string;
  eventName: string;
  registrationNumber: string;
  venue: string;
  date: string;
  qrCodeUrl: string;
}

/**
 * Send event registration confirmation email with QR code.
 */
export async function sendRegistrationConfirmationEmail(
  params: SendRegistrationEmailParams
) {
  const fromEmail = process.env.EMAIL_FROM || "CodeHive 2K26 <no-reply@codehive2k26.com>";

  try {
    const data = await resend.emails.send({
      from: fromEmail,
      to: params.to,
      subject: `Registration Confirmed — ${params.eventName} | CodeHive 2K26`,
      html: `
        <div style="font-family: Arial, sans-serif; background-color: #020817; color: #F8FBFF; padding: 24px; border-radius: 8px; max-width: 600px; margin: auto;">
          <h1 style="color: #00D9FF; margin-bottom: 8px;">CodeHive 2K26</h1>
          <h2 style="color: #2DFFB9; margin-top: 0;">Registration Confirmed!</h2>
          <p>Hi <strong>${params.participantName}</strong>,</p>
          <p>You have successfully registered for <strong>${params.eventName}</strong>.</p>
          
          <div style="background-color: #0A1930; border: 1px solid #12345C; border-radius: 6px; padding: 16px; margin: 20px 0;">
            <p style="margin: 4px 0;"><strong>Registration ID:</strong> <span style="font-family: monospace; color: #00D9FF;">${params.registrationNumber}</span></p>
            <p style="margin: 4px 0;"><strong>Venue:</strong> ${params.venue}</p>
            <p style="margin: 4px 0;"><strong>Date:</strong> ${params.date}</p>
          </div>

          <div style="text-align: center; margin: 24px 0;">
            <p style="margin-bottom: 8px;"><strong>Your Event-Day Check-in QR Code:</strong></p>
            <img src="${params.qrCodeUrl}" alt="Check-in QR Code" style="width: 200px; height: 200px; border-radius: 8px; border: 2px solid #00D9FF;" />
            <p style="font-size: 12px; color: #8FA6C2; margin-top: 8px;">Show this QR code at the registration desk on event day.</p>
          </div>

          <hr style="border: none; border-top: 1px solid #12345C; margin: 24px 0;" />
          <p style="font-size: 12px; color: #8FA6C2;">CodeHive 2K26 Organizing Committee</p>
        </div>
      `,
    });

    return { success: true, data };
  } catch (error) {
    console.error("Resend email delivery failure:", error);
    return { success: false, error };
  }
}

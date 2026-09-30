import { NextRequest, NextResponse } from "next/server";
import { generateOTP, checkRateLimit, storeOTP } from "@/lib/otp";
import { sendMail } from "@/lib/mailer";
import { otpEmailTemplate } from "@/lib/email-templates";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email } = body;

    if (!email || typeof email !== "string") {
      return NextResponse.json(
        { error: "Email address is required." },
        { status: 400 }
      );
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Invalid email format." },
        { status: 400 }
      );
    }

    // Rate limit check
    const withinLimit = await checkRateLimit(email);
    if (!withinLimit) {
      return NextResponse.json(
        { error: "Too many OTP requests. Please wait 15 minutes before trying again." },
        { status: 429 }
      );
    }

    // Generate and store OTP
    const otp = generateOTP();
    await storeOTP(email, otp);

    // Send email
    const result = await sendMail({
      to: email,
      subject: "Your Verification Code — CodeHive 2K26",
      html: otpEmailTemplate(otp),
    });

    if (!result.success) {
      return NextResponse.json(
        { error: "Failed to send verification email. Please try again." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Verification code sent successfully.",
    });
  } catch (error) {
    console.error("send-otp error:", error);
    return NextResponse.json(
      { error: "Internal server error." },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import crypto from "crypto";

export const dynamic = "force-dynamic";

export async function POST(req: NextRequest) {
  const secret = process.env.WEBHOOK_SECRET;

  // If webhooks are not explicitly enabled and configured, reject access
  if (!secret) {
    return NextResponse.json(
      { success: false, error: "Webhooks are not enabled on this environment." },
      { status: 404 }
    );
  }

  const providedSecret =
    req.headers.get("x-webhook-secret") ||
    req.headers.get("authorization")?.replace(/^Bearer\s+/i, "");

  if (!providedSecret) {
    return NextResponse.json(
      { success: false, error: "Missing webhook authorization." },
      { status: 401 }
    );
  }

  const secretBuf = Buffer.from(secret);
  const providedBuf = Buffer.from(providedSecret);

  if (
    secretBuf.length !== providedBuf.length ||
    !crypto.timingSafeEqual(secretBuf, providedBuf)
  ) {
    return NextResponse.json(
      { success: false, error: "Invalid webhook secret." },
      { status: 403 }
    );
  }

  try {
    const payload = await req.json();
    return NextResponse.json({ success: true, message: "Webhook acknowledged." });
  } catch (error: unknown) {
    console.error("API /api/webhooks error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to process webhook payload." },
      { status: 400 }
    );
  }
}

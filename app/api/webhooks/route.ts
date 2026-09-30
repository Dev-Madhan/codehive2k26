import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const payload = await req.json();
    console.log("Received webhook notification:", payload);

    return NextResponse.json({ success: true, message: "Webhook acknowledged." });
  } catch (error) {
    console.error("API /api/webhooks error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to process webhook." } },
      { status: 500 }
    );
  }
}

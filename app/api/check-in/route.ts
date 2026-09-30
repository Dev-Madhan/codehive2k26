import { NextRequest, NextResponse } from "next/server";
import { checkInParticipant } from "@/actions/checkin";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { qrToken, staffId = "staff_api_token_user" } = body;

    if (!qrToken) {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_INPUT", message: "qrToken is required." } },
        { status: 400 }
      );
    }

    const result = await checkInParticipant(staffId, { qrToken });

    if (!result.success) {
      const statusCode =
        result.error.code === "ALREADY_CHECKED_IN"
          ? 409
          : result.error.code === "FORBIDDEN"
          ? 403
          : 400;

      return NextResponse.json(result, { status: statusCode });
    }

    return NextResponse.json(result);
  } catch (error) {
    console.error("API /api/check-in error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to process check-in." } },
      { status: 500 }
    );
  }
}

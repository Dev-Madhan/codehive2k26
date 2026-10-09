import { NextRequest, NextResponse } from "next/server";
import { checkInParticipant } from "@/actions/checkin";
import { requireAdminSession } from "@/lib/auth-guard";
import { checkRateLimit, getClientIp, RATE_LIMIT_TIERS } from "@/lib/rate-limiter";

/**
 * POST /api/check-in
 * Secure gate check-in route.
 * Protected by:
 * 1. IP-based rate limiting (Anti-Flooding)
 * 2. Authenticated Admin/Staff Session Guard
 */
export async function POST(req: NextRequest) {
  try {
    // 1. Rate Limiting Protection
    const ip = getClientIp(req.headers);
    const rateLimit = await checkRateLimit(`checkin:${ip}`, RATE_LIMIT_TIERS.CHECK_IN);
    if (!rateLimit.success) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many check-in requests. Please wait before retrying.",
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimit.resetSeconds.toString(),
          },
        }
      );
    }

    // 2. Authentication Verification (Strict Admin Role Required)
    const authCheck = await requireAdminSession(req.headers);
    if (authCheck.error) {
      const statusCode = authCheck.error.code === "UNAUTHORIZED" ? 401 : 403;
      return NextResponse.json(
        {
          success: false,
          error: authCheck.error,
        },
        { status: statusCode }
      );
    }

    const body = await req.json();
    const { qrToken } = body;

    if (!qrToken || typeof qrToken !== "string") {
      return NextResponse.json(
        { success: false, error: { code: "INVALID_INPUT", message: "A valid qrToken string is required." } },
        { status: 400 }
      );
    }

    // Use authentic staff user ID from active admin session
    const staffId = authCheck.user.id;
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

    return NextResponse.json(result, { status: 200 });
  } catch (error) {
    console.error("API /api/check-in error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to process check-in." } },
      { status: 500 }
    );
  }
}

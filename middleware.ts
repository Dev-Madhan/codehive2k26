import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { checkMemoryRateLimit, getClientIp, RATE_LIMIT_TIERS, RateLimitConfig } from "@/lib/rate-limiter";

/**
 * CodeHive 2K26 — Root Edge Security & Anti-DDoS Middleware
 * 1. Layer 7 DDoS Mitigation via Sliding Window Rate Limiting
 * 2. Enterprise HTTP Security Headers (Anti-Clickjacking, HSTS, Nosniff)
 * 3. Bot & Route Throttling
 */

function getTierForPath(pathname: string): { tierName: string; config: RateLimitConfig } {
  if (pathname.startsWith("/api/upload")) {
    return { tierName: "upload", config: RATE_LIMIT_TIERS.UPLOAD };
  }
  if (pathname.startsWith("/api/auth")) {
    return { tierName: "auth", config: RATE_LIMIT_TIERS.AUTH };
  }
  if (pathname.startsWith("/api/check-in")) {
    return { tierName: "checkin", config: RATE_LIMIT_TIERS.CHECK_IN };
  }
  if (pathname.startsWith("/api/registrations") || pathname.startsWith("/api/admin")) {
    return { tierName: "admin_api", config: RATE_LIMIT_TIERS.ADMIN_API };
  }
  if (pathname.startsWith("/api/")) {
    return { tierName: "api_general", config: { limit: 60, windowSeconds: 60 } };
  }
  // Public HTML pages
  return { tierName: "global", config: RATE_LIMIT_TIERS.GLOBAL };
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Health probe bypass: monitoring systems must not be throttled
  if (pathname === "/api/health") {
    return NextResponse.next();
  }

  // 1. Resolve client IP and rate limit tier
  const ip = getClientIp(request.headers);
  const { tierName, config } = getTierForPath(pathname);
  const rateLimitKey = `${tierName}:${ip}`;

  const rateLimitResult = checkMemoryRateLimit(rateLimitKey, config);

  // 2. Handle rate limit exceeded (HTTP 429)
  if (!rateLimitResult.success) {
    const isApi = pathname.startsWith("/api/");
    
    if (isApi) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "RATE_LIMIT_EXCEEDED",
            message: "Too many requests. Cyber defense shield active. Please slow down and try again.",
            retryAfterSeconds: rateLimitResult.resetSeconds,
          },
        },
        {
          status: 429,
          headers: {
            "Retry-After": rateLimitResult.resetSeconds.toString(),
            "X-RateLimit-Limit": rateLimitResult.limit.toString(),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": rateLimitResult.resetSeconds.toString(),
            "Cache-Control": "no-store, no-cache, must-revalidate",
          },
        }
      );
    }

    // Terminal-styled HTML response for browser navigation
    const html = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8"/>
  <meta name="viewport" content="width=device-width, initial-scale=1"/>
  <title>429 Too Many Requests — CodeHive 2K26</title>
  <style>
    body { background: #000000; color: #FFFFFF; font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; display: flex; align-items: center; justify-content: center; min-height: 100vh; margin: 0; padding: 20px; box-sizing: border-box; }
    .card { background: #0F0F0F; border: 1px solid #262626; padding: 32px; max-width: 480px; width: 100%; }
    .tag { display: inline-block; background: #161616; border: 1px solid #404040; color: #A3A3A3; font-size: 11px; padding: 2px 8px; text-transform: uppercase; margin-bottom: 16px; }
    h1 { font-size: 20px; margin: 0 0 12px 0; color: #FFFFFF; }
    p { font-size: 13px; color: #A3A3A3; line-height: 1.6; margin: 0 0 20px 0; }
    .timer { font-size: 12px; color: #737373; border-top: 1px solid #262626; padding-top: 14px; }
  </style>
</head>
<body>
  <div class="card">
    <div class="tag">&gt; DEFENSE // RATE_LIMIT_EXCEEDED</div>
    <h1>429 — Request Limit Exceeded</h1>
    <p>Our automated cyber defense shield has detected unusually high traffic volume from your network. Please wait a brief moment before refreshing.</p>
    <div class="timer">Cooldown window: ${rateLimitResult.resetSeconds}s &bull; IP: ${ip}</div>
  </div>
</body>
</html>`;

    return new NextResponse(html, {
      status: 429,
      headers: {
        "Content-Type": "text/html; charset=utf-8",
        "Retry-After": rateLimitResult.resetSeconds.toString(),
        "X-RateLimit-Limit": rateLimitResult.limit.toString(),
        "X-RateLimit-Remaining": "0",
        "X-RateLimit-Reset": rateLimitResult.resetSeconds.toString(),
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    });
  }

  // 3. Continue request and inject HTTP Security Headers
  const response = NextResponse.next();

  // Defensive HTTP Headers
  response.headers.set("X-Frame-Options", "DENY");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  response.headers.set(
    "Permissions-Policy",
    "camera=(self), microphone=(), geolocation=(), browsing-topics=()"
  );
  response.headers.set(
    "Strict-Transport-Security",
    "max-age=63072000; includeSubDomains; preload"
  );
  response.headers.set("X-DNS-Prefetch-Control", "on");

  // Rate Limit Telemetry Headers
  response.headers.set("X-RateLimit-Limit", rateLimitResult.limit.toString());
  response.headers.set("X-RateLimit-Remaining", rateLimitResult.remaining.toString());
  response.headers.set("X-RateLimit-Reset", rateLimitResult.resetSeconds.toString());

  return response;
}

// Apply middleware to all routes except static assets
export const config = {
  matcher: [
    /*
     * Match all request paths except for:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico, sitemap.xml, robots.txt
     * - static public media (.svg, .png, .jpg, .jpeg, .gif, .webp, .pdf)
     */
    "/((?!_next/static|_next/image|favicon.ico|sitemap.xml|robots.txt|.*\\.(?:svg|png|jpg|jpeg|gif|webp|pdf)$).*)",
  ],
};

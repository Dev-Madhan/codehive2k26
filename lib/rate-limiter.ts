/**
 * CodeHive 2K26 — High-Performance Multi-Tier Rate Limiting Engine
 * Supports sub-millisecond in-memory sliding window algorithm
 * with optional distributed Upstash Redis REST fallback.
 */

export interface RateLimitConfig {
  /** Maximum number of requests allowed within the window */
  limit: number;
  /** Window size in seconds */
  windowSeconds: number;
}

export interface RateLimitResult {
  success: boolean;
  limit: number;
  remaining: number;
  resetSeconds: number;
}

// Pre-configured rate limiting tiers
export const RATE_LIMIT_TIERS = {
  /** General public pages (home, events catalogue, etc.) */
  GLOBAL: { limit: 120, windowSeconds: 60 } as RateLimitConfig,
  /** Authentication endpoints (sign-in, OAuth triggers) */
  AUTH: { limit: 15, windowSeconds: 60 } as RateLimitConfig,
  /** Sending Email OTP (prevents email bombing and SMTP exhaustion) */
  OTP_SEND: { limit: 3, windowSeconds: 60 } as RateLimitConfig,
  /** Verifying Email OTP (prevents 6-digit brute-force attacks) */
  OTP_VERIFY: { limit: 5, windowSeconds: 300 } as RateLimitConfig,
  /** File uploads (college ID uploads) */
  UPLOAD: { limit: 8, windowSeconds: 300 } as RateLimitConfig,
  /** Registration submission */
  REGISTRATION: { limit: 6, windowSeconds: 60 } as RateLimitConfig,
  /** Gate check-in API */
  CHECK_IN: { limit: 40, windowSeconds: 60 } as RateLimitConfig,
  /** Administrative telemetry & export APIs */
  ADMIN_API: { limit: 60, windowSeconds: 60 } as RateLimitConfig,
} as const;

// ── In-Memory Sliding Window Store ──────────────────────────────────────────

interface WindowEntry {
  timestamps: number[];
}

const memoryStore = new Map<string, WindowEntry>();

// Periodic garbage collection every 2 minutes to prevent memory leak
const CLEANUP_INTERVAL_MS = 2 * 60 * 1000;
let lastCleanup = Date.now();

function purgeExpiredEntries(now: number) {
  if (now - lastCleanup < CLEANUP_INTERVAL_MS) return;
  lastCleanup = now;

  const maxTtlMs = 15 * 60 * 1000; // 15 minutes max window
  for (const [key, entry] of memoryStore.entries()) {
    const validTimestamps = entry.timestamps.filter((ts) => now - ts < maxTtlMs);
    if (validTimestamps.length === 0) {
      memoryStore.delete(key);
    } else {
      entry.timestamps = validTimestamps;
    }
  }
}

/**
 * Check and record a rate limit attempt using in-memory sliding window
 */
export function checkMemoryRateLimit(
  key: string,
  config: RateLimitConfig
): RateLimitResult {
  const now = Date.now();
  purgeExpiredEntries(now);

  const windowMs = config.windowSeconds * 1000;
  const cutoff = now - windowMs;

  let entry = memoryStore.get(key);
  if (!entry) {
    entry = { timestamps: [] };
    memoryStore.set(key, entry);
  }

  // Filter timestamps within current sliding window
  entry.timestamps = entry.timestamps.filter((ts) => ts > cutoff);

  const currentCount = entry.timestamps.length;
  const oldestTimestamp = entry.timestamps[0] ?? now;
  const resetSeconds = Math.max(1, Math.ceil((oldestTimestamp + windowMs - now) / 1000));

  if (currentCount >= config.limit) {
    return {
      success: false,
      limit: config.limit,
      remaining: 0,
      resetSeconds,
    };
  }

  // Record this attempt
  entry.timestamps.push(now);

  return {
    success: true,
    limit: config.limit,
    remaining: config.limit - entry.timestamps.length,
    resetSeconds,
  };
}

/**
 * Optional distributed check with Upstash Redis REST API
 * Falls back to in-memory sliding window if Redis is not configured or fails.
 */
export async function checkRateLimit(
  key: string,
  config: RateLimitConfig
): Promise<RateLimitResult> {
  const redisUrl = process.env.UPSTASH_REDIS_REST_URL;
  const redisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!redisUrl || !redisToken) {
    return checkMemoryRateLimit(key, config);
  }

  try {
    const now = Date.now();
    const windowMs = config.windowSeconds * 1000;
    const redisKey = `rl:${key}`;

    // Sliding window via Redis Sorted Set (ZSET)
    const pipelineReq = [
      ["ZREMRANGEBYSCORE", redisKey, 0, now - windowMs],
      ["ZADD", redisKey, now, `${now}-${Math.random()}`],
      ["ZCARD", redisKey],
      ["EXPIRE", redisKey, config.windowSeconds * 2],
    ];

    const response = await fetch(`${redisUrl}/pipeline`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${redisToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(pipelineReq),
      cache: "no-store",
    });

    if (!response.ok) {
      return checkMemoryRateLimit(key, config);
    }

    const results = await response.json();
    const count = Number(results[2]?.result ?? 1);

    const success = count <= config.limit;
    const remaining = Math.max(0, config.limit - count);

    return {
      success,
      limit: config.limit,
      remaining,
      resetSeconds: config.windowSeconds,
    };
  } catch (err) {
    console.warn("[RateLimiter] Upstash Redis failed, falling back to in-memory:", err);
    return checkMemoryRateLimit(key, config);
  }
}

/**
 * Extract trustworthy client IP address across reverse proxies (Cloudflare, Vercel, Nginx)
 */
export function getClientIp(headers: Headers): string {
  // Cloudflare Connecting IP
  const cfIp = headers.get("cf-connecting-ip");
  if (cfIp) return cfIp.trim();

  // Standard X-Forwarded-For (first entry is the client)
  const forwardedFor = headers.get("x-forwarded-for");
  if (forwardedFor) {
    const firstIp = forwardedFor.split(",")[0]?.trim();
    if (firstIp) return firstIp;
  }

  // X-Real-IP
  const realIp = headers.get("x-real-ip");
  if (realIp) return realIp.trim();

  return "127.0.0.1";
}

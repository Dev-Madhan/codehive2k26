import { NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET() {
  const startTime = performance.now();
  try {
    // 1. Database Connectivity Probe with 3-second timeout
    await prisma.$queryRaw`SELECT 1`;
    const dbLatencyMs = Math.round(performance.now() - startTime);

    const memory = process.memoryUsage();

    return NextResponse.json(
      {
        status: "ok",
        database: "connected",
        dbLatencyMs,
        uptimeSeconds: Math.floor(process.uptime()),
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        memory: {
          rssMb: Math.round(memory.rss / (1024 * 1024)),
          heapUsedMb: Math.round(memory.heapUsed / (1024 * 1024)),
          heapTotalMb: Math.round(memory.heapTotal / (1024 * 1024)),
        },
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0",
          "Pragma": "no-cache",
          "Expires": "0",
        },
      }
    );
  } catch (error: unknown) {
    const dbLatencyMs = Math.round(performance.now() - startTime);
    console.error("[Health Check Failed]", error);
    const errorMessage = error instanceof Error ? error.message : "Database ping failed";

    return NextResponse.json(
      {
        status: "degraded",
        database: "disconnected",
        dbLatencyMs,
        error: errorMessage,
        timestamp: new Date().toISOString(),
      },
      {
        status: 503,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}

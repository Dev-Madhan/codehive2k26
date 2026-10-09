import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import { requireAdminSession } from "@/lib/auth-guard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const authCheck = await requireAdminSession(req.headers);
    if (authCheck.error) {
      const statusCode = authCheck.error.code === "UNAUTHORIZED" ? 401 : 403;
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: statusCode }
      );
    }

    const [events, soloCounts, teamsWithMemberCounts] = await Promise.all([
      prisma.event.findMany({
        include: {
          category: {
            select: {
              id: true,
              name: true,
              slug: true,
            },
          },
          _count: {
            select: {
              registrations: true,
              teams: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.registration.groupBy({
        by: ["eventId"],
        where: { teamId: null },
        _count: { _all: true },
      }),
      prisma.team.findMany({
        select: {
          eventId: true,
          _count: {
            select: { members: true },
          },
        },
      }),
    ]);

    const soloCountMap = new Map<string, number>();
    for (const item of soloCounts) {
      soloCountMap.set(item.eventId, item._count._all);
    }

    const teamMemberCountMap = new Map<string, number>();
    for (const team of teamsWithMemberCounts) {
      teamMemberCountMap.set(
        team.eventId,
        (teamMemberCountMap.get(team.eventId) || 0) + team._count.members
      );
    }

    const eventsWithHeadcount = events.map((e) => {
      const candidateCount =
        (teamMemberCountMap.get(e.id) || 0) + (soloCountMap.get(e.id) || 0);

      return {
        ...e,
        candidateCount,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: eventsWithHeadcount,
        count: eventsWithHeadcount.length,
        timestamp: new Date().toISOString(),
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
    console.error("API /api/admin/events error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch realtime event data.";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message,
        },
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}

import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const events = await prisma.event.findMany({
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
    });

    // Compute actual physical candidate headcounts (team members + solo registrations)
    const eventsWithHeadcount = await Promise.all(
      events.map(async (e) => {
        const [teamMembersCount, soloRegistrationsCount] = await Promise.all([
          prisma.teamMember.count({
            where: { team: { eventId: e.id } },
          }),
          prisma.registration.count({
            where: { eventId: e.id, teamId: null },
          }),
        ]);

        const candidateCount = teamMembersCount + soloRegistrationsCount;

        return {
          ...e,
          candidateCount,
        };
      })
    );

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
  } catch (error: any) {
    console.error("API /api/admin/events error:", error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: error?.message || "Failed to fetch realtime event data.",
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

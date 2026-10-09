import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { requireAdminSession } from "@/lib/auth-guard";
import { logAuditEvent } from "@/lib/audit";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function POST(req: NextRequest) {
  try {
    const authCheck = await requireAdminSession(req.headers);
    if (authCheck.error) {
      const statusCode = authCheck.error.code === "UNAUTHORIZED" ? 401 : 403;
      return NextResponse.json(
        { success: false, error: authCheck.error },
        { status: statusCode }
      );
    }

    const body = await req.json();
    const {
      eventId,
      transport,
      route,
      checkIn,
      format,
      search,
      preview = false,
    } = body;

    const where: Prisma.RegistrationWhereInput = {};

    // 1. Event Filter
    if (eventId && eventId !== "ALL") {
      where.eventId = eventId;
    }

    // 2. Transport Filter
    if (transport === "BUS_ONLY") {
      where.transportOptIn = true;
    } else if (transport === "SELF") {
      where.transportOptIn = false;
    }

    // 3. Route Filter
    if (route && route !== "ALL" && transport !== "SELF") {
      where.pickupRoute = {
        contains: route,
        mode: "insensitive",
      };
    }

    // 4. Check-in Filter
    if (checkIn === "CHECKED_IN") {
      where.checkIn = { isNot: null };
    } else if (checkIn === "PENDING") {
      where.checkIn = { is: null };
    }

    // 5. Team vs Solo Format Filter
    if (format === "TEAM") {
      where.teamId = { not: null };
    } else if (format === "SOLO") {
      where.teamId = null;
    }

    // 6. Search Keyword Filter
    if (search && typeof search === "string" && search.trim()) {
      const q = search.trim();
      where.OR = [
        { registrationNumber: { contains: q, mode: "insensitive" } },
        { participant: { name: { contains: q, mode: "insensitive" } } },
        { participant: { email: { contains: q, mode: "insensitive" } } },
        { participant: { phone: { contains: q, mode: "insensitive" } } },
        { participant: { college: { contains: q, mode: "insensitive" } } },
        { team: { name: { contains: q, mode: "insensitive" } } },
      ];
    }

    // If only preview count requested
    if (preview) {
      const count = await prisma.registration.count({ where });
      return NextResponse.json({ success: true, count });
    }

    // Full export data fetch
    const [registrations, events] = await Promise.all([
      prisma.registration.findMany({
        where,
        include: {
          event: {
            select: {
              id: true,
              name: true,
              slug: true,
              venue: true,
              startAt: true,
            },
          },
          participant: {
            select: {
              id: true,
              name: true,
              email: true,
              phone: true,
              college: true,
              department: true,
              year: true,
            },
          },
          team: {
            select: {
              id: true,
              name: true,
              members: {
                select: {
                  id: true,
                  name: true,
                  phone: true,
                  email: true,
                  college: true,
                  department: true,
                  year: true,
                  transportOptIn: true,
                  pickupRoute: true,
                  pickupStop: true,
                  pickupLandmark: true,
                },
              },
            },
          },
          checkIn: {
            select: {
              checkedInAt: true,
            },
          },
        },
        orderBy: { createdAt: "desc" },
      }),
      prisma.event.findMany({
        include: {
          category: {
            select: { name: true },
          },
          _count: {
            select: {
              registrations: true,
            },
          },
        },
        orderBy: { name: "asc" },
      }),
    ]);

    // Build event analytics summaries
    const summaryList = await Promise.all(
      events.map(async (ev) => {
        const checkedInCount = await prisma.checkIn.count({
          where: {
            registration: {
              eventId: ev.id,
            },
          },
        });

        const busCommutersAgg = await prisma.registration.aggregate({
          where: {
            eventId: ev.id,
            transportOptIn: true,
          },
          _sum: {
            passengersCount: true,
          },
        });
        const busCommutersCount = busCommutersAgg._sum.passengersCount || 0;

        const regCount = ev._count.registrations;
        const turnoutRate = regCount > 0 ? Math.round((checkedInCount / regCount) * 100) : 0;

        return {
          id: ev.id,
          name: ev.name,
          category: ev.category?.name || "General",
          registrationsCount: regCount,
          checkedInCount,
          turnoutRate,
          busCommutersCount,
          status: ev.status,
        };
      })
    );

    await logAuditEvent({
      actorId: authCheck.user.id,
      action: "DATA_EXPORT",
      entity: "Report",
      entityId: eventId || "ALL",
      metadata: {
        format,
        count: registrations.length,
        transport,
        route,
        checkIn,
      },
    });

    return NextResponse.json({
      success: true,
      data: {
        registrations,
        summaryList,
        count: registrations.length,
      },
    });
  } catch (error: unknown) {
    console.error("Export API error:", error);
    const message = error instanceof Error ? error.message : "Failed to fetch export dataset.";
    return NextResponse.json(
      {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message,
        },
      },
      { status: 500 }
    );
  }
}

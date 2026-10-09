import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";
import { auth } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    // 1. Cybersecurity Guard: Restrict access strictly to authenticated ADMIN sessions
    const session = await auth.api.getSession({
      headers: req.headers,
    });

    const userRole = (session?.user as { role?: string })?.role?.toUpperCase();
    if (!session?.user || userRole !== "ADMIN") {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: "UNAUTHORIZED",
            message: "Administrative privileges required to access participant directory data.",
          },
        },
        { status: 401 }
      );
    }

    // 2. Parse & Bounds-Check Query Parameters (Anti-Memory Exhaustion)
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");
    const eventSlug = searchParams.get("eventSlug");
    const limitParam = searchParams.get("limit");
    // Maximum safe bounding: 500 records per request to prevent DB starvation
    const limit = limitParam ? Math.min(Math.max(parseInt(limitParam, 10), 1), 500) : undefined;

    const where: Prisma.RegistrationWhereInput = {};
    if (eventId && eventId !== "ALL") {
      where.eventId = eventId;
    } else if (eventSlug && eventSlug !== "ALL") {
      where.event = { slug: eventSlug };
    }

    const registrations = await prisma.registration.findMany({
      where,
      include: {
        event: {
          select: {
            id: true,
            name: true,
            slug: true,
            venue: true,
            startAt: true,
            isTeamEvent: true,
            minTeamSize: true,
            maxTeamSize: true,
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
            imageUrl: true,
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
                collegeIdUrl: true,
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
      take: limit,
    });

    return NextResponse.json(
      {
        success: true,
        data: registrations,
        count: registrations.length,
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
  } catch (error) {
    console.error("API /api/registrations error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch registrations." } },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, no-cache, must-revalidate",
        },
      }
    );
  }
}

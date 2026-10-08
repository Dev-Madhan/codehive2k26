import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const slug = searchParams.get("slug");
    const eventId = searchParams.get("eventId");

    if (slug || eventId) {
      const where: any = slug ? { slug } : { id: eventId };
      const event = await prisma.event.findFirst({
        where,
        select: {
          id: true,
          name: true,
          slug: true,
          status: true,
          registrationOpen: true,
          registrationDeadline: true,
          capacity: true,
        },
      });

      if (!event) {
        return NextResponse.json(
          { success: false, error: "Event not found" },
          { status: 404 }
        );
      }

      const isOpen =
        event.registrationOpen !== false &&
        event.status !== "REGISTRATION_CLOSED" &&
        new Date() <= new Date(event.registrationDeadline);

      return NextResponse.json(
        {
          success: true,
          data: {
            ...event,
            isOpen,
          },
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
    }

    // Return status for all events
    const events = await prisma.event.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
        status: true,
        registrationOpen: true,
        registrationDeadline: true,
        capacity: true,
      },
    });

    const statusMap: Record<string, {
      id: string;
      name: string;
      slug: string;
      isOpen: boolean;
      status: string;
      capacity: number;
    }> = {};

    events.forEach((e) => {
      const isOpen =
        e.registrationOpen !== false &&
        e.status !== "REGISTRATION_CLOSED" &&
        new Date() <= new Date(e.registrationDeadline);

      statusMap[e.slug] = {
        id: e.id,
        name: e.name,
        slug: e.slug,
        isOpen,
        status: e.status,
        capacity: e.capacity,
      };
    });

    return NextResponse.json(
      {
        success: true,
        data: statusMap,
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
    console.error("API /api/events/gate error:", error);
    return NextResponse.json(
      {
        success: false,
        error: error?.message || "Failed to check event gate status.",
      },
      { status: 500 }
    );
  }
}

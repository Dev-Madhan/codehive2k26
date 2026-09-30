import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const eventId = searchParams.get("eventId");

    const registrations = await prisma.registration.findMany({
      where: eventId ? { eventId } : undefined,
      select: {
        id: true,
        registrationNumber: true,
        status: true,
        checkedIn: true,
        createdAt: true,
        participant: {
          select: {
            name: true,
            college: true,
          },
        },
        event: {
          select: {
            name: true,
            slug: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 100,
    });

    return NextResponse.json({ success: true, data: registrations });
  } catch (error) {
    console.error("API /api/registrations error:", error);
    return NextResponse.json(
      { success: false, error: { code: "INTERNAL_ERROR", message: "Failed to fetch registrations." } },
      { status: 500 }
    );
  }
}

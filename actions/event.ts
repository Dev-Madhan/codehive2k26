"use server";

import prisma from "@/lib/prisma";
import { eventSchema, EventInput } from "@/lib/validations/event";
import { ActionResponse } from "@/types";
import { Event } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getEvents(): Promise<ActionResponse<Event[]>> {
  try {
    const events = await prisma.event.findMany({
      where: { status: "PUBLISHED" },
      orderBy: { startAt: "asc" },
      include: {
        category: true,
        _count: {
          select: { registrations: true },
        },
      },
    });

    return { success: true, data: events };
  } catch (error) {
    console.error("getEvents error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch events." },
    };
  }
}

export async function getEventBySlug(slug: string): Promise<ActionResponse<Event>> {
  try {
    const event = await prisma.event.findUnique({
      where: { slug },
      include: {
        category: true,
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      return {
        success: false,
        error: { code: "EVENT_NOT_FOUND", message: "Event not found." },
      };
    }

    return { success: true, data: event };
  } catch (error) {
    console.error("getEventBySlug error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch event." },
    };
  }
}

export async function createEvent(input: EventInput): Promise<ActionResponse<Event>> {
  const parsed = eventSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        code: "INVALID_INPUT",
        message: "Invalid event data.",
        details: parsed.error.format(),
      },
    };
  }

  try {
    const event = await prisma.event.create({
      data: parsed.data,
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");

    return { success: true, data: event };
  } catch (error) {
    console.error("createEvent error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to create event." },
    };
  }
}

"use server";

import prisma from "@/lib/prisma";
import { eventSchema, EventInput } from "@/lib/validations/event";
import { ActionResponse } from "@/types";
import { Event, EventCategory, EventStatus } from "@prisma/client";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-guard";
import { logAuditEvent } from "@/lib/audit";

export async function getEvents(): Promise<ActionResponse<Event[]>> {
  try {
    const events = await prisma.event.findMany({
      where: {
        status: {
          not: "DRAFT",
        },
      },
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
  const authCheck = await requireAdminSession();
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

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
      data: {
        ...parsed.data,
        status: (parsed.data as { status?: EventStatus }).status || "PUBLISHED",
      },
    });

    await logAuditEvent({
      actorId: authCheck.user.id,
      action: "EVENT_CREATE",
      entity: "Event",
      entityId: event.id,
      metadata: { name: event.name, slug: event.slug },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    revalidatePath("/admin/registrations");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/reports");

    return { success: true, data: event };
  } catch (error) {
    console.error("createEvent error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to create event." },
    };
  }
}

export async function deleteEventBySlug(slug: string): Promise<ActionResponse<{ count: number }>> {
  const authCheck = await requireAdminSession();
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

  try {
    const deleted = await prisma.event.delete({
      where: { slug },
    });

    await logAuditEvent({
      actorId: authCheck.user.id,
      action: "EVENT_DELETE",
      entity: "Event",
      entityId: deleted.id,
      metadata: { slug },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    revalidatePath("/admin/registrations");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/reports");

    return { success: true, data: { count: 1 } };
  } catch (error) {
    console.error("deleteEventBySlug error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to delete event by slug." },
    };
  }
}

export async function updateEvent(
  id: string,
  input: Partial<EventInput> & { status?: EventStatus }
): Promise<ActionResponse<Event>> {
  const authCheck = await requireAdminSession();
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

  try {
    const existing = await prisma.event.findUnique({ where: { id } });
    if (!existing) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Event not found." },
      };
    }

    const updated = await prisma.event.update({
      where: { id },
      data: {
        ...(input.name !== undefined && { name: input.name }),
        ...(input.slug !== undefined && { slug: input.slug }),
        ...(input.description !== undefined && { description: input.description }),
        ...(input.venue !== undefined && { venue: input.venue }),
        ...(input.startAt !== undefined && { startAt: new Date(input.startAt) }),
        ...(input.endAt !== undefined && { endAt: new Date(input.endAt) }),
        ...(input.registrationDeadline !== undefined && {
          registrationDeadline: new Date(input.registrationDeadline),
        }),
        ...(input.registrationOpen !== undefined && {
          registrationOpen: input.registrationOpen,
        }),
        ...(input.isTeamEvent !== undefined && { isTeamEvent: input.isTeamEvent }),
        ...(input.minTeamSize !== undefined && { minTeamSize: Number(input.minTeamSize) }),
        ...(input.maxTeamSize !== undefined && { maxTeamSize: Number(input.maxTeamSize) }),
        ...(input.categoryId !== undefined && { categoryId: input.categoryId || null }),
        ...(input.posterUrl !== undefined && { posterUrl: input.posterUrl || null }),
        ...(input.status !== undefined && { status: input.status }),
      },
    });

    await logAuditEvent({
      actorId: authCheck.user.id,
      action: "EVENT_UPDATE",
      entity: "Event",
      entityId: updated.id,
      metadata: { slug: updated.slug, changes: Object.keys(input) },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    revalidatePath("/admin/registrations");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/reports");
    revalidatePath("/dashboard");

    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error("updateEvent error:", error);
    const message = error instanceof Error ? error.message : "Failed to update event.";
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message },
    };
  }
}

export async function toggleEventRegistration(
  id: string,
  isOpen: boolean
): Promise<ActionResponse<Event>> {
  const authCheck = await requireAdminSession();
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

  try {
    const updated = await prisma.event.update({
      where: { id },
      data: {
        registrationOpen: isOpen,
        status: isOpen ? "REGISTRATION_OPEN" : "REGISTRATION_CLOSED",
      },
    });

    await logAuditEvent({
      actorId: authCheck.user.id,
      action: "EVENT_UPDATE",
      entity: "Event",
      entityId: updated.id,
      metadata: { registrationOpen: isOpen },
    });

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath(`/events/${updated.slug}`);
    revalidatePath("/admin/events");
    revalidatePath("/admin/registrations");
    revalidatePath("/admin/dashboard");
    revalidatePath("/dashboard");

    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error("toggleEventRegistration error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to toggle registration." },
    };
  }
}

export async function updateEventRegistrationGate(
  id: string,
  params: {
    isOpen: boolean;
    status?: EventStatus;
    capacity?: number;
  }
): Promise<ActionResponse<Event>> {
  const authCheck = await requireAdminSession();
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

  try {
    const updated = await prisma.event.update({
      where: { id },
      data: {
        registrationOpen: params.isOpen,
        status: params.status || (params.isOpen ? "REGISTRATION_OPEN" : "REGISTRATION_CLOSED"),
        ...(params.capacity !== undefined ? { capacity: params.capacity } : {}),
      },
    });

    await logAuditEvent({
      actorId: authCheck.user.id,
      action: "EVENT_UPDATE",
      entity: "Event",
      entityId: updated.id,
      metadata: params,
    });

    revalidatePath("/");
    revalidatePath("/events");
    revalidatePath(`/events/${updated.slug}`);
    revalidatePath("/admin/events");
    revalidatePath("/admin/registrations");
    revalidatePath("/admin/dashboard");
    revalidatePath("/dashboard");

    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error("updateEventRegistrationGate error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to update registration gate." },
    };
  }
}

export async function updateEventStatus(
  id: string,
  status: EventStatus
): Promise<ActionResponse<Event>> {
  const authCheck = await requireAdminSession();
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

  try {
    const updated = await prisma.event.update({
      where: { id },
      data: {
        status,
        registrationOpen: status === "REGISTRATION_OPEN" || status === "PUBLISHED",
      },
    });

    await logAuditEvent({
      actorId: authCheck.user.id,
      action: "EVENT_UPDATE",
      entity: "Event",
      entityId: updated.id,
      metadata: { status },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    revalidatePath("/admin/registrations");
    revalidatePath("/admin/dashboard");
    revalidatePath("/dashboard");

    return { success: true, data: updated };
  } catch (error: unknown) {
    console.error("updateEventStatus error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to update status." },
    };
  }
}

export async function getEventCategories(): Promise<ActionResponse<EventCategory[]>> {
  try {
    const categories = await prisma.eventCategory.findMany({
      orderBy: { name: "asc" },
    });
    return { success: true, data: categories };
  } catch (error: unknown) {
    console.error("getEventCategories error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch event categories." },
    };
  }
}

export async function deleteEvent(id: string): Promise<ActionResponse<{ count: number }>> {
  const authCheck = await requireAdminSession();
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

  try {
    const deleted = await prisma.event.delete({
      where: { id },
    });

    await logAuditEvent({
      actorId: authCheck.user.id,
      action: "EVENT_DELETE",
      entity: "Event",
      entityId: deleted.id,
      metadata: { id },
    });

    revalidatePath("/events");
    revalidatePath("/admin/events");
    revalidatePath("/admin/registrations");
    revalidatePath("/admin/dashboard");
    revalidatePath("/dashboard");

    return { success: true, data: { count: 1 } };
  } catch (error) {
    console.error("deleteEvent error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to delete event." },
    };
  }
}



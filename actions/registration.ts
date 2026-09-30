"use server";

import prisma from "@/lib/prisma";
import { registrationSchema, RegistrationInput } from "@/lib/validations/registration";
import { generateQrToken, generateRegistrationNumber, generateQrDataUrl } from "@/lib/qr";
import { sendRegistrationConfirmationEmail } from "@/lib/resend";
import { ActionResponse } from "@/types";
import { revalidatePath } from "next/cache";

export async function createRegistration(
  userId: string,
  input: RegistrationInput
): Promise<ActionResponse<{ registrationNumber: string; qrToken: string }>> {
  const parsed = registrationSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: {
        code: "INVALID_INPUT",
        message: "Invalid registration details.",
        details: parsed.error.format(),
      },
    };
  }

  const { eventId, name, email, phone, college, department, year, imageUrl } = parsed.data;

  try {
    // 1. Validate Event & Capacity
    const event = await prisma.event.findUnique({
      where: { id: eventId },
      include: {
        _count: {
          select: { registrations: true },
        },
      },
    });

    if (!event) {
      return {
        success: false,
        error: { code: "EVENT_NOT_FOUND", message: "Event does not exist." },
      };
    }

    if (!event.registrationOpen || new Date() > event.registrationDeadline) {
      return {
        success: false,
        error: { code: "EVENT_CLOSED", message: "Registration for this event is closed." },
      };
    }

    if (event._count.registrations >= event.capacity) {
      return {
        success: false,
        error: { code: "EVENT_FULL", message: "Event capacity has been reached." },
      };
    }

    // 2. Database Transaction: Create/Update Participant + Create Registration
    const registrationNumber = generateRegistrationNumber();
    const qrToken = generateQrToken();

    const result = await prisma.$transaction(async (tx) => {
      // Upsert Participant
      const participant = await tx.participant.upsert({
        where: { userId },
        update: {
          name,
          phone,
          college,
          department,
          year,
          imageUrl: imageUrl || undefined,
        },
        create: {
          userId,
          name,
          email,
          phone,
          college,
          department,
          year,
          imageUrl: imageUrl || undefined,
        },
      });

      // Check Duplicate Active Registration
      const existing = await tx.registration.findUnique({
        where: {
          participant_event_unique: {
            participantId: participant.id,
            eventId,
          },
        },
      });

      if (existing) {
        throw new Error("DUPLICATE_REGISTRATION");
      }

      // Create Registration
      const registration = await tx.registration.create({
        data: {
          registrationNumber,
          participantId: participant.id,
          eventId,
          qrToken,
          status: "CONFIRMED",
          paymentStatus: "COMPLETED",
        },
      });

      return { registration, participant };
    });

    // 3. Trigger confirmation email asynchronously
    generateQrDataUrl(qrToken)
      .then((qrDataUrl) => {
        return sendRegistrationConfirmationEmail({
          to: email,
          participantName: name,
          eventName: event.name,
          registrationNumber,
          venue: event.venue,
          date: event.startAt.toLocaleDateString("en-IN", {
            day: "numeric",
            month: "short",
            year: "numeric",
          }),
          qrCodeUrl: qrDataUrl,
        });
      })
      .catch((err) => console.error("Email notification dispatch error:", err));

    revalidatePath(`/events/${event.slug}`);
    revalidatePath("/dashboard");

    return {
      success: true,
      data: {
        registrationNumber,
        qrToken,
      },
      message: "Registration successful!",
    };
  } catch (error: any) {
    if (error.message === "DUPLICATE_REGISTRATION") {
      return {
        success: false,
        error: {
          code: "DUPLICATE_REGISTRATION",
          message: "You are already registered for this event.",
        },
      };
    }

    console.error("createRegistration error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to complete registration." },
    };
  }
}

"use server";

import prisma from "@/lib/prisma";
import { participantProfileSchema, ParticipantProfileInput } from "@/lib/validations/participant";
import { ActionResponse } from "@/types";
import { Participant } from "@prisma/client";
import { revalidatePath } from "next/cache";

export async function getParticipantProfile(userId: string): Promise<ActionResponse<Participant | null>> {
  try {
    const participant = await prisma.participant.findUnique({
      where: { userId },
      include: {
        registrations: {
          include: {
            event: true,
          },
        },
      },
    });

    return { success: true, data: participant };
  } catch (error) {
    console.error("getParticipantProfile error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to fetch participant profile." },
    };
  }
}

export async function updateParticipantProfile(
  userId: string,
  input: ParticipantProfileInput
): Promise<ActionResponse<Participant>> {
  const parsed = participantProfileSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: { code: "INVALID_INPUT", message: "Invalid profile data.", details: parsed.error.format() },
    };
  }

  try {
    const updated = await prisma.participant.update({
      where: { userId },
      data: parsed.data,
    });

    revalidatePath("/dashboard");
    return { success: true, data: updated, message: "Profile updated successfully." };
  } catch (error) {
    console.error("updateParticipantProfile error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to update profile." },
    };
  }
}

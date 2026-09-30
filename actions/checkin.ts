"use server";

import prisma from "@/lib/prisma";
import { checkInSchema, CheckInInput } from "@/lib/validations/checkin";
import { ActionResponse } from "@/types";
import { CheckInResult } from "@/types/registration";

export async function checkInParticipant(
  staffUserId: string,
  input: CheckInInput
): Promise<ActionResponse<CheckInResult>> {
  const parsed = checkInSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: { code: "INVALID_INPUT", message: "Invalid QR code payload." },
    };
  }

  const { qrToken, deviceInfo } = parsed.data;

  try {
    // 1. Verify Staff User
    const staff = await prisma.user.findUnique({
      where: { id: staffUserId },
    });

    if (!staff || (staff.role !== "STAFF" && staff.role !== "ORGANIZER" && staff.role !== "SUPER_ADMIN")) {
      return {
        success: false,
        error: { code: "FORBIDDEN", message: "Only authorized staff can perform check-in." },
      };
    }

    // 2. Find Registration by QR Token
    const registration = await prisma.registration.findUnique({
      where: { qrToken },
      include: {
        participant: true,
        event: true,
        checkIn: true,
      },
    });

    if (!registration) {
      return {
        success: false,
        error: { code: "INVALID_QR", message: "Registration not found for this QR token." },
      };
    }

    // 3. Check Registration Status
    if (registration.status !== "CONFIRMED") {
      return {
        success: false,
        error: {
          code: "FORBIDDEN",
          message: `Cannot check in. Registration status is ${registration.status}.`,
        },
      };
    }

    // 4. Duplicate Check-in Prevention
    if (registration.checkedIn || registration.checkIn) {
      return {
        success: false,
        error: {
          code: "ALREADY_CHECKED_IN",
          message: "Participant is already checked in!",
        },
      };
    }

    // 5. Record Check-in within Transaction
    const checkInRecord = await prisma.$transaction(async (tx) => {
      await tx.registration.update({
        where: { id: registration.id },
        data: {
          checkedIn: true,
          status: "ATTENDED",
        },
      });

      return await tx.checkIn.create({
        data: {
          registrationId: registration.id,
          staffId: staff.id,
          deviceInfo: deviceInfo || "Web Staff Scanner",
        },
      });
    });

    return {
      success: true,
      data: {
        registrationNumber: registration.registrationNumber,
        participantName: registration.participant.name,
        eventName: registration.event.name,
        checkedInAt: checkInRecord.checkedInAt,
      },
      message: "Participant checked in successfully!",
    };
  } catch (error) {
    console.error("checkInParticipant error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Check-in processing failed." },
    };
  }
}

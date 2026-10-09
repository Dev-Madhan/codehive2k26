"use server";

import prisma from "@/lib/prisma";
import { checkInSchema, CheckInInput } from "@/lib/validations/checkin";
import { ActionResponse } from "@/types";
import { CheckInResult } from "@/types/registration";
import { revalidatePath } from "next/cache";
import { requireAdminSession } from "@/lib/auth-guard";
import { logAuditEvent } from "@/lib/audit";

export async function checkInParticipant(
  staffUserId: string,
  input: CheckInInput
): Promise<ActionResponse<CheckInResult>> {
  const authCheck = await requireAdminSession();
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

  const parsed = checkInSchema.safeParse(input);
  if (!parsed.success) {
    return {
      success: false,
      error: { code: "INVALID_INPUT", message: "Invalid pass code or QR payload." },
    };
  }

  const { qrToken, deviceInfo } = parsed.data;
  const cleanToken = qrToken.trim();

  try {
    const staff = authCheck.user;

    // 2. Find Registration by Registration Number OR QR Token (support raw code or scanned URL)
    let tokenToMatch = cleanToken;
    const codeMatch = cleanToken.match(/CH26-[A-Z0-9_-]+/i);
    if (codeMatch) {
      tokenToMatch = codeMatch[0];
    }

    const registration = await prisma.registration.findFirst({
      where: {
        OR: [
          { qrToken: tokenToMatch },
          { qrToken: tokenToMatch.toUpperCase() },
          { registrationNumber: tokenToMatch },
          { registrationNumber: tokenToMatch.toUpperCase() },
          { qrToken: cleanToken },
          { registrationNumber: cleanToken },
        ],
      },
      include: {
        participant: true,
        event: true,
        checkIn: {
          include: {
            staff: {
              select: {
                name: true,
                email: true,
              },
            },
          },
        },
        team: {
          include: {
            members: true,
          },
        },
      },
    });

    if (!registration) {
      return {
        success: false,
        error: {
          code: "INVALID_QR",
          message: `No active registration found for pass code "${tokenToMatch}". Please double check the code.`,
        },
      };
    }

    // 3. Inspect Mode (Preview without mutating check-in status)
    if (parsed.data.inspectOnly) {
      return {
        success: true,
        data: {
          registrationNumber: registration.registrationNumber,
          participantName: registration.participant.name,
          participantEmail: registration.participant.email,
          participantPhone: registration.participant.phone,
          eventName: registration.event.name,
          checkedInAt: registration.checkIn?.checkedInAt || new Date(),
          alreadyCheckedIn: Boolean(registration.checkedIn || registration.checkIn),
          checkedInBy: registration.checkIn?.staff?.name || null,
          teamName: registration.team?.name || null,
          college: registration.participant.college,
          department: registration.participant.department,
          teamMembers: registration.team?.members?.map((m) => m.name) || [],
          transportOptIn: registration.transportOptIn,
          pickupRoute: registration.pickupRoute,
          pickupStop: registration.pickupStop,
          passengersCount: registration.passengersCount,
        },
        message: "Pass inspected successfully (View Mode).",
      };
    }

    // 4. Check Registration Status
    if (registration.status !== "CONFIRMED" && registration.status !== "ATTENDED") {
      return {
        success: false,
        error: {
          code: "FORBIDDEN",
          message: `Cannot check in. Registration status is ${registration.status}.`,
        },
      };
    }

    // 5. Duplicate Check-in Prevention with exact auditor details
    if (registration.checkedIn || registration.checkIn) {
      const timeStr = registration.checkIn?.checkedInAt
        ? new Date(registration.checkIn.checkedInAt).toLocaleTimeString("en-IN", {
            hour: "2-digit",
            minute: "2-digit",
          })
        : "earlier";
      const staffName = registration.checkIn?.staff?.name || "Gate Staff";

      return {
        success: false,
        error: {
          code: "ALREADY_CHECKED_IN",
          message: `Attendee "${registration.participant.name}" (${registration.registrationNumber}) was ALREADY checked in at ${timeStr} by ${staffName}!`,
        },
      };
    }

    // 6. Record Check-in within Transaction
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

    // 7. Record Non-blocking Audit Log
    await logAuditEvent({
      actorId: staff.id,
      action: "CHECK_IN",
      entity: "Registration",
      entityId: registration.id,
      metadata: {
        registrationNumber: registration.registrationNumber,
        participantName: registration.participant.name,
        eventName: registration.event.name,
        deviceInfo: deviceInfo || "Web Staff Scanner",
      },
    });

    revalidatePath("/admin/registrations");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/check-in");
    revalidatePath("/admin/reports");
    revalidatePath(`/registration/${registration.registrationNumber}`);
    revalidatePath(`/registration/${registration.id}`);

    return {
      success: true,
      data: {
        registrationNumber: registration.registrationNumber,
        participantName: registration.participant.name,
        participantEmail: registration.participant.email,
        participantPhone: registration.participant.phone,
        eventName: registration.event.name,
        checkedInAt: checkInRecord.checkedInAt,
        alreadyCheckedIn: false,
        checkedInBy: staff.name,
        teamName: registration.team?.name || null,
        college: registration.participant.college,
        department: registration.participant.department,
        teamMembers: registration.team?.members?.map((m) => m.name) || [],
        transportOptIn: registration.transportOptIn,
        pickupRoute: registration.pickupRoute,
        pickupStop: registration.pickupStop,
        passengersCount: registration.passengersCount,
      },
      message: "Pass verified and attendee checked in successfully!",
    };
  } catch (error: unknown) {
    console.error("checkInParticipant error:", error);
    const message = error instanceof Error ? error.message : "Check-in processing failed.";
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message },
    };
  }
}

export async function getGateStats(): Promise<{
  totalConfirmed: number;
  totalCheckedIn: number;
  percentage: number;
}> {
  const authCheck = await requireAdminSession();
  if (authCheck.error) {
    return { totalConfirmed: 0, totalCheckedIn: 0, percentage: 0 };
  }

  try {
    const totalConfirmed = await prisma.registration.count({
      where: {
        status: { in: ["CONFIRMED", "ATTENDED"] },
      },
    });
    const totalCheckedIn = await prisma.registration.count({
      where: {
        OR: [{ checkedIn: true }, { status: "ATTENDED" }],
      },
    });
    const percentage =
      totalConfirmed > 0 ? Math.round((totalCheckedIn / totalConfirmed) * 100) : 0;

    return { totalConfirmed, totalCheckedIn, percentage };
  } catch (err: unknown) {
    console.error("getGateStats error:", err);
    return { totalConfirmed: 0, totalCheckedIn: 0, percentage: 0 };
  }
}

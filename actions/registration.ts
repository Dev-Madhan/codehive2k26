"use server";

import prisma from "@/lib/prisma";
import { registrationSchema, RegistrationInput } from "@/lib/validations/registration";
import { generateQrToken, generateRegistrationNumber, generateQrDataUrl } from "@/lib/qr";
import { sendRegistrationConfirmationEmail } from "@/lib/mailer";
import { validateVerificationToken } from "@/lib/otp-token";
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

  const {
    eventId,
    teamSize,
    teamName,
    name,
    email,
    phone,
    college,
    department,
    year,
    imageUrl,
    emailVerificationToken,
    members,
  } = parsed.data;

  // 1. Validate Email Verification Token
  const tokenResult = validateVerificationToken(emailVerificationToken);
  if (!tokenResult.valid) {
    return {
      success: false,
      error: {
        code: "INVALID_INPUT",
        message:
          "Email verification has expired or is invalid. Please verify your email again.",
      },
    };
  }

  if (tokenResult.email !== email.toLowerCase().trim()) {
    return {
      success: false,
      error: {
        code: "INVALID_INPUT",
        message:
          "Email verification token does not match the entered email address.",
      },
    };
  }

  try {
    // 2. Validate Event & Capacity
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

    // 3. Validate team size against event constraints
    const teamSizeNum = parseInt(teamSize);
    if (event.isTeamEvent) {
      if (teamSizeNum < event.minTeamSize || teamSizeNum > event.maxTeamSize) {
        return {
          success: false,
          error: {
            code: "INVALID_INPUT",
            message: `Team size must be between ${event.minTeamSize} and ${event.maxTeamSize} for this event.`,
          },
        };
      }
    }

    // 4. Database Transaction: Create/Update Participant + Team + Registration
    const registrationNumber = generateRegistrationNumber();
    const qrToken = generateQrToken();

    const result = await prisma.$transaction(async (tx) => {
      // 1. Resolve or provision User record for Better Auth foreign key integrity
      let user = await tx.user.findUnique({
        where: { email },
      });

      if (!user && userId && userId !== "user_placeholder_session_id") {
        user = await tx.user.findUnique({
          where: { id: userId },
        });
      }

      if (!user) {
        user = await tx.user.create({
          data: {
            name,
            email,
            role: "PARTICIPANT",
          },
        });
      }

      const effectiveUserId = user.id;

      // 2. Find or create Participant (Leader)
      let participant = await tx.participant.findUnique({
        where: { userId: effectiveUserId },
      });

      if (!participant) {
        participant = await tx.participant.findUnique({
          where: { email },
        });
      }

      if (participant) {
        participant = await tx.participant.update({
          where: { id: participant.id },
          data: {
            userId: effectiveUserId,
            name,
            email,
            phone,
            college,
            department,
            year,
            imageUrl: imageUrl || undefined,
          },
        });
      } else {
        participant = await tx.participant.create({
          data: {
            userId: effectiveUserId,
            name,
            email,
            phone,
            college,
            department,
            year,
            imageUrl: imageUrl || undefined,
          },
        });
      }

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

      let teamId: string | undefined;

      // Create Team if team size > 1
      if (teamSizeNum > 1) {
        const resolvedTeamName =
          teamName || `${name}'s Team`;

        // Check for duplicate team name in this event
        const existingTeam = await tx.team.findUnique({
          where: {
            name_eventId: {
              name: resolvedTeamName,
              eventId,
            },
          },
        });

        if (existingTeam) {
          throw new Error("DUPLICATE_TEAM_NAME");
        }

        const team = await tx.team.create({
          data: {
            name: resolvedTeamName,
            eventId,
            leaderId: participant.id,
          },
        });

        teamId = team.id;

        // Add leader as first team member
        await tx.teamMember.create({
          data: {
            teamId: team.id,
            name,
            phone,
            participantId: participant.id,
          },
        });

        // Add additional team members
        for (const member of members) {
          await tx.teamMember.create({
            data: {
              teamId: team.id,
              name: member.name,
              phone: member.phone,
            },
          });
        }
      }

      // Create Registration
      const registration = await tx.registration.create({
        data: {
          registrationNumber,
          participantId: participant.id,
          eventId,
          teamId: teamId || null,
          qrToken,
          status: "CONFIRMED",
          paymentStatus: "COMPLETED",
        },
      });

      return { registration, participant };
    });

    // 5. Trigger confirmation email asynchronously
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

    if (error.message === "DUPLICATE_TEAM_NAME") {
      return {
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "A team with this name already exists for this event. Please choose a different name.",
        },
      };
    }

    const isDev = process.env.NODE_ENV === "development";
    console.error("createRegistration error:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message:
          isDev && error?.message
            ? `Registration failed: ${error.message}`
            : "Failed to complete registration.",
      },
    };
  }
}

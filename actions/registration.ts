"use server";

import prisma from "@/lib/prisma";
import { registrationSchema, RegistrationInput } from "@/lib/validations/registration";
import { generateQrToken, generateRegistrationNumber, generateQrDataUrl, generateQrBuffer } from "@/lib/qr";
import { sendRegistrationConfirmationEmail } from "@/lib/mailer";
import { validateVerificationToken } from "@/lib/otp-token";
import { ActionResponse } from "@/types";
import { RegistrationSuccessPayload } from "@/types/registration";
import { revalidatePath } from "next/cache";

export async function createRegistration(
  userId: string,
  input: RegistrationInput
): Promise<ActionResponse<RegistrationSuccessPayload>> {
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
    transportOptIn,
    samePickupForTeam,
    pickupRoute,
    pickupStop,
    pickupLandmark,
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
    // 2. Validate Event (Entries are Unlimited)
    const event = await prisma.event.findUnique({
      where: { id: eventId },
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

    // 3. Strict 3-member team validation (No solo, No dual entries)
    const teamSizeNum = parseInt(teamSize, 10);
    if (teamSizeNum !== 3 || members.length !== 2) {
      return {
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "Event entries are strictly limited to teams of exactly 3 members (Leader + 2 Members). Solo and dual entries are not permitted.",
        },
      };
    }

    const memberPhones = members.map((m) => m.phone.trim());
    if (memberPhones.includes(phone.trim()) || memberPhones[0] === memberPhones[1]) {
      return {
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "All 3 team members must have distinct mobile numbers.",
        },
      };
    }

    const memberEmails = members.map((m) => m.email.toLowerCase().trim());
    const leaderEmailNorm = email.toLowerCase().trim();
    if (memberEmails.includes(leaderEmailNorm) || memberEmails[0] === memberEmails[1]) {
      return {
        success: false,
        error: {
          code: "INVALID_INPUT",
          message: "All 3 team members must have distinct email addresses.",
        },
      };
    }

    const finalBusSeats = transportOptIn
      ? (samePickupForTeam
          ? teamSizeNum
          : 1 + members.filter((m) => Boolean(m.transportOptIn)).length)
      : 0;

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
            email,
            college,
            department,
            year,
            collegeIdUrl: imageUrl || null,
            participantId: participant.id,
            transportOptIn: Boolean(transportOptIn),
            pickupRoute: transportOptIn ? pickupRoute : null,
            pickupStop: transportOptIn ? pickupStop : null,
            pickupLandmark: transportOptIn ? pickupLandmark : null,
          },
        });

        // Add additional team members
        for (const member of members) {
          const memberTransportOptIn = samePickupForTeam
            ? Boolean(transportOptIn)
            : Boolean(member.transportOptIn);
          const memberRoute = samePickupForTeam
            ? (transportOptIn ? pickupRoute : "Own Transportation")
            : (member.transportOptIn ? member.pickupRoute : "Own Transportation");
          const memberStop = samePickupForTeam
            ? (transportOptIn ? pickupStop : "Direct to Campus")
            : (member.transportOptIn ? member.pickupStop : "Direct to Campus");
          const memberLandmark = samePickupForTeam
            ? (transportOptIn ? pickupLandmark : "Self-Arranged")
            : (member.transportOptIn ? member.pickupLandmark : "Self-Arranged");

          await tx.teamMember.create({
            data: {
              teamId: team.id,
              name: member.name.trim(),
              phone: member.phone.trim(),
              email: member.email.trim().toLowerCase(),
              college: member.college.trim(),
              department: member.department.trim(),
              year: member.year,
              collegeIdUrl: member.collegeIdUrl || imageUrl || null,
              transportOptIn: memberTransportOptIn,
              pickupRoute: memberRoute,
              pickupStop: memberStop,
              pickupLandmark: memberLandmark,
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
          transportOptIn: Boolean(transportOptIn),
          samePickupForTeam: Boolean(samePickupForTeam),
          pickupRoute: transportOptIn ? pickupRoute : null,
          pickupStop: transportOptIn ? pickupStop : null,
          pickupLandmark: transportOptIn ? pickupLandmark : null,
          passengersCount: finalBusSeats,
        },
      });

      return { registration, participant };
    });

    // 5. Generate Real-time Scannable Live Pass URL & QR representations
    const appBaseUrl =
      process.env.NEXT_PUBLIC_APP_URL && !process.env.NEXT_PUBLIC_APP_URL.includes("localhost")
        ? process.env.NEXT_PUBLIC_APP_URL.replace(/\/+$/, "")
        : (process.env.VERCEL_PROJECT_PRODUCTION_URL
            ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
            : "https://codehive2k26.vercel.app");

    const livePassUrl = `${appBaseUrl}/registration/${registrationNumber}`;

    let qrDataUrl = "";
    let qrBuffer: Buffer | undefined;
    try {
      // The QR code encodes the live real-time digital pass verification URL.
      // When scanned with any smartphone camera or gate scanner, it opens the verified pass in real time.
      qrDataUrl = await generateQrDataUrl(livePassUrl);
      qrBuffer = await generateQrBuffer(livePassUrl);
    } catch (err) {
      console.error("QR Code generation fallback error:", err);
    }

    const formattedDate = event.startAt.toLocaleDateString("en-IN", {
      weekday: "short",
      day: "numeric",
      month: "short",
      year: "numeric",
    });

    const resolvedTeamName = teamSizeNum > 1 ? (teamName || `${name}'s Team`) : null;

    // Trigger confirmation email with ticket asynchronously
    sendRegistrationConfirmationEmail({
      to: email,
      participantName: name,
      eventName: event.name,
      registrationNumber,
      venue: event.venue,
      date: formattedDate,
      qrCodeUrl: qrDataUrl,
      qrBuffer,
      passUrl: livePassUrl,
      teamName: resolvedTeamName,
      college,
      department,
      members: teamSizeNum > 1 ? members : [],
      transportOptIn: Boolean(transportOptIn),
      samePickupForTeam: Boolean(samePickupForTeam),
      pickupRoute: transportOptIn ? pickupRoute : null,
      pickupStop: transportOptIn ? pickupStop : null,
      passengersCount: finalBusSeats,
    }).catch((err) => console.error("Email notification dispatch error:", err));

    revalidatePath("/admin/registrations");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/participants");
    revalidatePath("/admin/events");
    revalidatePath("/admin/reports");
    revalidatePath("/admin/settings");
    revalidatePath("/dashboard");
    revalidatePath(`/events/${event.slug}`);
    revalidatePath("/events");

    return {
      success: true,
      data: {
        registrationNumber,
        qrToken,
        qrDataUrl,
        eventName: event.name,
        eventSlug: event.slug,
        venue: event.venue,
        date: formattedDate,
        teamName: resolvedTeamName,
        leaderName: name,
        leaderEmail: email,
        leaderPhone: phone,
        college,
        department,
        year,
        transportOptIn: Boolean(transportOptIn),
        samePickupForTeam: Boolean(samePickupForTeam),
        pickupRoute: transportOptIn ? pickupRoute : null,
        pickupStop: transportOptIn ? pickupStop : null,
        pickupLandmark: transportOptIn ? pickupLandmark : null,
        passengersCount: finalBusSeats,
        teamMembers: members.map((m) => ({
          name: m.name.trim(),
          phone: m.phone.trim(),
          email: m.email.trim(),
          college: m.college.trim(),
          department: m.department.trim(),
          year: m.year,
          transportOptIn: samePickupForTeam ? Boolean(transportOptIn) : Boolean(m.transportOptIn),
          pickupRoute: samePickupForTeam ? (transportOptIn ? pickupRoute : null) : m.pickupRoute,
          pickupStop: samePickupForTeam ? (transportOptIn ? pickupStop : null) : m.pickupStop,
          pickupLandmark: samePickupForTeam ? (transportOptIn ? pickupLandmark : null) : m.pickupLandmark,
        })),
        confirmedAt: new Date().toISOString(),
      },
      message: "Registration successful! Your official event pass has been generated.",
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

export async function deleteRegistration(
  registrationId: string
): Promise<ActionResponse<{ registrationId: string }>> {
  if (!registrationId) {
    return {
      success: false,
      error: { code: "INVALID_INPUT", message: "Registration ID is required." },
    };
  }

  try {
    // Verify registration exists before deleting
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        participant: { select: { name: true } },
        event: { select: { name: true, slug: true } },
      },
    });

    if (!registration) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Registration not found." },
      };
    }

    // Delete registration (cascades to CheckIn and Payment via schema)
    await prisma.registration.delete({
      where: { id: registrationId },
    });

    // Revalidate all admin views
    revalidatePath("/admin/registrations");
    revalidatePath("/admin/dashboard");
    revalidatePath("/admin/participants");
    revalidatePath("/admin/events");
    revalidatePath("/admin/reports");
    revalidatePath("/dashboard");
    revalidatePath(`/events/${registration.event.slug}`);
    revalidatePath("/events");

    return {
      success: true,
      data: { registrationId },
      message: `Registration for ${registration.participant.name} removed successfully.`,
    };
  } catch (error: any) {
    const isDev = process.env.NODE_ENV === "development";
    console.error("deleteRegistration error:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message:
          isDev && error?.message
            ? `Failed to delete registration: ${error.message}`
            : "Failed to remove registration.",
      },
    };
  }
}

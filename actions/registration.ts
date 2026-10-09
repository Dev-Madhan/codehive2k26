"use server";

import prisma from "@/lib/prisma";
import { registrationSchema, RegistrationInput } from "@/lib/validations/registration";
import { generateQrToken, generateRegistrationNumber, generateQrDataUrl, generateQrBuffer } from "@/lib/qr";
import { sendRegistrationConfirmationEmail } from "@/lib/mailer";
import { validateVerificationToken } from "@/lib/otp-token";
import { ActionResponse } from "@/types";
import { RegistrationSuccessPayload } from "@/types/registration";
import { revalidatePath } from "next/cache";
import { deleteFromTigris } from "@/lib/tigris";
import { headers } from "next/headers";
import { checkRateLimit, getClientIp, RATE_LIMIT_TIERS } from "@/lib/rate-limiter";
import { requireAdminSession } from "@/lib/auth-guard";
import { logAuditEvent } from "@/lib/audit";

function extractTigrisKey(url: string): string {
  try {
    const parsed = new URL(url);
    return parsed.pathname.replace(/^\/+/, "");
  } catch {
    if (url.includes("college-ids/")) {
      return url.substring(url.indexOf("college-ids/"));
    }
    return url;
  }
}

export async function createRegistration(
  userId: string,
  input: RegistrationInput
): Promise<ActionResponse<RegistrationSuccessPayload>> {
  // Rate Limit Defense (Anti-Spam / Anti-Flooding)
  try {
    const reqHeaders = await headers();
    const ip = getClientIp(reqHeaders);
    const regLimit = await checkRateLimit(`reg_submit:${ip}`, RATE_LIMIT_TIERS.REGISTRATION);
    if (!regLimit.success) {
      return {
        success: false,
        error: {
          code: "RATE_LIMIT_EXCEEDED",
          message: `Too many registration attempts. Please wait ${regLimit.resetSeconds}s before submitting again.`,
        },
      };
    }
  } catch {
    // Non-blocking in headless/testing contexts
  }

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

    await prisma.$transaction(async (tx) => {
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
  } catch (error: unknown) {
    const errorMsg = error instanceof Error ? error.message : "";
    if (errorMsg === "DUPLICATE_REGISTRATION") {
      return {
        success: false,
        error: {
          code: "DUPLICATE_REGISTRATION",
          message: "You are already registered for this event.",
        },
      };
    }

    if (errorMsg === "DUPLICATE_TEAM_NAME") {
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
          isDev && errorMsg
            ? `Registration failed: ${errorMsg}`
            : "Failed to complete registration.",
      },
    };
  }
}

export async function deleteRegistration(
  registrationId: string
): Promise<ActionResponse<{ registrationId: string; deletedTeamName?: string; purgedMembersCount?: number }>> {
  const authCheck = await requireAdminSession();
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

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
        participant: {
          select: {
            id: true,
            userId: true,
            name: true,
            email: true,
            phone: true,
            imageUrl: true,
            registrations: { select: { id: true } },
          },
        },
        event: { select: { id: true, name: true, slug: true } },
        team: {
          include: {
            members: {
              select: {
                id: true,
                name: true,
                phone: true,
                email: true,
                collegeIdUrl: true,
                participantId: true,
              },
            },
            registrations: {
              select: { id: true, participantId: true },
            },
          },
        },
      },
    });

    if (!registration) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Registration not found." },
      };
    }

    // Resolve team: direct registration.team or find if this candidate is the team leader for this event
    let team = registration.team;
    if (!team) {
      team = await prisma.team.findFirst({
        where: {
          eventId: registration.eventId,
          leaderId: registration.participant.id,
        },
        include: {
          members: {
            select: {
              id: true,
              name: true,
              phone: true,
              email: true,
              collegeIdUrl: true,
              participantId: true,
            },
          },
          registrations: {
            select: { id: true, participantId: true },
          },
        },
      });
    }

    // 1. Identify and purge associated Tigris S3 ID card documents
    const rawUrlsToPurge: string[] = [];

    // From team members
    if (team?.members) {
      for (const m of team.members) {
        if (m.collegeIdUrl) {
          rawUrlsToPurge.push(m.collegeIdUrl);
        }
      }
    }

    // From participant / leader
    if (registration.participant.imageUrl) {
      rawUrlsToPurge.push(registration.participant.imageUrl);
    }

    // Deduplicate URLs
    const uniqueUrls = Array.from(new Set(rawUrlsToPurge.filter(Boolean)));

    for (const url of uniqueUrls) {
      try {
        const key = extractTigrisKey(url);
        console.log(`[Tigris Purge] Removing candidate ID asset: ${key}`);
        await deleteFromTigris(key);
      } catch (purgeErr) {
        console.warn(`[Tigris Purge Warning] Could not delete S3 asset ${url}:`, purgeErr);
      }
    }

    let purgedMembersCount = 0;
    const teamName = team?.name;

    // 2. If Team exists (Team Leader or team registration deletion):
    // Permanently purge all team members, team record, and all registrations linked to team
    if (team) {
      purgedMembersCount = team.members.length;

      // Collect all linked registration IDs
      const teamRegIds = new Set<string>();
      teamRegIds.add(registration.id);
      if (team.registrations) {
        team.registrations.forEach((r) => teamRegIds.add(r.id));
      }

      // Also check any other registrations with this teamId
      const additionalTeamRegs = await prisma.registration.findMany({
        where: { teamId: team.id },
        select: { id: true, participantId: true },
      });
      additionalTeamRegs.forEach((r) => teamRegIds.add(r.id));

      const allRegIds = Array.from(teamRegIds);

      // Collect all participant IDs associated with this team (leader + members)
      const participantIdsToReview = new Set<string>();
      participantIdsToReview.add(registration.participant.id);
      team.members.forEach((m) => {
        if (m.participantId) participantIdsToReview.add(m.participantId);
      });
      additionalTeamRegs.forEach((r) => {
        if (r.participantId) participantIdsToReview.add(r.participantId);
      });

      // Member emails for fallback participant resolution
      const memberEmails = team.members
        .map((m) => m.email?.toLowerCase().trim())
        .filter(Boolean) as string[];

      if (memberEmails.length > 0) {
        const matchedParticipants = await prisma.participant.findMany({
          where: { email: { in: memberEmails } },
          select: { id: true },
        });
        matchedParticipants.forEach((p) => participantIdsToReview.add(p.id));
      }

      // Delete CheckIns and Payments for all team registrations
      await prisma.checkIn.deleteMany({
        where: { registrationId: { in: allRegIds } },
      }).catch(() => {});

      await prisma.payment.deleteMany({
        where: { registrationId: { in: allRegIds } },
      }).catch(() => {});

      // Delete all registrations for this team
      await prisma.registration.deleteMany({
        where: { id: { in: allRegIds } },
      });

      // Delete all TeamMember rows
      await prisma.teamMember.deleteMany({
        where: { teamId: team.id },
      });

      // Delete the Team record
      await prisma.team.delete({
        where: { id: team.id },
      }).catch(() => {});

      // Clean up orphaned Participant and User records if they have 0 registrations left
      for (const pId of participantIdsToReview) {
        try {
          const remainingRegs = await prisma.registration.count({
            where: { participantId: pId },
          });
          if (remainingRegs === 0) {
            const pRecord = await prisma.participant.findUnique({
              where: { id: pId },
              select: { id: true, userId: true, user: { select: { id: true, role: true } } },
            });
            if (pRecord) {
              if (pRecord.user?.role === "PARTICIPANT") {
                await prisma.user.delete({ where: { id: pRecord.userId } }).catch(async () => {
                  await prisma.participant.delete({ where: { id: pId } }).catch(() => {});
                });
              } else {
                await prisma.participant.delete({ where: { id: pId } }).catch(() => {});
              }
            }
          }
        } catch (cleanupErr) {
          console.warn(`[Participant Cleanup Notice for ${pId}]:`, cleanupErr);
        }
      }
    } else {
      // 3. Solo / Individual Registration Deletion
      await prisma.registration.delete({
        where: { id: registrationId },
      });

      const remainingRegs = await prisma.registration.count({
        where: { participantId: registration.participant.id },
      });

      if (remainingRegs === 0) {
        const pRecord = await prisma.participant.findUnique({
          where: { id: registration.participant.id },
          select: { id: true, userId: true, user: { select: { id: true, role: true } } },
        });
        if (pRecord) {
          if (pRecord.user?.role === "PARTICIPANT") {
            await prisma.user.delete({ where: { id: pRecord.userId } }).catch(async () => {
              await prisma.participant.delete({ where: { id: pRecord.id } }).catch(() => {});
            });
          } else {
            await prisma.participant.delete({ where: { id: pRecord.id } }).catch(() => {});
          }
        }
      }
    }

    // Record Audit Log
    await logAuditEvent({
      actorId: authCheck.user.id,
      action: "REGISTRATION_DELETE",
      entity: "Registration",
      entityId: registrationId,
      metadata: {
        participantName: registration.participant.name,
        participantEmail: registration.participant.email,
        registrationNumber: registration.registrationNumber,
        eventName: registration.event.name,
        isTeamLeader: Boolean(team),
        teamName: teamName || null,
        purgedMembersCount,
        purgedDocumentsCount: uniqueUrls.length,
      },
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
      data: {
        registrationId,
        deletedTeamName: teamName || undefined,
        purgedMembersCount: team ? purgedMembersCount : undefined,
      },
      message: team
        ? `Team "${teamName}" and all ${purgedMembersCount} team members permanently deleted from database.`
        : `Registration for ${registration.participant.name} and uploaded ID cards removed successfully.`,
    };
  } catch (error: unknown) {
    const isDev = process.env.NODE_ENV === "development";
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    console.error("deleteRegistration error:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message:
          isDev && errorMessage
            ? `Failed to delete registration: ${errorMessage}`
            : "Failed to remove registration.",
      },
    };
  }
}

/**
 * Administrative pass recovery tool: re-dispatches the official confirmation
 * ticket and dynamic QR code to the registered participant's email.
 */
export async function resendConfirmationEmail(
  registrationId: string
): Promise<ActionResponse<{ success: boolean; recipientEmail: string }>> {
  const authCheck = await requireAdminSession();
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

  if (!registrationId) {
    return {
      success: false,
      error: { code: "INVALID_INPUT", message: "Registration ID is required." },
    };
  }

  try {
    const registration = await prisma.registration.findUnique({
      where: { id: registrationId },
      include: {
        participant: true,
        event: true,
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
        error: { code: "NOT_FOUND", message: "Registration not found." },
      };
    }

    const emailResult = await sendRegistrationConfirmationEmail({
      to: registration.participant.email,
      participantName: registration.participant.name,
      eventName: registration.event.name,
      registrationNumber: registration.registrationNumber,
      venue: registration.event.venue,
      date: new Date(registration.event.startAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      }),
      teamName: registration.team?.name || null,
      college: registration.participant.college,
      members: (registration.team?.members || []).map((m) => ({
        name: m.name,
        phone: m.phone,
        email: m.email ?? undefined,
        college: m.college ?? undefined,
        department: m.department ?? undefined,
        year: m.year ?? undefined,
        transportOptIn: m.transportOptIn,
        pickupRoute: m.pickupRoute,
        pickupStop: m.pickupStop,
        pickupLandmark: m.pickupLandmark,
      })),
      transportOptIn: registration.transportOptIn,
      samePickupForTeam: registration.samePickupForTeam,
      pickupRoute: registration.pickupRoute,
      pickupStop: registration.pickupStop,
      pickupLandmark: registration.pickupLandmark,
      passengersCount: registration.passengersCount,
    });

    if (!emailResult.success) {
      return {
        success: false,
        error: {
          code: "INTERNAL_ERROR",
          message: emailResult.error || "Failed to dispatch email pass.",
        },
      };
    }

    await logAuditEvent({
      actorId: authCheck.user.id,
      action: "TICKET_RESEND",
      entity: "Registration",
      entityId: registration.id,
      metadata: {
        recipientEmail: registration.participant.email,
        registrationNumber: registration.registrationNumber,
        eventName: registration.event.name,
      },
    });

    return {
      success: true,
      data: {
        success: true,
        recipientEmail: registration.participant.email,
      },
      message: `Confirmation pass successfully re-sent to ${registration.participant.email}.`,
    };
  } catch (error: unknown) {
    console.error("resendConfirmationEmail error:", error);
    const message = error instanceof Error ? error.message : "Failed to resend confirmation email.";
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message,
      },
    };
  }
}


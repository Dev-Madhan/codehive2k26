"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types";
import { Team } from "@prisma/client";
import { requireAdminSession } from "@/lib/auth-guard";
import { logAuditEvent } from "@/lib/audit";

export async function createTeam(
  leaderParticipantId: string,
  leaderName: string,
  leaderPhone: string,
  eventId: string,
  teamName: string
): Promise<ActionResponse<Team>> {
  const authCheck = await requireAdminSession();
  if (authCheck.error) {
    return { success: false, error: authCheck.error };
  }

  try {
    const existing = await prisma.team.findUnique({
      where: {
        name_eventId: {
          name: teamName,
          eventId,
        },
      },
    });

    if (existing) {
      return {
        success: false,
        error: { code: "INVALID_INPUT", message: "A team with this name already exists for this event." },
      };
    }

    const team = await prisma.$transaction(async (tx) => {
      const newTeam = await tx.team.create({
        data: {
          name: teamName,
          eventId,
          leaderId: leaderParticipantId,
        },
      });

      await tx.teamMember.create({
        data: {
          teamId: newTeam.id,
          name: leaderName,
          phone: leaderPhone,
          participantId: leaderParticipantId,
        },
      });

      return newTeam;
    });

    await logAuditEvent({
      actorId: authCheck.user.id,
      action: "EVENT_UPDATE",
      entity: "Event",
      entityId: eventId,
      metadata: { action: "ADMIN_CREATE_TEAM", teamId: team.id, teamName },
    });

    return { success: true, data: team, message: "Team created successfully!" };
  } catch (error: unknown) {
    console.error("createTeam error:", error);
    const message = error instanceof Error ? error.message : "Failed to create team.";
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message },
    };
  }
}


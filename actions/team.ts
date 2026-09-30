"use server";

import prisma from "@/lib/prisma";
import { ActionResponse } from "@/types";
import { Team } from "@prisma/client";

export async function createTeam(
  leaderParticipantId: string,
  eventId: string,
  teamName: string
): Promise<ActionResponse<Team>> {
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
          participantId: leaderParticipantId,
        },
      });

      return newTeam;
    });

    return { success: true, data: team, message: "Team created successfully!" };
  } catch (error) {
    console.error("createTeam error:", error);
    return {
      success: false,
      error: { code: "INTERNAL_ERROR", message: "Failed to create team." },
    };
  }
}

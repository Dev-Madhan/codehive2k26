"use server";

import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import prisma from "@/lib/prisma";
import { auth } from "@/lib/auth";
import { deleteFromTigris } from "@/lib/tigris";
import { ActionResponse } from "@/types";
import { Role } from "@prisma/client";

/**
 * Helper to enforce that the caller has an active ADMIN session.
 */
async function requireAdminSession() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { error: { code: "UNAUTHORIZED" as const, message: "Authentication required." } };
  }

  const role = ((session.user as { role?: string })?.role || "").toUpperCase();
  if (role !== "ADMIN") {
    return { error: { code: "FORBIDDEN" as const, message: "Administrative privilege required." } };
  }

  return { sessionUser: session.user, currentSessionId: session.session?.id };
}

/**
 * Extracts the Tigris S3 storage key from a full URL or relative path.
 */
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

/**
 * Update a user's role (ADMIN <-> PARTICIPANT).
 */
export async function updateUserRole(
  targetUserId: string,
  newRole: Role
): Promise<ActionResponse<{ id: string; email: string; role: Role }>> {
  try {
    const authCheck = await requireAdminSession();
    if (authCheck.error) {
      return { success: false, error: authCheck.error };
    }

    const { sessionUser } = authCheck;

    // Fetch target user
    const targetUser = await prisma.user.findUnique({
      where: { id: targetUserId },
      select: { id: true, email: true, name: true, role: true },
    });

    if (!targetUser) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Target user not found." },
      };
    }

    // Safety guard: Prevent sole admin from demoting themselves
    if (targetUser.id === sessionUser.id && newRole !== "ADMIN") {
      const adminCount = await prisma.user.count({ where: { role: "ADMIN" } });
      if (adminCount <= 1) {
        return {
          success: false,
          error: {
            code: "FORBIDDEN",
            message: "Cannot demote the sole system administrator. Elevate another admin first.",
          },
        };
      }
    }

    // Perform role update
    const updatedUser = await prisma.user.update({
      where: { id: targetUserId },
      data: { role: newRole },
      select: { id: true, email: true, role: true },
    });

    // Create Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          actorId: sessionUser.id,
          action: "USER_ROLE_UPDATED",
          entity: "User",
          entityId: targetUserId,
          metadata: {
            targetEmail: targetUser.email,
            previousRole: targetUser.role,
            newRole,
            assignedBy: sessionUser.email,
          },
        },
      });
    } catch (auditErr) {
      console.warn("[AuditLog] Failed to record role update audit:", auditErr);
    }

    revalidatePath("/admin/settings");
    revalidatePath("/admin/dashboard");

    return {
      success: true,
      data: updatedUser,
      message: `User role successfully updated to ${newRole}.`,
    };
  } catch (error) {
    console.error("[updateUserRole Error]:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Failed to update user role.",
      },
    };
  }
}

/**
 * Permanently delete an uploaded College ID PDF from Tigris S3 storage
 * and clear its reference in the database.
 */
export async function deleteUploadedCollegeIdPdf(
  recordId: string,
  pdfUrl: string
): Promise<ActionResponse<{ deletedKey: string; clearedRecordsCount: number }>> {
  try {
    const authCheck = await requireAdminSession();
    if (authCheck.error) {
      return { success: false, error: authCheck.error };
    }

    const { sessionUser } = authCheck;

    if (!pdfUrl) {
      return {
        success: false,
        error: { code: "INVALID_INPUT", message: "PDF URL is required for deletion." },
      };
    }

    const s3Key = extractTigrisKey(pdfUrl);

    // 1. Delete the physical object from Tigris S3 bucket
    console.log(`[Tigris Purge] Deleting object key: ${s3Key}`);
    const tigrisResult = await deleteFromTigris(s3Key);

    if (!tigrisResult.success) {
      console.warn(`[Tigris Purge] Warning while deleting from bucket: ${tigrisResult.error}`);
      // Even if file was already missing in bucket, proceed to clean database references
    }

    // 2. Clear database reference(s) matching this URL or recordId across BOTH TeamMember and Participant
    const [tmUpdate, pUpdate] = await Promise.all([
      prisma.teamMember.updateMany({
        where: {
          OR: [
            { id: recordId },
            { collegeIdUrl: pdfUrl },
          ],
        },
        data: {
          collegeIdUrl: null,
        },
      }),
      prisma.participant.updateMany({
        where: {
          OR: [
            { id: recordId },
            { imageUrl: pdfUrl },
          ],
        },
        data: {
          imageUrl: null,
          cloudinaryPublicId: null,
        },
      }),
    ]);

    const totalCleared = tmUpdate.count + pUpdate.count;

    // 3. Create Audit Log
    try {
      await prisma.auditLog.create({
        data: {
          actorId: sessionUser.id,
          action: "COLLEGE_ID_PDF_PURGED",
          entity: "CollegeIDDocument",
          entityId: recordId,
          metadata: {
            deletedS3Key: s3Key,
            pdfUrl,
            clearedTeamMembersCount: tmUpdate.count,
            clearedParticipantsCount: pUpdate.count,
            purgedBy: sessionUser.email,
          },
        },
      });
    } catch (auditErr) {
      console.warn("[AuditLog] Failed to record PDF delete audit:", auditErr);
    }

    revalidatePath("/admin/settings");
    revalidatePath("/admin/registrations");

    return {
      success: true,
      data: {
        deletedKey: s3Key,
        clearedRecordsCount: totalCleared,
      },
      message: "Uploaded College ID permanently purged from Tigris S3 and records cleared.",
    };
  } catch (error) {
    console.error("[deleteUploadedCollegeIdPdf Error]:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Failed to purge PDF from storage.",
      },
    };
  }
}

/**
 * Revoke/terminate an active user session by its session ID.
 */
export async function revokeUserSession(
  targetSessionId: string
): Promise<ActionResponse<{ revokedSessionId: string }>> {
  try {
    const authCheck = await requireAdminSession();
    if (authCheck.error) {
      return { success: false, error: authCheck.error };
    }

    const { sessionUser, currentSessionId } = authCheck;

    if (!targetSessionId) {
      return {
        success: false,
        error: { code: "INVALID_INPUT", message: "Session ID is required." },
      };
    }

    if (currentSessionId && targetSessionId === currentSessionId) {
      return {
        success: false,
        error: {
          code: "FORBIDDEN",
          message: "You cannot terminate your own active session from here.",
        },
      };
    }

    // Find the session before deletion to log audit details
    const sessionToDelete = await prisma.session.findUnique({
      where: { id: targetSessionId },
      include: { user: true },
    });

    if (!sessionToDelete) {
      return {
        success: false,
        error: { code: "NOT_FOUND", message: "Session not found or already expired." },
      };
    }

    await prisma.session.delete({
      where: { id: targetSessionId },
    });

    // Audit log
    try {
      await prisma.auditLog.create({
        data: {
          actorId: sessionUser.id,
          action: "USER_SESSION_REVOKED",
          entity: "Session",
          entityId: targetSessionId,
          metadata: {
            terminatedUserEmail: sessionToDelete.user.email,
            terminatedIpAddress: sessionToDelete.ipAddress,
            revokedBy: sessionUser.email,
          },
        },
      });
    } catch (auditErr) {
      console.warn("[AuditLog] Failed to record session revoke audit:", auditErr);
    }

    revalidatePath("/admin/settings");

    return {
      success: true,
      data: { revokedSessionId: targetSessionId },
      message: `Session for ${sessionToDelete.user.email} terminated.`,
    };
  } catch (error) {
    console.error("[revokeUserSession Error]:", error);
    return {
      success: false,
      error: {
        code: "INTERNAL_ERROR",
        message: error instanceof Error ? error.message : "Failed to terminate user session.",
      },
    };
  }
}


import prisma from "@/lib/prisma";
import type { Prisma } from "@prisma/client";

export interface AuditEventParams {
  actorId?: string | null;
  action:
    | "EVENT_CREATE"
    | "EVENT_UPDATE"
    | "EVENT_DELETE"
    | "REGISTRATION_CREATE"
    | "REGISTRATION_DELETE"
    | "CHECK_IN"
    | "TICKET_RESEND"
    | "USER_ROLE_UPDATE"
    | "SESSION_REVOKE"
    | "DATA_EXPORT";
  entity: "Event" | "Registration" | "User" | "CheckIn" | "Report";
  entityId: string;
  metadata?: Prisma.InputJsonValue;
}

/**
 * Universal, non-blocking enterprise audit logger.
 * Writes records to the Prisma AuditLog table with error-isolation.
 */
export async function logAuditEvent(params: AuditEventParams): Promise<void> {
  try {
    await prisma.auditLog.create({
      data: {
        actorId: params.actorId || null,
        action: params.action,
        entity: params.entity,
        entityId: params.entityId,
        metadata: params.metadata || {},
      },
    });
  } catch (err) {
    // Non-blocking: audit failure must never break user-facing transactions
    console.warn(`[AuditLog Warning] Failed to record ${params.action} on ${params.entity}:${params.entityId}`, err);
  }
}

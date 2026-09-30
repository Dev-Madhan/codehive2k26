import { Role } from "@prisma/client";

export interface SessionUser {
  id: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
  role: Role;
}

/**
 * Server-side helper to verify user permissions.
 */
export function hasRole(userRole: Role, allowedRoles: Role[]): boolean {
  if (userRole === "SUPER_ADMIN") return true;
  return allowedRoles.includes(userRole);
}

export const ROLES = {
  SUPER_ADMIN: "SUPER_ADMIN" as Role,
  ORGANIZER: "ORGANIZER" as Role,
  STAFF: "STAFF" as Role,
  PARTICIPANT: "PARTICIPANT" as Role,
};

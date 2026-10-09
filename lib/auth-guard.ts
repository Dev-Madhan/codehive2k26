import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import { ActionError } from "@/types";

export interface AuthenticatedUser {
  id: string;
  name: string;
  email: string;
  role: string;
  image?: string | null;
}

/**
 * Enforce that the current caller has an active, authenticated ADMIN session.
 * Used across Server Actions and API routes.
 */
export async function requireAdminSession(
  customHeaders?: Headers
): Promise<{ user: AuthenticatedUser; error: null } | { user: null; error: ActionError["error"] }> {
  try {
    const reqHeaders = customHeaders ?? (await headers());
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session?.user) {
      return {
        user: null,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required to perform this action.",
        },
      };
    }

    const role = ((session.user as { role?: string })?.role || "").toUpperCase();
    if (role !== "ADMIN") {
      return {
        user: null,
        error: {
          code: "FORBIDDEN",
          message: "Administrative privileges required.",
        },
      };
    }

    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role,
        image: session.user.image,
      },
      error: null,
    };
  } catch (err) {
    console.error("[requireAdminSession error]", err);
    return {
      user: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to verify administrative authorization.",
      },
    };
  }
}

/**
 * Enforce that the caller is either the account owner (targetUserId) or an ADMIN.
 * Protects against Insecure Direct Object References (IDOR).
 */
export async function requireSelfOrAdmin(
  targetUserId: string,
  customHeaders?: Headers
): Promise<{ user: AuthenticatedUser; error: null } | { user: null; error: ActionError["error"] }> {
  try {
    const reqHeaders = customHeaders ?? (await headers());
    const session = await auth.api.getSession({
      headers: reqHeaders,
    });

    if (!session?.user) {
      return {
        user: null,
        error: {
          code: "UNAUTHORIZED",
          message: "Authentication required.",
        },
      };
    }

    const role = ((session.user as { role?: string })?.role || "").toUpperCase();
    const isOwner = session.user.id === targetUserId;
    const isAdmin = role === "ADMIN";

    if (!isOwner && !isAdmin) {
      return {
        user: null,
        error: {
          code: "FORBIDDEN",
          message: "You do not have permission to access or modify this profile.",
        },
      };
    }

    return {
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role,
        image: session.user.image,
      },
      error: null,
    };
  } catch (err) {
    console.error("[requireSelfOrAdmin error]", err);
    return {
      user: null,
      error: {
        code: "INTERNAL_ERROR",
        message: "Failed to verify session identity.",
      },
    };
  }
}

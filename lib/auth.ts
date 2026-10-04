import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import prisma from "@/lib/prisma";
import { Role } from "@prisma/client";
import { env } from "@/env";

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "postgresql",
  }),
  secret: env.BETTER_AUTH_SECRET,
  baseURL: env.BETTER_AUTH_URL,
  trustedOrigins: [
    "http://localhost:3000",
    "http://127.0.0.1:3000",
    "https://codehive2k26.vercel.app",
    env.NEXT_PUBLIC_APP_URL,
  ],
  emailAndPassword: {
    enabled: true,
  },
  socialProviders: {
    google: {
      clientId: env.GOOGLE_CLIENT_ID,
      clientSecret: env.GOOGLE_CLIENT_SECRET,
    },
    github: {
      clientId: env.GITHUB_CLIENT_ID,
      clientSecret: env.GITHUB_CLIENT_SECRET,
    },
  },
  user: {
    additionalFields: {
      role: {
        type: "string",
        required: false,
        defaultValue: "PARTICIPANT",
      },
    },
  },
});

export const ROLES = {
  ADMIN: "ADMIN" as Role,
  SUPER_ADMIN: "SUPER_ADMIN" as Role,
  ORGANIZER: "ORGANIZER" as Role,
  STAFF: "STAFF" as Role,
  PARTICIPANT: "PARTICIPANT" as Role,
};

export function hasRole(userRole: Role, allowedRoles: Role[]): boolean {
  if (userRole === "SUPER_ADMIN" || userRole === "ADMIN") return true;
  return allowedRoles.includes(userRole);
}

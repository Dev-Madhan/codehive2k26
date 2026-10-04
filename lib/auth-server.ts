import "server-only";

import { headers } from "next/headers";
import { auth } from "@/lib/auth";
import prisma from "@/lib/prisma";
import { isBootstrapAdminEmail } from "@/lib/admin-access";

export async function getCurrentUserAccess() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { session: null, role: null };
  }

  let user = await prisma.user.findFirst({
    where: {
      email: {
        equals: session.user.email,
        mode: "insensitive",
      },
    },
    select: { id: true, role: true, emailVerified: true },
  });

  if (
    user?.emailVerified &&
    isBootstrapAdminEmail(session.user.email) &&
    user.role !== "ADMIN"
  ) {
    user = await prisma.user.update({
      where: { id: user.id },
      data: { role: "ADMIN" },
      select: { id: true, role: true, emailVerified: true },
    });
  }

  return { session, role: user?.role ?? null };
}

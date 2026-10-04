import * as React from "react";
import { redirect } from "next/navigation";
import { getCurrentUserAccess } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import {
  SettingsClient,
  ActivitySessionItem,
  UserDirectoryItem,
  AttendeePdfItem,
} from "@/components/admin/settings-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminSettingsPage() {
  // 1. RBAC Guard: Ensure active admin session
  const { session, role } = await getCurrentUserAccess();

  if (!session?.user) {
    redirect("/auth?callbackUrl=/admin/settings");
  }

  if (role !== "ADMIN") {
    redirect("/events");
  }

  const now = new Date();

  // 2. Fetch live data for Activity Log, Role Assigner, and PDF Access
  const [sessions, users, participantsWithPdf, teamMembersWithPdf] = await Promise.all([
    // A. Activity sessions
    prisma.session.findMany({
      include: {
        user: true,
      },
      orderBy: {
        updatedAt: "desc",
      },
      take: 100,
    }),

    // B. Registered users
    prisma.user.findMany({
      include: {
        participant: true,
        _count: {
          select: { sessions: true },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    // C1. Participants with uploaded College ID documents (Individual & Team leaders)
    prisma.participant.findMany({
      where: {
        imageUrl: {
          not: null,
        },
      },
      include: {
        registrations: {
          include: {
            event: true,
          },
          orderBy: {
            createdAt: "desc",
          },
        },
      },
      orderBy: {
        createdAt: "desc",
      },
    }),

    // C2. Team members with uploaded College ID documents
    prisma.teamMember.findMany({
      where: {
        collegeIdUrl: {
          not: null,
        },
      },
      include: {
        team: {
          include: {
            event: true,
          },
        },
        participant: true,
      },
      orderBy: {
        createdAt: "desc",
      },
    }),
  ]);

  // 3. Serialize and map records
  const activitySessions: ActivitySessionItem[] = sessions.map((s) => ({
    id: s.id,
    userId: s.userId,
    userName: s.user.name,
    userEmail: s.user.email,
    userRole: s.user.role,
    userImage: s.user.image,
    ipAddress: s.ipAddress,
    userAgent: s.userAgent,
    createdAt: s.createdAt.toISOString(),
    updatedAt: s.updatedAt.toISOString(),
    expiresAt: s.expiresAt.toISOString(),
    isActive: new Date(s.expiresAt) > now,
  }));

  const userList: UserDirectoryItem[] = users.map((u) => ({
    id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    image: u.image,
    college: u.participant?.college || null,
    department: u.participant?.department || null,
    year: u.participant?.year || null,
    phone: u.participant?.phone || null,
    createdAt: u.createdAt.toISOString(),
    sessionsCount: u._count.sessions,
  }));

  const pdfList: AttendeePdfItem[] = [];
  const seenUrls = new Set<string>();

  // 1. Map from Participants (Leaders & Individual registrants)
  for (const p of participantsWithPdf) {
    if (!p.imageUrl) continue;
    seenUrls.add(p.imageUrl);

    const eventNames = p.registrations.map((r) => r.event?.name).filter(Boolean);
    const eventName = eventNames.length > 0 ? eventNames.join(", ") : "Symposium Registration";
    const primaryReg = p.registrations[0];
    pdfList.push({
      id: p.id,
      name: p.name,
      phone: p.phone,
      college: p.college || "Symposium Attendee College",
      department: p.department || null,
      year: p.year || null,
      email: p.email,
      eventName,
      eventSlug: primaryReg?.event?.slug || "",
      collegeIdUrl: p.imageUrl,
      uploadedAt: (p.updatedAt || p.createdAt).toISOString(),
    });
  }

  // 2. Map from Team Members
  for (const tm of teamMembersWithPdf) {
    if (!tm.collegeIdUrl || seenUrls.has(tm.collegeIdUrl)) continue;
    seenUrls.add(tm.collegeIdUrl);

    pdfList.push({
      id: tm.id,
      name: tm.name,
      phone: tm.phone,
      college: tm.participant?.college || "Team Member College",
      department: tm.participant?.department || null,
      year: tm.participant?.year || null,
      email: tm.participant?.email || null,
      eventName: tm.team?.event?.name || "CodeHive Challenge",
      eventSlug: tm.team?.event?.slug || "",
      collegeIdUrl: tm.collegeIdUrl,
      uploadedAt: tm.createdAt.toISOString(),
    });
  }

  return (
    <SettingsClient
      activitySessions={activitySessions}
      users={userList}
      pdfItems={pdfList}
      currentSessionId={session?.session?.id}
    />
  );
}

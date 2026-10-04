import prisma from "@/lib/prisma";
import { RegistrationsClient } from "@/components/admin/registrations-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminRegistrationsPage() {
  const [registrations, events] = await Promise.all([
    prisma.registration.findMany({
      include: {
        event: {
          select: {
            name: true,
            slug: true,
            venue: true,
            startAt: true,
          },
        },
        participant: {
          select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            college: true,
            department: true,
            year: true,
            imageUrl: true,
          },
        },
        team: {
          select: {
            id: true,
            name: true,
            members: {
              select: {
                id: true,
                name: true,
                email: true,
                phone: true,
                college: true,
                department: true,
                year: true,
                transportOptIn: true,
                pickupStop: true,
              },
            },
          },
        },
        checkIn: {
          select: {
            checkedInAt: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 200,
    }),
    prisma.event.findMany({
      select: {
        id: true,
        name: true,
        slug: true,
      },
      orderBy: { name: "asc" },
    }),
  ]);


  return (
    <div className="space-y-5 font-mono max-w-full">
      <div className="border-b border-border pb-3 sm:pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 mb-2">
          &gt; admin / active_registrations
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground uppercase">Registrations</h1>
        <p className="text-xs text-muted-foreground mt-1">Live attendee roster with transport tracking and gate check-in status.</p>
      </div>

      <RegistrationsClient initialRegistrations={registrations} events={events} />
    </div>
  );
}

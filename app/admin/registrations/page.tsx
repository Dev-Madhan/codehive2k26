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
                phone: true,
                email: true,
                college: true,
                department: true,
                year: true,
                transportOptIn: true,
                pickupRoute: true,
                pickupStop: true,
                pickupLandmark: true,
                collegeIdUrl: true,
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
    <div className="space-y-3 sm:space-y-5 font-mono max-w-full">
      <div className="border-b border-[#262626] pb-2 sm:pb-3.5">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-black bg-white border border-white mb-1.5 sm:mb-2">
          &gt; admin / active_registrations
        </div>
        <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white uppercase">Registrations</h1>
        <p className="text-[11px] sm:text-xs text-[#A3A3A3] mt-0.5 sm:mt-1">Live attendee roster with transport tracking and gate check-in status.</p>
      </div>

      <RegistrationsClient initialRegistrations={registrations} events={events} />
    </div>
  );
}


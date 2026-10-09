import prisma from "@/lib/prisma";
import { ParticipantsClient } from "@/components/admin/participants-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminParticipantsPage() {
  const [registrations, events] = await Promise.all([
    prisma.registration.findMany({
      include: {
        event: {
          select: {
            id: true,
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
                collegeIdUrl: true,
                transportOptIn: true,
                pickupRoute: true,
                pickupStop: true,
                pickupLandmark: true,
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
          &gt; admin / participants_roster
        </div>
        <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white uppercase">
          Participants Directory
        </h1>
        <p className="text-[11px] sm:text-xs text-[#A3A3A3] mt-0.5 sm:mt-1">
          Complete live directory of all registered candidates, team leaders, and team members.
        </p>
      </div>

      <ParticipantsClient initialRegistrations={registrations} events={events} />
    </div>
  );
}

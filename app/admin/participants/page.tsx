import prisma from "@/lib/prisma";
import { ParticipantsClient } from "@/components/admin/participants-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminParticipantsPage() {
  const participants = await prisma.participant.findMany({
    include: {
      _count: {
        select: { registrations: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-5 font-mono max-w-full">
      <div className="border-b border-border pb-3 sm:pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 mb-2">
          &gt; admin / participants_registry
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground uppercase">Participants Directory</h1>
        <p className="text-xs text-muted-foreground mt-1">Verified participants registered in the CodeHive 2K26 database.</p>
      </div>

      <ParticipantsClient initialParticipants={participants} />
    </div>
  );
}

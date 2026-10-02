import prisma from "@/lib/prisma";
import { RegistrationsClient } from "@/components/admin/registrations-client";

export default async function AdminRegistrationsPage() {
  const registrations = await prisma.registration.findMany({
    include: {
      event: {
        select: {
          name: true,
          slug: true,
        },
      },
      participant: {
        select: {
          name: true,
          email: true,
          phone: true,
          college: true,
        },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 100,
  });

  return (
    <div className="space-y-5 font-mono max-w-full">
      <div className="border-b border-[#152A54] pb-3 sm:pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 mb-2">
          &gt; admin / active_registrations
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">Registrations</h1>
        <p className="text-xs text-slate-400 mt-1">Live attendee roster with transport tracking and gate check-in status.</p>
      </div>

      <RegistrationsClient initialRegistrations={registrations} />
    </div>
  );
}

import prisma from "@/lib/prisma";
import { ReportsClient } from "@/components/admin/reports-client";

export default async function AdminReportsPage() {
  const [
    totalRegistrations,
    confirmedRegistrations,
    totalCheckIns,
    busRegistrations,
    events,
  ] = await Promise.all([
    prisma.registration.count(),
    prisma.registration.count({ where: { status: "CONFIRMED" } }),
    prisma.checkIn.count(),
    prisma.registration.count({ where: { transportOptIn: true } }),
    prisma.event.findMany({
      include: {
        category: {
          select: { name: true },
        },
        _count: {
          select: { registrations: true },
        },
      },
      orderBy: { registrations: { _count: "desc" } },
    }),
  ]);

  return (
    <div className="space-y-5 font-mono max-w-full">
      <div className="border-b border-[#152A54] pb-3 sm:pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 mb-2">
          &gt; admin / analytics_reports
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">Reports &amp; Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">Real-time attendance rates, track capacity metrics, and exportable reports.</p>
      </div>

      <ReportsClient
        totalRegistrations={totalRegistrations}
        confirmedRegistrations={confirmedRegistrations}
        totalCheckIns={totalCheckIns}
        busRegistrations={busRegistrations}
        events={events}
      />
    </div>
  );
}

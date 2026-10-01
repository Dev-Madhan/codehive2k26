import prisma from "@/lib/prisma";

export default async function AdminReportsPage() {
  const [totalRegistrations, confirmedRegistrations, totalCheckIns, events] =
    await Promise.all([
      prisma.registration.count(),
      prisma.registration.count({ where: { status: "CONFIRMED" } }),
      prisma.checkIn.count(),
      prisma.event.findMany({
        include: {
          _count: {
            select: { registrations: true },
          },
        },
      }),
    ]);

  return (
    <div className="space-y-8 font-mono">
      <div className="border-b border-[#152A54] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 mb-2">
          &gt; admin / analytics_reports
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white uppercase">Reports &amp; Analytics</h1>
        <p className="text-xs text-slate-400 mt-1">Summary and exportable event metrics.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-none border border-[#152A54] bg-[#060D1A] p-5 hover:border-blue-500/40 transition-colors">
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Total Registrations</p>
          <p className="text-3xl font-bold text-blue-400 mt-1 tabular-nums">{totalRegistrations}</p>
        </div>
        <div className="rounded-none border border-[#152A54] bg-[#060D1A] p-5 hover:border-blue-500/40 transition-colors">
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Confirmed Registrations</p>
          <p className="text-3xl font-bold text-white mt-1 tabular-nums">{confirmedRegistrations}</p>
        </div>
        <div className="rounded-none border border-[#152A54] bg-[#060D1A] p-5 hover:border-blue-500/40 transition-colors">
          <p className="text-[11px] uppercase tracking-wider text-slate-400">Total Check-Ins</p>
          <p className="text-3xl font-bold text-blue-500 mt-1 tabular-nums">{totalCheckIns}</p>
        </div>
      </div>

      <div className="rounded-none border border-[#152A54] bg-[#060D1A] p-6 space-y-4">
        <h2 className="text-base font-bold text-white uppercase tracking-wider">&gt; Event-Wise Breakdown</h2>
        <div className="divide-y divide-[#152A54]">
          {events.map((ev) => (
            <div key={ev.id} className="py-3 flex justify-between items-center text-xs">
              <span className="font-semibold text-white">{ev.name}</span>
              <span className="text-blue-400 font-bold">
                {ev._count.registrations} / {ev.capacity} SEATS
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

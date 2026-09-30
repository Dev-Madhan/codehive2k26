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
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Reports & Analytics</h1>
        <p className="text-sm text-muted">Summary and exportable event data.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs text-muted">Total Registrations</p>
          <p className="text-2xl font-bold text-cyan mt-1">{totalRegistrations}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs text-muted">Confirmed Registrations</p>
          <p className="text-2xl font-bold text-mint mt-1">{confirmedRegistrations}</p>
        </div>
        <div className="rounded-xl border border-border bg-surface p-5">
          <p className="text-xs text-muted">Total Check-Ins</p>
          <p className="text-2xl font-bold text-primary mt-1">{totalCheckIns}</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface p-6 space-y-4">
        <h2 className="text-lg font-bold">Event-wise Breakdown</h2>
        <div className="divide-y divide-border">
          {events.map((ev) => (
            <div key={ev.id} className="py-3 flex justify-between items-center text-sm">
              <span className="font-medium text-foreground">{ev.name}</span>
              <span className="text-muted">
                {ev._count.registrations} / {ev.capacity}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

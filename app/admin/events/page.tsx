import prisma from "@/lib/prisma";
import { EventsClient } from "@/components/admin/events-client";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    include: {
      category: {
        select: {
          id: true,
          name: true,
        },
      },
      _count: {
        select: { registrations: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-5 font-mono max-w-full">
      <div className="border-b border-[#152A54] pb-3 sm:pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 mb-2">
            &gt; admin / event_catalog
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">Event Management</h1>
          <p className="text-xs text-slate-400 mt-1">Configure, monitor, and manage symposium events and capacity flow.</p>
        </div>
      </div>

      <EventsClient initialEvents={events} />
    </div>
  );
}

import prisma from "@/lib/prisma";
import { EventsClient } from "@/components/admin/events-client";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function AdminEventsPage() {
  const [events, categories] = await Promise.all([
    prisma.event.findMany({
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        _count: {
          select: {
            registrations: true,
            teams: true,
          },
        },
      },
      orderBy: { createdAt: "desc" },
    }),
    prisma.eventCategory.findMany({
      orderBy: { name: "asc" },
    }),
  ]);

  return (
    <div className="space-y-5 font-mono max-w-full">
      <div className="border-b border-[#262626] pb-3 sm:pb-4 flex flex-col sm:flex-row sm:justify-between sm:items-end gap-2">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-black bg-white border border-white mb-2">
            &gt; admin / event_catalog
          </div>
          <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">Event Management</h1>
          <p className="text-xs text-[#A3A3A3] mt-1">Configure, monitor, and manage symposium events and registration flow.</p>
        </div>
      </div>

      <EventsClient initialEvents={events} categories={categories} />
    </div>
  );
}

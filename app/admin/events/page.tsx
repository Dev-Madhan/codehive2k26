import prisma from "@/lib/prisma";
import { formatDate } from "@/utils/formatters";

export default async function AdminEventsPage() {
  const events = await prisma.event.findMany({
    include: {
      category: true,
      _count: {
        select: { registrations: true },
      },
    },
    orderBy: { createdAt: "desc" },
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Event Management</h1>
          <p className="text-sm text-muted">Create, edit, and configure symposium events.</p>
        </div>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-elevated text-xs uppercase text-muted border-b border-border">
            <tr>
              <th className="px-4 py-3">Event Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Capacity</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted">
                  No events found.
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <tr key={e.id} className="hover:bg-surface-hover/50">
                  <td className="px-4 py-3 font-medium text-foreground">{e.name}</td>
                  <td className="px-4 py-3 text-muted">{e.category?.name || "General"}</td>
                  <td className="px-4 py-3 text-muted">{formatDate(e.startAt)}</td>
                  <td className="px-4 py-3 text-muted">
                    {e._count.registrations} / {e.capacity}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full border border-border bg-surface-elevated">
                      {e.status}
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

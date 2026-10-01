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
    <div className="space-y-6 font-mono">
      <div className="border-b border-[#152A54] pb-4 flex justify-between items-end">
        <div>
          <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 mb-2">
            &gt; admin / event_catalog
          </div>
          <h1 className="text-2xl font-bold tracking-tight text-white uppercase">Event Management</h1>
          <p className="text-xs text-slate-400 mt-1">Configure, monitor, and manage symposium events.</p>
        </div>
      </div>

      <div className="rounded-none border border-[#152A54] bg-[#060D1A] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#03060E] text-[11px] uppercase tracking-wider text-slate-400 border-b border-[#152A54]">
            <tr>
              <th className="px-4 py-3">Event Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Capacity</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#152A54]">
            {events.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500">
                  No events found.
                </td>
              </tr>
            ) : (
              events.map((e) => (
                <tr key={e.id} className="hover:bg-[#0B162C] transition-colors">
                  <td className="px-4 py-3 font-sans font-semibold text-white">{e.name}</td>
                  <td className="px-4 py-3 text-slate-300 font-mono">[ {e.category?.name || "General"} ]</td>
                  <td className="px-4 py-3 text-slate-400">{formatDate(e.startAt)}</td>
                  <td className="px-4 py-3 text-blue-400 font-bold">
                    {e._count.registrations} / {e.capacity}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-blue-500/40 bg-blue-600/15 text-blue-300 font-bold">
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

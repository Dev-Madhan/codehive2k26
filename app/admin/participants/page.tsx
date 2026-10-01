import prisma from "@/lib/prisma";

export default async function AdminParticipantsPage() {
  const participants = await prisma.participant.findMany({
    include: {
      _count: {
        select: { registrations: true },
      },
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6 font-mono">
      <div className="border-b border-[#152A54] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 mb-2">
          &gt; admin / participants_registry
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white uppercase">Participants Directory</h1>
        <p className="text-xs text-slate-400 mt-1">Verified participants registered in the system.</p>
      </div>

      <div className="rounded-none border border-[#152A54] bg-[#060D1A] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#03060E] text-[11px] uppercase tracking-wider text-slate-400 border-b border-[#152A54]">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">College</th>
              <th className="px-4 py-3">Events Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#152A54]">
            {participants.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500">
                  No participants found.
                </td>
              </tr>
            ) : (
              participants.map((p) => (
                <tr key={p.id} className="hover:bg-[#0B162C] transition-colors">
                  <td className="px-4 py-3 font-semibold text-white">{p.name}</td>
                  <td className="px-4 py-3 text-slate-300">{p.email}</td>
                  <td className="px-4 py-3 text-slate-400">{p.phone}</td>
                  <td className="px-4 py-3 text-slate-400 truncate max-w-[200px]">{p.college}</td>
                  <td className="px-4 py-3 font-bold text-blue-400">{p._count.registrations} EVENTS</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

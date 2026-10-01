import prisma from "@/lib/prisma";

export default async function AdminRegistrationsPage() {
  const registrations = await prisma.registration.findMany({
    include: {
      event: true,
      participant: true,
    },
    orderBy: { createdAt: "desc" },
    take: 50,
  });

  return (
    <div className="space-y-6 font-mono">
      <div className="border-b border-[#152A54] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 mb-2">
          &gt; admin / active_registrations
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white uppercase">Registrations</h1>
        <p className="text-xs text-slate-400 mt-1">All active registrations across events.</p>
      </div>

      <div className="rounded-none border border-[#152A54] bg-[#060D1A] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#03060E] text-[11px] uppercase tracking-wider text-slate-400 border-b border-[#152A54]">
            <tr>
              <th className="px-4 py-3">Reg ID</th>
              <th className="px-4 py-3">Participant</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">College</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Checked In</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#152A54]">
            {registrations.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-slate-500">
                  No registrations recorded yet.
                </td>
              </tr>
            ) : (
              registrations.map((r) => (
                <tr key={r.id} className="hover:bg-[#0B162C] transition-colors">
                  <td className="px-4 py-3 text-blue-400 font-bold">{r.registrationNumber}</td>
                  <td className="px-4 py-3 font-semibold text-white">{r.participant.name}</td>
                  <td className="px-4 py-3 text-slate-300">{r.event.name}</td>
                  <td className="px-4 py-3 text-slate-400 truncate max-w-[180px]">{r.participant.college}</td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-blue-500/40 bg-blue-600/15 text-blue-400 font-bold">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border ${
                        r.checkedIn
                          ? "border-blue-500/40 bg-blue-600/20 text-white font-bold"
                          : "border-[#152A54] bg-[#03060E] text-slate-500"
                      }`}
                    >
                      {r.checkedIn ? "VERIFIED" : "PENDING"}
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

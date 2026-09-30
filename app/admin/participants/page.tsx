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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Participants Directory</h1>
        <p className="text-sm text-muted">View all verified participants registered in the system.</p>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-elevated text-xs uppercase text-muted border-b border-border">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">College</th>
              <th className="px-4 py-3">Events</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {participants.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-muted">
                  No participants found.
                </td>
              </tr>
            ) : (
              participants.map((p) => (
                <tr key={p.id} className="hover:bg-surface-hover/50">
                  <td className="px-4 py-3 font-medium">{p.name}</td>
                  <td className="px-4 py-3 text-muted">{p.email}</td>
                  <td className="px-4 py-3 text-muted">{p.phone}</td>
                  <td className="px-4 py-3 text-muted">{p.college}</td>
                  <td className="px-4 py-3 text-cyan">{p._count.registrations}</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

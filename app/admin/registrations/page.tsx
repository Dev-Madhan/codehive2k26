import prisma from "@/lib/prisma";
import { formatDate } from "@/utils/formatters";

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
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Registrations</h1>
        <p className="text-sm text-muted">All active registrations across events.</p>
      </div>

      <div className="rounded-xl border border-border bg-surface overflow-hidden">
        <table className="w-full text-left text-sm">
          <thead className="bg-surface-elevated text-xs uppercase text-muted border-b border-border">
            <tr>
              <th className="px-4 py-3">Reg ID</th>
              <th className="px-4 py-3">Participant</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">College</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Checked In</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {registrations.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-muted">
                  No registrations recorded yet.
                </td>
              </tr>
            ) : (
              registrations.map((r) => (
                <tr key={r.id} className="hover:bg-surface-hover/50">
                  <td className="px-4 py-3 font-mono text-cyan text-xs">{r.registrationNumber}</td>
                  <td className="px-4 py-3 font-medium">{r.participant.name}</td>
                  <td className="px-4 py-3 text-muted">{r.event.name}</td>
                  <td className="px-4 py-3 text-muted">{r.participant.college}</td>
                  <td className="px-4 py-3">
                    <span className="text-xs px-2 py-0.5 rounded-full border border-success/30 bg-success/10 text-success">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full border ${
                        r.checkedIn
                          ? "border-mint/30 bg-mint/10 text-mint"
                          : "border-border bg-surface-elevated text-muted"
                      }`}
                    >
                      {r.checkedIn ? "Yes" : "No"}
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

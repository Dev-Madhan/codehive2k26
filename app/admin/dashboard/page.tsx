import prisma from "@/lib/prisma";
import { UsersIcon, CalendarIcon, CheckCircleIcon, BarChart3Icon } from "lucide-react";

export default async function AdminDashboardPage() {
  const [eventCount, registrationCount, checkInCount] = await Promise.all([
    prisma.event.count(),
    prisma.registration.count(),
    prisma.checkIn.count(),
  ]);

  const stats = [
    { title: "Total Events", value: eventCount, icon: CalendarIcon, color: "text-cyan" },
    { title: "Registrations", value: registrationCount, icon: UsersIcon, color: "text-primary" },
    { title: "Checked In", value: checkInCount, icon: CheckCircleIcon, color: "text-mint" },
    {
      title: "Attendance Rate",
      value: registrationCount > 0 ? `${Math.round((checkInCount / registrationCount) * 100)}%` : "0%",
      icon: BarChart3Icon,
      color: "text-warning",
    },
  ];

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Admin Overview</h1>
        <p className="text-sm text-muted">Real-time statistics for CodeHive 2K26.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="rounded-xl border border-border bg-surface p-5 space-y-2">
              <div className="flex items-center justify-between text-muted text-xs">
                <span>{s.title}</span>
                <Icon className={`size-4 ${s.color}`} />
              </div>
              <p className="text-2xl font-bold text-foreground">{s.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

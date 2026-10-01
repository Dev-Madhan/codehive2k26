import prisma from "@/lib/prisma";
import { UsersIcon, CalendarIcon, CheckCircleIcon, BarChart3Icon } from "lucide-react";

export default async function AdminDashboardPage() {
  const [eventCount, registrationCount, checkInCount] = await Promise.all([
    prisma.event.count(),
    prisma.registration.count(),
    prisma.checkIn.count(),
  ]);

  const stats = [
    { title: "Total Events", value: eventCount, icon: CalendarIcon, color: "text-blue-400" },
    { title: "Registrations", value: registrationCount, icon: UsersIcon, color: "text-blue-500" },
    { title: "Checked In", value: checkInCount, icon: CheckCircleIcon, color: "text-blue-400" },
    {
      title: "Attendance Rate",
      value: registrationCount > 0 ? `${Math.round((checkInCount / registrationCount) * 100)}%` : "0%",
      icon: BarChart3Icon,
      color: "text-amber-400",
    },
  ];

  return (
    <div className="space-y-8 font-mono">
      <div className="border-b border-[#152A54] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 mb-2">
          &gt; admin / overview
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white uppercase">Admin Console</h1>
        <p className="text-xs text-slate-400 mt-1">Real-time statistics for CodeHive 2K26 symposium.</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div key={s.title} className="rounded-none border border-[#152A54] bg-[#060D1A] p-5 space-y-2 hover:border-blue-500/40 transition-colors">
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="uppercase text-[11px] tracking-wider">{s.title}</span>
                <Icon className={`size-4 ${s.color}`} />
              </div>
              <p className="text-3xl font-bold text-white tabular-nums">{s.value}</p>
            </div>
          );
        })}
      </div>
    </div>
  );
}

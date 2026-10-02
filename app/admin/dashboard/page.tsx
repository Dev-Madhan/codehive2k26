import Link from "next/link";
import prisma from "@/lib/prisma";
import {
  UsersIcon,
  CalendarIcon,
  CheckCircleIcon,
  BarChart3Icon,
  ClipboardListIcon,
  TicketIcon,
  Settings2Icon,
  ArrowRightIcon,
  SparklesIcon,
} from "lucide-react";

export default async function AdminDashboardPage() {
  const [eventCount, registrationCount, checkInCount] = await Promise.all([
    prisma.event.count(),
    prisma.registration.count(),
    prisma.checkIn.count(),
  ]);

  const stats = [
    { title: "Total Events", value: eventCount, icon: CalendarIcon, color: "text-blue-400" },
    { title: "Registrations", value: registrationCount, icon: UsersIcon, color: "text-blue-500" },
    { title: "Checked In", value: checkInCount, icon: CheckCircleIcon, color: "text-emerald-400" },
    {
      title: "Attendance",
      value: registrationCount > 0 ? `${Math.round((checkInCount / registrationCount) * 100)}%` : "0%",
      icon: BarChart3Icon,
      color: "text-amber-400",
    },
  ];

  const quickActions = [
    {
      label: "Live Registrations",
      desc: "Manage attendee list & bus stops",
      href: "/admin/registrations",
      icon: ClipboardListIcon,
      color: "text-blue-400 border-blue-500/30",
    },
    {
      label: "Gate Pass Verifier",
      desc: "QR scanner & 6-char pass admission",
      href: "/admin/check-in",
      icon: TicketIcon,
      color: "text-emerald-400 border-emerald-500/30",
    },
    {
      label: "Event Catalog",
      desc: "Monitor seat capacity & formats",
      href: "/admin/events",
      icon: CalendarIcon,
      color: "text-sky-400 border-sky-500/30",
    },
    {
      label: "Reports & Analytics",
      desc: "CSV export & turnout metrics",
      href: "/admin/reports",
      icon: BarChart3Icon,
      color: "text-amber-400 border-amber-500/30",
    },
  ];

  return (
    <div className="space-y-6 font-mono max-w-full">
      <div className="border-b border-[#152A54] pb-3 sm:pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 mb-2">
          &gt; admin / overview
        </div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-white uppercase">Admin Console</h1>
        <p className="text-xs text-slate-400 mt-1">Real-time statistics for CodeHive 2K26 symposium.</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {stats.map((s) => {
          const Icon = s.icon;
          return (
            <div
              key={s.title}
              className="rounded-none border border-[#152A54] bg-[#060D1A] p-3.5 sm:p-5 space-y-1.5 sm:space-y-2 hover:border-blue-500/40 transition-colors"
            >
              <div className="flex items-center justify-between text-slate-400 text-xs">
                <span className="uppercase text-[10px] sm:text-[11px] tracking-wider truncate">{s.title}</span>
                <Icon className={`size-3.5 sm:size-4 shrink-0 ${s.color}`} />
              </div>
              <p className="text-2xl sm:text-3xl font-bold text-white tabular-nums">{s.value}</p>
            </div>
          );
        })}
      </div>

      {/* ── Mobile Fast Command Hub (Touch Quick Links) ── */}
      <div className="border border-[#152A54] bg-[#060D1A] p-4 sm:p-6 space-y-3.5">
        <div className="flex items-center justify-between border-b border-[#152A54] pb-3">
          <h2 className="text-xs sm:text-sm font-bold text-white uppercase tracking-wider">
            &gt; Quick Operations Launchpad
          </h2>
          <span className="text-[10px] text-blue-400 font-mono">CONSOLE</span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-4">
          {quickActions.map((qa) => {
            const Icon = qa.icon;
            return (
              <Link
                key={qa.label}
                href={qa.href}
                className="flex items-center justify-between p-3.5 bg-[#03060E] border border-[#152A54] hover:border-blue-500/50 hover:bg-[#0B162C]/50 transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-3 min-w-0">
                  <div className={`p-2 border bg-[#060D1A] ${qa.color} shrink-0`}>
                    <Icon className="size-4" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-white group-hover:text-blue-400 transition-colors truncate">
                      {qa.label}
                    </p>
                    <p className="text-[10px] text-slate-400 truncate">{qa.desc}</p>
                  </div>
                </div>
                <ArrowRightIcon className="size-4 text-slate-500 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

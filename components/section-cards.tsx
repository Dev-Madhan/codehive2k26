"use client";

import * as React from "react";
import {
  UsersIcon,
  CalendarDaysIcon,
  QrCodeIcon,
  RadioIcon,
  BusIcon,
} from "lucide-react";
import type { DashboardStats } from "@/types/dashboard";

export function SectionCards({ stats }: { stats?: DashboardStats }) {
  const cards = React.useMemo(() => {
    if (!stats) {
      return [
        {
          label: "Registrations",
          value: "0",
          detail: "0 confirmed",
          icon: UsersIcon,
        },
        {
          label: "Active Events",
          value: "0",
          detail: "Tracks Published",
          icon: CalendarDaysIcon,
        },
        {
          label: "Checked In",
          value: "0",
          detail: "0% turnout",
          icon: QrCodeIcon,
        },
        {
          label: "Gate Status",
          value: "ONLINE",
          detail: "All Gates Active",
          icon: RadioIcon,
          isStatus: true,
        },
      ];
    }

    return [
      {
        label: "Total Registrations",
        value: stats.totalRegistrations.toLocaleString(),
        detail: `${stats.confirmedRegistrations} confirmed`,
        icon: UsersIcon,
      },
      {
        label: "Active Events",
        value: stats.activeEventsCount.toString(),
        detail: "Symposium Tracks",
        icon: CalendarDaysIcon,
      },
      {
        label: "Checked In",
        value: stats.totalCheckIns.toLocaleString(),
        detail: `${stats.turnoutRate}% turnout`,
        icon: QrCodeIcon,
      },
      {
        label: "Transit & Gates",
        value: "ONLINE",
        detail:
          stats.busRegistrations > 0
            ? `${stats.busRegistrations} bus passes`
            : "All gates active",
        icon: stats.busRegistrations > 0 ? BusIcon : RadioIcon,
        isStatus: true,
      },
    ];
  }, [stats]);

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 px-3 sm:px-4 lg:px-6 font-mono">
      {cards.map((s) => {
        const Icon = s.icon;
        return (
          <div
            key={s.label}
            className="border border-[#152A54] bg-[#060D1A] p-3 sm:p-4 transition-colors hover:border-blue-500/40 relative group"
          >
            <div className="flex items-center justify-between text-slate-400 gap-1">
              <span className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-wider text-slate-400 truncate">
                {s.label}
              </span>
              <Icon className="size-3.5 text-blue-400 shrink-0" />
            </div>

            <div className="mt-2 sm:mt-3 flex items-baseline justify-between gap-1 flex-wrap">
              <span className="text-xl sm:text-2xl font-bold tracking-tight text-white tabular-nums">
                {s.value}
              </span>
              <span
                className={`text-[10px] sm:text-[11px] font-medium shrink-0 flex items-center gap-1 ${
                  s.isStatus ? "text-emerald-400 font-semibold" : "text-slate-400"
                }`}
              >
                {s.isStatus && <span className="size-1.5 bg-emerald-400 rounded-none animate-pulse shrink-0" />}
                {s.detail}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

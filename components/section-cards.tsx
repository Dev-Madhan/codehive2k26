"use client";

import * as React from "react";
import {
  UsersIcon,
  CalendarDaysIcon,
  QrCodeIcon,
  RadioIcon,
} from "lucide-react";

const stats = [
  {
    label: "Registrations",
    value: "1,248",
    detail: "+18% vs target",
    icon: UsersIcon,
  },
  {
    label: "Active Events",
    value: "12",
    detail: "4 tracks open",
    icon: CalendarDaysIcon,
  },
  {
    label: "Checked In",
    value: "892",
    detail: "71.5% turnout",
    icon: QrCodeIcon,
  },
  {
    label: "Gate Status",
    value: "ONLINE",
    detail: "83% capacity",
    icon: RadioIcon,
    isStatus: true,
  },
];

export function SectionCards() {
  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-3 px-3 sm:px-4 lg:px-6 font-mono">
      {stats.map((s) => {
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

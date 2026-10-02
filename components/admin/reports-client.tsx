"use client";

import * as React from "react";
import {
  BarChart3Icon,
  UsersIcon,
  CheckCircle2Icon,
  BusIcon,
  TrendingUpIcon,
  DownloadIcon,
  CalendarDaysIcon,
  SearchIcon,
  ShieldCheckIcon,
} from "lucide-react";
import { toast } from "sonner";

interface EventReportItem {
  id: string;
  name: string;
  capacity: number;
  status: string;
  category?: { name: string } | null;
  _count: {
    registrations: number;
  };
}

export function ReportsClient({
  totalRegistrations,
  confirmedRegistrations,
  totalCheckIns,
  busRegistrations,
  events,
}: {
  totalRegistrations: number;
  confirmedRegistrations: number;
  totalCheckIns: number;
  busRegistrations: number;
  events: EventReportItem[];
}) {
  const [search, setSearch] = React.useState("");

  const attendanceRate =
    totalRegistrations > 0
      ? Math.round((totalCheckIns / totalRegistrations) * 100)
      : 0;

  const filteredEvents = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return events;
    return events.filter(
      (e) =>
        e.name.toLowerCase().includes(q) ||
        (e.category?.name && e.category.name.toLowerCase().includes(q))
    );
  }, [events, search]);

  const handleExportSummary = () => {
    try {
      const csvRows = [
        ["Event Name", "Category", "Registrations", "Capacity", "Occupancy %", "Status"],
        ...events.map((e) => {
          const pct = e.capacity > 0 ? Math.round((e._count.registrations / e.capacity) * 100) : 0;
          return [
            `"${e.name.replace(/"/g, '""')}"`,
            `"${e.category?.name || "General"}"`,
            e._count.registrations,
            e.capacity,
            `${pct}%`,
            e.status,
          ];
        }),
      ];
      const blob = new Blob([csvRows.map((r) => r.join(",")).join("\n")], {
        type: "text/csv;charset=utf-8;",
      });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `codehive-symposium-report-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      toast.success("Symposium report CSV downloaded!");
    } catch {
      toast.error("Failed to generate CSV export");
    }
  };

  return (
    <div className="space-y-5 font-mono max-w-full">
      {/* ── Metric Summary Cards (Mobile Responsive) ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="border border-[#152A54] bg-[#060D1A] p-3 sm:p-5 hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider">Total Regs</span>
            <UsersIcon className="size-3.5 text-blue-400" />
          </div>
          <p className="text-xl sm:text-3xl font-bold text-blue-400 mt-2 tabular-nums">
            {totalRegistrations}
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-500 mt-1">100% recorded</p>
        </div>

        <div className="border border-[#152A54] bg-[#060D1A] p-3 sm:p-5 hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider">Confirmed</span>
            <ShieldCheckIcon className="size-3.5 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-3xl font-bold text-white mt-2 tabular-nums">
            {confirmedRegistrations}
          </p>
          <p className="text-[10px] sm:text-[11px] text-emerald-400/80 mt-1">
            {totalRegistrations > 0 ? Math.round((confirmedRegistrations / totalRegistrations) * 100) : 0}% validated
          </p>
        </div>

        <div className="border border-[#152A54] bg-[#060D1A] p-3 sm:p-5 hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider">Turnout Rate</span>
            <CheckCircle2Icon className="size-3.5 text-emerald-400" />
          </div>
          <p className="text-xl sm:text-3xl font-bold text-emerald-400 mt-2 tabular-nums">
            {attendanceRate}%
          </p>
          <p className="text-[10px] sm:text-[11px] text-slate-400 mt-1">
            {totalCheckIns} gate check-ins
          </p>
        </div>

        <div className="border border-[#152A54] bg-[#060D1A] p-3 sm:p-5 hover:border-blue-500/40 transition-colors">
          <div className="flex items-center justify-between text-slate-400">
            <span className="text-[10px] sm:text-[11px] uppercase tracking-wider">Bus Transit</span>
            <BusIcon className="size-3.5 text-sky-400" />
          </div>
          <p className="text-xl sm:text-3xl font-bold text-sky-400 mt-2 tabular-nums">
            {busRegistrations}
          </p>
          <p className="text-[10px] sm:text-[11px] text-amber-400 mt-1">6:00 AM Pickup</p>
        </div>
      </div>

      {/* ── Attendance Velocity Progress Bar ── */}
      <div className="border border-[#152A54] bg-[#060D1A] p-4 sm:p-5 space-y-2.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-slate-300 font-bold uppercase flex items-center gap-1.5">
            <TrendingUpIcon className="size-3.5 text-emerald-400" />
            Gate Attendance Inflow
          </span>
          <span className="text-emerald-400 font-bold tabular-nums">
            {totalCheckIns} of {totalRegistrations} checked in ({attendanceRate}%)
          </span>
        </div>
        <div className="w-full h-2.5 bg-[#03060E] border border-[#152A54] overflow-hidden">
          <div
            className="h-full bg-linear-to-r from-blue-600 via-blue-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${Math.min(100, attendanceRate)}%` }}
          />
        </div>
      </div>

      {/* ── Event Breakdown Section ── */}
      <div className="border border-[#152A54] bg-[#060D1A] p-4 sm:p-6 space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#152A54] pb-4">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-white uppercase tracking-wider">
              &gt; Event Occupancy &amp; Registrations
            </h2>
            <p className="text-xs text-slate-400 mt-0.5">Capacity breakdown per symposium track.</p>
          </div>

          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-48">
              <SearchIcon className="absolute left-2.5 top-1/2 -translate-y-1/2 size-3 text-slate-500" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Filter events..."
                className="w-full bg-[#03060E] border border-[#152A54] pl-7 pr-2 py-1 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500 rounded-none"
              />
            </div>
            <button
              type="button"
              onClick={handleExportSummary}
              className="inline-flex items-center gap-1.5 px-3 py-1 font-mono text-xs uppercase font-semibold text-white bg-blue-600 hover:bg-blue-500 border border-blue-500 transition-colors cursor-pointer shrink-0"
            >
              <DownloadIcon className="size-3" />
              <span className="hidden sm:inline">[ Export CSV ]</span>
              <span className="sm:hidden">CSV</span>
            </button>
          </div>
        </div>

        {/* ── Mobile Event Cards (< md) ── */}
        <div className="block md:hidden space-y-3">
          {filteredEvents.length === 0 ? (
            <p className="text-xs text-slate-500 py-4 text-center">No matching events found.</p>
          ) : (
            filteredEvents.map((ev) => {
              const fillPct =
                ev.capacity > 0
                  ? Math.min(100, Math.round((ev._count.registrations / ev.capacity) * 100))
                  : 0;
              const isFull = fillPct >= 100;

              return (
                <div
                  key={ev.id}
                  className="bg-[#03060E] border border-[#152A54] p-3 space-y-2 hover:border-blue-500/40 transition-colors"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <span className="text-[10px] text-blue-400 font-bold uppercase bg-blue-950/40 border border-blue-500/30 px-1.5 py-0.5 inline-block mb-1">
                        {ev.category?.name || "General"}
                      </span>
                      <h3 className="text-xs font-bold text-white leading-snug">{ev.name}</h3>
                    </div>
                    <span
                      className={`text-[10px] font-bold uppercase px-1.5 py-0.5 shrink-0 border ${
                        isFull
                          ? "border-red-500/40 bg-red-950/40 text-red-400"
                          : "border-blue-500/40 bg-blue-950/40 text-blue-300"
                      }`}
                    >
                      {isFull ? "FULL" : `${ev.capacity - ev._count.registrations} LEFT`}
                    </span>
                  </div>

                  <div className="space-y-1 pt-1">
                    <div className="flex justify-between text-[11px]">
                      <span className="text-slate-400">Seats:</span>
                      <span className="font-bold text-white tabular-nums">
                        {ev._count.registrations} / {ev.capacity} ({fillPct}%)
                      </span>
                    </div>
                    <div className="w-full h-1.5 bg-[#060D1A] border border-[#152A54]">
                      <div
                        className={`h-full ${
                          isFull
                            ? "bg-red-500"
                            : fillPct >= 80
                            ? "bg-amber-400"
                            : "bg-blue-500"
                        }`}
                        style={{ width: `${fillPct}%` }}
                      />
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* ── Desktop List View (>= md) ── */}
        <div className="hidden md:block divide-y divide-[#152A54]">
          {filteredEvents.length === 0 ? (
            <p className="text-xs text-slate-500 py-6 text-center">No matching events found.</p>
          ) : (
            filteredEvents.map((ev) => {
              const fillPct =
                ev.capacity > 0
                  ? Math.min(100, Math.round((ev._count.registrations / ev.capacity) * 100))
                  : 0;

              return (
                <div key={ev.id} className="py-3 flex items-center justify-between text-xs gap-4 hover:bg-[#0B162C]/40 px-2 transition-colors">
                  <div className="flex items-center gap-3 min-w-0">
                    <span className="text-[10px] font-mono text-blue-400 uppercase bg-blue-950/30 border border-blue-500/30 px-2 py-0.5 shrink-0">
                      {ev.category?.name || "General"}
                    </span>
                    <span className="font-semibold text-white truncate">{ev.name}</span>
                  </div>

                  <div className="flex items-center gap-4 shrink-0">
                    <div className="w-32 space-y-1">
                      <div className="flex justify-between text-[10px]">
                        <span className="text-slate-400">Fill:</span>
                        <span className="font-bold text-blue-400">{fillPct}%</span>
                      </div>
                      <div className="w-full h-1.5 bg-[#03060E] border border-[#152A54]">
                        <div
                          className={`h-full ${
                            fillPct >= 100
                              ? "bg-red-500"
                              : fillPct >= 80
                              ? "bg-amber-400"
                              : "bg-blue-500"
                          }`}
                          style={{ width: `${fillPct}%` }}
                        />
                      </div>
                    </div>

                    <span className="text-blue-400 font-bold min-w-[100px] text-right">
                      {ev._count.registrations} / {ev.capacity} SEATS
                    </span>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}

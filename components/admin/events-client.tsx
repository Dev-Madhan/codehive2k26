"use client";

import * as React from "react";
import {
  CalendarDaysIcon,
  SearchIcon,
  UsersIcon,
  TagIcon,
  MapPinIcon,
  XIcon,
  SparklesIcon,
} from "lucide-react";
import { formatDate } from "@/utils/formatters";

export interface EventItem {
  id: string;
  name: string;
  slug: string;
  venue: string;
  startAt: Date | string;
  capacity: number;
  status: string;
  isTeamEvent: boolean;
  minTeamSize: number;
  maxTeamSize: number;
  category?: {
    id: string;
    name: string;
  } | null;
  _count: {
    registrations: number;
  };
}

export function EventsClient({ initialEvents }: { initialEvents: EventItem[] }) {
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");

  const categories = React.useMemo(() => {
    const set = new Set<string>();
    initialEvents.forEach((e) => {
      if (e.category?.name) set.add(e.category.name);
    });
    return Array.from(set);
  }, [initialEvents]);

  const filteredEvents = React.useMemo(() => {
    return initialEvents.filter((e) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        e.name.toLowerCase().includes(q) ||
        (e.venue && e.venue.toLowerCase().includes(q)) ||
        (e.category?.name && e.category.name.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (selectedCategory !== "ALL" && e.category?.name !== selectedCategory) {
        return false;
      }

      return true;
    });
  }, [initialEvents, search, selectedCategory]);

  const totalCapacity = initialEvents.reduce((acc, e) => acc + e.capacity, 0);
  const totalRegistrations = initialEvents.reduce((acc, e) => acc + e._count.registrations, 0);
  const overallPercentage = totalCapacity > 0 ? Math.round((totalRegistrations / totalCapacity) * 100) : 0;

  return (
    <div className="space-y-4 font-mono">
      {/* ── Top Metrics Overview (Mobile Ergonomic) ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="border border-[#152A54] bg-[#060D1A] p-2.5 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400">Total Events</p>
          <p className="text-lg sm:text-2xl font-bold text-white mt-0.5 tabular-nums">
            {initialEvents.length}
          </p>
        </div>
        <div className="border border-[#152A54] bg-[#060D1A] p-2.5 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-blue-400">Total Seats</p>
          <p className="text-lg sm:text-2xl font-bold text-blue-400 mt-0.5 tabular-nums">
            {totalCapacity}
          </p>
        </div>
        <div className="border border-[#152A54] bg-[#060D1A] p-2.5 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-emerald-400">Occupancy</p>
          <p className="text-lg sm:text-2xl font-bold text-emerald-400 mt-0.5 tabular-nums">
            {overallPercentage}%
          </p>
        </div>
      </div>

      {/* ── Search & Category Filter ── */}
      <div className="flex flex-col gap-2.5 border border-[#152A54] bg-[#060D1A] p-3">
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search events by title, category, venue..."
            className="w-full bg-[#03060E] border border-[#152A54] pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500 rounded-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-0.5"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>

        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-xs">
          <button
            type="button"
            onClick={() => setSelectedCategory("ALL")}
            className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
              selectedCategory === "ALL"
                ? "bg-blue-600 text-white border-blue-500 shadow-xs"
                : "bg-[#03060E] text-slate-400 border-[#152A54] hover:bg-[#0B162C] hover:text-slate-200"
            }`}
          >
            All Tracks ({initialEvents.length})
          </button>
          {categories.map((cat) => {
            const count = initialEvents.filter((e) => e.category?.name === cat).length;
            const isActive = selectedCategory === cat;
            return (
              <button
                key={cat}
                type="button"
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-500 shadow-xs"
                    : "bg-[#03060E] text-slate-400 border-[#152A54] hover:bg-[#0B162C] hover:text-slate-200"
                }`}
              >
                {cat} ({count})
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Result Counter ── */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredEvents.length}</strong> of {initialEvents.length} events
        </span>
        {(search || selectedCategory !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("ALL");
            }}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            [ Clear Filter ]
          </button>
        )}
      </div>

      {/* ── Mobile Card View (< md) ── */}
      <div className="block md:hidden space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="border border-[#152A54] bg-[#060D1A] p-8 text-center text-xs text-slate-500">
            No events match your search criteria.
          </div>
        ) : (
          filteredEvents.map((e) => {
            const fillPct = e.capacity > 0 ? Math.min(100, Math.round((e._count.registrations / e.capacity) * 100)) : 0;
            const isFull = fillPct >= 100;
            const isNearlyFull = fillPct >= 80;

            return (
              <div
                key={e.id}
                className="border border-[#152A54] bg-[#060D1A] p-3.5 space-y-3 transition-colors hover:border-blue-500/40 relative"
              >
                {/* Header: Category Badge + Status */}
                <div className="flex items-center justify-between gap-2 border-b border-[#152A54] pb-2">
                  <span className="text-[10px] uppercase font-bold text-blue-400 bg-blue-950/40 border border-blue-500/30 px-2 py-0.5">
                    [ {e.category?.name || "General"} ]
                  </span>
                  <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 font-bold border border-blue-500/40 bg-blue-600/15 text-blue-300">
                    {e.status}
                  </span>
                </div>

                {/* Event Name & Format */}
                <div className="space-y-1">
                  <h3 className="text-sm font-bold text-white font-sans">{e.name}</h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <CalendarDaysIcon className="size-3 text-slate-500" />
                      {formatDate(e.startAt)}
                    </span>
                    {e.venue && (
                      <span className="flex items-center gap-1 truncate max-w-[180px]">
                        <MapPinIcon className="size-3 text-slate-500 shrink-0" />
                        <span className="truncate">{e.venue}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Capacity Progress Bar */}
                <div className="space-y-1.5 pt-1 border-t border-[#152A54]/60">
                  <div className="flex items-center justify-between text-xs">
                    <span className="text-slate-400 text-[10px] uppercase">Capacity Flow:</span>
                    <span
                      className={`text-xs font-bold tabular-nums ${
                        isFull
                          ? "text-red-400"
                          : isNearlyFull
                          ? "text-amber-400"
                          : "text-blue-400"
                      }`}
                    >
                      {e._count.registrations} / {e.capacity} seats ({fillPct}%)
                    </span>
                  </div>
                  {/* Visual Bar */}
                  <div className="w-full h-2 bg-[#03060E] border border-[#152A54] overflow-hidden">
                    <div
                      className={`h-full transition-all duration-300 ${
                        isFull
                          ? "bg-red-500"
                          : isNearlyFull
                          ? "bg-amber-400"
                          : "bg-blue-500"
                      }`}
                      style={{ width: `${fillPct}%` }}
                    />
                  </div>
                </div>

                {/* Team / Format Tag */}
                <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1">
                  <span>Participation:</span>
                  <span className="text-slate-300">
                    {e.isTeamEvent ? `Team (${e.minTeamSize}-${e.maxTeamSize} members)` : "Solo Entry"}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Desktop Table View (>= md) ── */}
      <div className="hidden md:block rounded-none border border-[#152A54] bg-[#060D1A] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#03060E] text-[11px] uppercase tracking-wider text-slate-400 border-b border-[#152A54]">
            <tr>
              <th className="px-4 py-3">Event Name</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3">Capacity &amp; Fill</th>
              <th className="px-4 py-3">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#152A54]">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500">
                  No events found.
                </td>
              </tr>
            ) : (
              filteredEvents.map((e) => {
                const fillPct = e.capacity > 0 ? Math.min(100, Math.round((e._count.registrations / e.capacity) * 100)) : 0;
                return (
                  <tr key={e.id} className="hover:bg-[#0B162C] transition-colors">
                    <td className="px-4 py-3">
                      <p className="font-sans font-semibold text-white">{e.name}</p>
                      <p className="text-[10px] text-slate-500">{e.isTeamEvent ? `Team (${e.minTeamSize}-${e.maxTeamSize})` : "Solo"}</p>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-mono">[ {e.category?.name || "General"} ]</td>
                    <td className="px-4 py-3 text-slate-400">{formatDate(e.startAt)}</td>
                    <td className="px-4 py-3">
                      <div className="space-y-1 min-w-[130px]">
                        <div className="flex justify-between text-[11px]">
                          <span className="font-bold text-blue-400">{e._count.registrations} / {e.capacity}</span>
                          <span className="text-slate-400">{fillPct}%</span>
                        </div>
                        <div className="w-full h-1.5 bg-[#03060E] border border-[#152A54]">
                          <div
                            className={`h-full ${fillPct >= 100 ? "bg-red-500" : fillPct >= 80 ? "bg-amber-400" : "bg-blue-500"}`}
                            style={{ width: `${fillPct}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-blue-500/40 bg-blue-600/15 text-blue-300 font-bold">
                        {e.status}
                      </span>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

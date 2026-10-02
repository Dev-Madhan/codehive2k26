"use client";

import * as React from "react";
import {
  SearchIcon,
  CheckCircle2Icon,
  ClockIcon,
  BusIcon,
  CopyIcon,
  CheckIcon,
  Building2Icon,
  CalendarIcon,
  FilterIcon,
  XIcon,
  UserIcon,
} from "lucide-react";
import { toast } from "sonner";

export interface RegistrationItem {
  id: string;
  registrationNumber: string;
  status: string;
  checkedIn: boolean;
  transportOptIn: boolean;
  pickupRoute?: string | null;
  pickupStop?: string | null;
  pickupLandmark?: string | null;
  passengersCount: number;
  createdAt: Date | string;
  participant: {
    name: string;
    email: string;
    phone: string;
    college: string;
  };
  event: {
    name: string;
    slug?: string;
  };
}

export function RegistrationsClient({
  initialRegistrations,
}: {
  initialRegistrations: RegistrationItem[];
}) {
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<"ALL" | "CHECKED_IN" | "PENDING" | "BUS">("ALL");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopy = (regNo: string) => {
    navigator.clipboard.writeText(regNo);
    setCopiedId(regNo);
    toast.success(`Copied Pass Code: ${regNo}`);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  const filteredRegistrations = React.useMemo(() => {
    return initialRegistrations.filter((r) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.registrationNumber.toLowerCase().includes(q) ||
        r.participant.name.toLowerCase().includes(q) ||
        r.participant.college.toLowerCase().includes(q) ||
        r.event.name.toLowerCase().includes(q) ||
        (r.pickupStop && r.pickupStop.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (filter === "CHECKED_IN") return r.checkedIn;
      if (filter === "PENDING") return !r.checkedIn;
      if (filter === "BUS") return r.transportOptIn;

      return true;
    });
  }, [initialRegistrations, search, filter]);

  const totalCount = initialRegistrations.length;
  const checkedInCount = initialRegistrations.filter((r) => r.checkedIn).length;
  const busCount = initialRegistrations.filter((r) => r.transportOptIn).length;

  return (
    <div className="space-y-4 font-mono">
      {/* ── Top Metric Cards (Optimized for Mobile) ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="border border-[#152A54] bg-[#060D1A] p-2.5 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400">Total</p>
          <p className="text-lg sm:text-2xl font-bold text-white mt-0.5 tabular-nums">{totalCount}</p>
        </div>
        <div className="border border-[#152A54] bg-[#060D1A] p-2.5 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-emerald-400">Verified</p>
          <p className="text-lg sm:text-2xl font-bold text-emerald-400 mt-0.5 tabular-nums">
            {checkedInCount}
            <span className="text-[10px] sm:text-xs text-slate-400 font-normal ml-1">
              ({totalCount > 0 ? Math.round((checkedInCount / totalCount) * 100) : 0}%)
            </span>
          </p>
        </div>
        <div className="border border-[#152A54] bg-[#060D1A] p-2.5 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-sky-400">Bus Opt-in</p>
          <p className="text-lg sm:text-2xl font-bold text-sky-400 mt-0.5 tabular-nums">{busCount}</p>
        </div>
      </div>

      {/* ── Search & Filter Controls ── */}
      <div className="flex flex-col gap-2.5 border border-[#152A54] bg-[#060D1A] p-3">
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by attendee, pass code, event, college..."
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

        {/* Filter Pills - Horizontal Scrollable on Mobile */}
        <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5 text-xs">
          {[
            { id: "ALL", label: `All (${totalCount})` },
            { id: "CHECKED_IN", label: `Verified (${checkedInCount})` },
            { id: "PENDING", label: `Pending (${totalCount - checkedInCount})` },
            { id: "BUS", label: `Bus (${busCount})` },
          ].map((tab) => {
            const isActive = filter === tab.id;
            return (
              <button
                key={tab.id}
                type="button"
                onClick={() => setFilter(tab.id as typeof filter)}
                className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                  isActive
                    ? "bg-blue-600 text-white border-blue-500 shadow-xs"
                    : "bg-[#03060E] text-slate-400 border-[#152A54] hover:bg-[#0B162C] hover:text-slate-200"
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>
      </div>

      {/* ── Results Count Bar ── */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredRegistrations.length}</strong> of {totalCount} registrations
        </span>
        {(search || filter !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setFilter("ALL");
            }}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            [ Reset Filters ]
          </button>
        )}
      </div>

      {/* ── Mobile Card View (< md) ── */}
      <div className="block md:hidden space-y-3">
        {filteredRegistrations.length === 0 ? (
          <div className="border border-[#152A54] bg-[#060D1A] p-8 text-center text-xs text-slate-500">
            No registrations match your search criteria.
          </div>
        ) : (
          filteredRegistrations.map((r) => (
            <div
              key={r.id}
              className="border border-[#152A54] bg-[#060D1A] p-3.5 space-y-2.5 transition-colors hover:border-blue-500/40 relative"
            >
              {/* Card Header: Reg ID + Status Badges */}
              <div className="flex items-center justify-between gap-2 border-b border-[#152A54] pb-2">
                <button
                  type="button"
                  onClick={() => handleCopy(r.registrationNumber)}
                  className="flex items-center gap-1.5 text-blue-400 font-bold text-xs bg-blue-950/40 border border-blue-500/30 px-2 py-0.5 hover:bg-blue-900/50 transition-colors cursor-pointer"
                  title="Click to copy pass code"
                >
                  <span>{r.registrationNumber}</span>
                  {copiedId === r.registrationNumber ? (
                    <CheckIcon className="size-3 text-emerald-400" />
                  ) : (
                    <CopyIcon className="size-3 text-blue-400/80" />
                  )}
                </button>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span
                    className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 border ${
                      r.checkedIn
                        ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400"
                        : "border-[#152A54] bg-[#03060E] text-slate-500"
                    }`}
                  >
                    {r.checkedIn ? "VERIFIED" : "PENDING"}
                  </span>
                </div>
              </div>

              {/* Attendee Info */}
              <div className="space-y-1">
                <p className="text-sm font-bold text-white">{r.participant.name}</p>
                <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                  <Building2Icon className="size-3 text-slate-500 shrink-0" />
                  <span className="truncate">{r.participant.college}</span>
                </div>
              </div>

              {/* Event Info */}
              <div className="flex items-center justify-between gap-2 text-xs pt-1">
                <span className="text-slate-400 text-[11px] uppercase">Event:</span>
                <span className="text-slate-200 font-semibold truncate text-right">{r.event.name}</span>
              </div>

              {/* Transport Details (Crucial for Mobile) */}
              <div className="pt-2 border-t border-[#152A54]/60">
                {r.transportOptIn ? (
                  <div className="bg-[#03060E] border border-sky-500/30 p-2 space-y-1 text-xs">
                    <div className="flex items-center justify-between">
                      <span className="inline-flex items-center gap-1 text-[10px] font-bold text-sky-400 uppercase tracking-wider">
                        <BusIcon className="size-3" />
                        BUS • {r.passengersCount} SEAT{r.passengersCount > 1 ? "S" : ""}
                      </span>
                      <span className="text-[10px] text-amber-400 font-bold">DEP: 6:00 AM</span>
                    </div>
                    {r.pickupStop && (
                      <p className="text-white text-[11px] font-semibold truncate">
                        Stop: {r.pickupStop}
                      </p>
                    )}
                    {r.pickupLandmark && (
                      <p className="text-slate-400 text-[10px] truncate">
                        Landmark: {r.pickupLandmark}
                      </p>
                    )}
                  </div>
                ) : (
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>Commute Mode:</span>
                    <span className="px-1.5 py-0.5 border border-[#152A54] bg-[#03060E] text-[10px] text-slate-400">
                      SELF TRANSPORT
                    </span>
                  </div>
                )}
              </div>
            </div>
          ))
        )}
      </div>

      {/* ── Desktop Table View (>= md) ── */}
      <div className="hidden md:block rounded-none border border-[#152A54] bg-[#060D1A] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#03060E] text-[11px] uppercase tracking-wider text-slate-400 border-b border-[#152A54]">
            <tr>
              <th className="px-4 py-3">Reg ID</th>
              <th className="px-4 py-3">Participant</th>
              <th className="px-4 py-3">Event</th>
              <th className="px-4 py-3">College</th>
              <th className="px-4 py-3">Transport (6:00 AM)</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Checked In</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#152A54]">
            {filteredRegistrations.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-slate-500">
                  No registrations found matching the filters.
                </td>
              </tr>
            ) : (
              filteredRegistrations.map((r) => (
                <tr key={r.id} className="hover:bg-[#0B162C] transition-colors">
                  <td className="px-4 py-3">
                    <button
                      type="button"
                      onClick={() => handleCopy(r.registrationNumber)}
                      className="inline-flex items-center gap-1.5 text-blue-400 font-bold hover:underline cursor-pointer"
                      title="Click to copy pass code"
                    >
                      {r.registrationNumber}
                      {copiedId === r.registrationNumber ? (
                        <CheckIcon className="size-3 text-emerald-400" />
                      ) : (
                        <CopyIcon className="size-3 text-slate-500" />
                      )}
                    </button>
                  </td>
                  <td className="px-4 py-3 font-semibold text-white">{r.participant.name}</td>
                  <td className="px-4 py-3 text-slate-300">{r.event.name}</td>
                  <td className="px-4 py-3 text-slate-400 truncate max-w-[180px]">{r.participant.college}</td>
                  <td className="px-4 py-3">
                    {r.transportOptIn ? (
                      <div className="flex flex-col gap-0.5">
                        <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded-none border border-sky-500/40 bg-sky-500/10 text-sky-300 inline-block w-fit">
                          BUS • {r.passengersCount} SEAT{r.passengersCount > 1 ? "S" : ""}
                        </span>
                        <span className="text-[11px] text-white font-semibold truncate max-w-[160px]" title={r.pickupStop || ""}>
                          {r.pickupStop}
                        </span>
                        <span className="text-[10px] text-slate-400 truncate max-w-[160px]" title={r.pickupLandmark || ""}>
                          {r.pickupLandmark}
                        </span>
                      </div>
                    ) : (
                      <span className="text-[10px] uppercase font-mono text-slate-500 px-1.5 py-0.5 border border-[#152A54] bg-[#03060E]">
                        SELF
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <span className="text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border border-blue-500/40 bg-blue-600/15 text-blue-400 font-bold">
                      {r.status}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-[10px] uppercase tracking-wider px-2 py-0.5 rounded-none border ${
                        r.checkedIn
                          ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400 font-bold"
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

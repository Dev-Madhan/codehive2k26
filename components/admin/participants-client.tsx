"use client";

import * as React from "react";
import {
  SearchIcon,
  UserIcon,
  MailIcon,
  PhoneIcon,
  Building2Icon,
  CalendarCheckIcon,
  XIcon,
} from "lucide-react";

export interface ParticipantItem {
  id: string;
  name: string;
  email: string;
  phone: string;
  college: string;
  _count: {
    registrations: number;
  };
}

export function ParticipantsClient({
  initialParticipants,
}: {
  initialParticipants: ParticipantItem[];
}) {
  const [search, setSearch] = React.useState("");

  const filtered = React.useMemo(() => {
    const q = search.toLowerCase().trim();
    if (!q) return initialParticipants;
    return initialParticipants.filter(
      (p) =>
        p.name.toLowerCase().includes(q) ||
        p.email.toLowerCase().includes(q) ||
        p.phone.includes(q) ||
        p.college.toLowerCase().includes(q)
    );
  }, [initialParticipants, search]);

  const multiEventCount = initialParticipants.filter((p) => p._count.registrations > 1).length;

  return (
    <div className="space-y-4 font-mono max-w-full">
      {/* ── Summary Metrics ── */}
      <div className="grid grid-cols-2 gap-2.5 sm:gap-4">
        <div className="border border-[#152A54] bg-[#060D1A] p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400">Total Participants</p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 tabular-nums">
            {initialParticipants.length}
          </p>
        </div>
        <div className="border border-[#152A54] bg-[#060D1A] p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-blue-400">Multi-Event Attendees</p>
          <p className="text-xl sm:text-2xl font-bold text-blue-400 mt-0.5 tabular-nums">
            {multiEventCount}
          </p>
        </div>
      </div>

      {/* ── Search Bar ── */}
      <div className="relative border border-[#152A54] bg-[#060D1A] p-2.5 sm:p-3">
        <SearchIcon className="absolute left-5 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by name, email, phone, college..."
          className="w-full bg-[#03060E] border border-[#152A54] pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500 rounded-none"
        />
        {search && (
          <button
            onClick={() => setSearch("")}
            className="absolute right-4.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-0.5"
          >
            <XIcon className="size-3.5" />
          </button>
        )}
      </div>

      {/* ── Results Count Bar ── */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{filtered.length}</strong> of {initialParticipants.length} participants
        </span>
        {search && (
          <button
            onClick={() => setSearch("")}
            className="text-blue-400 hover:underline cursor-pointer"
          >
            [ Clear Search ]
          </button>
        )}
      </div>

      {/* ── Mobile Card View (< md) ── */}
      <div className="block md:hidden space-y-3">
        {filtered.length === 0 ? (
          <div className="border border-[#152A54] bg-[#060D1A] p-8 text-center text-xs text-slate-500">
            No participants found matching your search.
          </div>
        ) : (
          filtered.map((p) => {
            const initials = p.name
              .split(" ")
              .filter(Boolean)
              .map((n) => n[0])
              .join("")
              .slice(0, 2)
              .toUpperCase() || "PA";

            return (
              <div
                key={p.id}
                className="border border-[#152A54] bg-[#060D1A] p-3.5 space-y-2.5 transition-colors hover:border-blue-500/40 relative"
              >
                <div className="flex items-center justify-between gap-2 border-b border-[#152A54] pb-2">
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="size-7 rounded-none bg-[#0B162C] border border-[#152A54] text-blue-400 font-bold text-xs flex items-center justify-center shrink-0">
                      {initials}
                    </div>
                    <span className="font-bold text-white text-xs truncate">{p.name}</span>
                  </div>
                  <span className="text-[10px] font-bold text-blue-400 bg-blue-950/40 border border-blue-500/30 px-2 py-0.5 shrink-0">
                    {p._count.registrations} {p._count.registrations === 1 ? "EVENT" : "EVENTS"}
                  </span>
                </div>

                <div className="space-y-1.5 text-xs">
                  <div className="flex items-center gap-1.5 text-slate-300">
                    <Building2Icon className="size-3 text-slate-500 shrink-0" />
                    <span className="truncate">{p.college}</span>
                  </div>

                  <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                    <a
                      href={`mailto:${p.email}`}
                      className="flex items-center gap-1 hover:text-blue-400 transition-colors truncate max-w-[190px]"
                    >
                      <MailIcon className="size-3 text-slate-500 shrink-0" />
                      <span className="truncate">{p.email}</span>
                    </a>
                    {p.phone && (
                      <a
                        href={`tel:${p.phone}`}
                        className="flex items-center gap-1 hover:text-blue-400 transition-colors"
                      >
                        <PhoneIcon className="size-3 text-slate-500 shrink-0" />
                        <span>{p.phone}</span>
                      </a>
                    )}
                  </div>
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
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">College</th>
              <th className="px-4 py-3">Events Count</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#152A54]">
            {filtered.length === 0 ? (
              <tr>
                <td colSpan={5} className="text-center py-8 text-slate-500">
                  No participants found.
                </td>
              </tr>
            ) : (
              filtered.map((p) => (
                <tr key={p.id} className="hover:bg-[#0B162C] transition-colors">
                  <td className="px-4 py-3 font-semibold text-white">{p.name}</td>
                  <td className="px-4 py-3 text-slate-300">{p.email}</td>
                  <td className="px-4 py-3 text-slate-400">{p.phone}</td>
                  <td className="px-4 py-3 text-slate-400 truncate max-w-[200px]">{p.college}</td>
                  <td className="px-4 py-3 font-bold text-blue-400">{p._count.registrations} EVENTS</td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

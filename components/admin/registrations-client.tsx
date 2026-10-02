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
  RefreshCwIcon,
  RadioIcon,
  BellIcon,
  BellOffIcon,
  SparklesIcon,
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

interface EventOption {
  id: string;
  name: string;
  slug?: string;
}

export function RegistrationsClient({
  initialRegistrations,
  events = [],
}: {
  initialRegistrations: RegistrationItem[];
  events?: EventOption[];
}) {
  const [registrations, setRegistrations] =
    React.useState<RegistrationItem[]>(initialRegistrations);
  const [search, setSearch] = React.useState("");
  const [filter, setFilter] = React.useState<"ALL" | "CHECKED_IN" | "PENDING" | "BUS">("ALL");
  const [selectedEvent, setSelectedEvent] = React.useState<string>("ALL");
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  // Real-time synchronization state
  const [isSyncing, setIsSyncing] = React.useState(false);
  const [autoSync, setAutoSync] = React.useState(true);
  const [lastSyncedAt, setLastSyncedAt] = React.useState<Date>(new Date());
  const [newlyAddedIds, setNewlyAddedIds] = React.useState<Set<string>>(new Set());
  const [soundEnabled, setSoundEnabled] = React.useState(false);

  // Sync initial registrations when prop changes
  React.useEffect(() => {
    setRegistrations(initialRegistrations);
  }, [initialRegistrations]);

  // Audio chime for new registrations using Web Audio API
  const playLiveTone = React.useCallback(() => {
    try {
      const AudioCtx =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.35);
    } catch {
      // AudioContext might require user gesture, safe to ignore
    }
  }, []);

  // Fetch live registrations from /api/registrations
  const fetchLiveRegistrations = React.useCallback(
    async (isManual = false) => {
      try {
        setIsSyncing(true);
        const res = await fetch(`/api/registrations?t=${Date.now()}&limit=250`, {
          cache: "no-store",
          headers: {
            "Pragma": "no-cache",
            "Cache-Control": "no-cache",
          },
        });

        if (!res.ok) {
          throw new Error("Sync failed");
        }

        const json = await res.json();
        if (json.success && Array.isArray(json.data)) {
          const freshData: RegistrationItem[] = json.data;

          setRegistrations((prev) => {
            const existingIds = new Set(prev.map((r) => r.id));
            const newItems = freshData.filter((r) => !existingIds.has(r.id));

            if (newItems.length > 0 && prev.length > 0) {
              const newIds = new Set(newItems.map((r) => r.id));
              setNewlyAddedIds((prevIds) => new Set([...prevIds, ...newIds]));

              // Auto-clear highlight after 10 seconds
              setTimeout(() => {
                setNewlyAddedIds((current) => {
                  const next = new Set(current);
                  newIds.forEach((id) => next.delete(id));
                  return next;
                });
              }, 10000);

              // Notify with toast
              newItems.slice(0, 3).forEach((item) => {
                toast.success(`⚡ Live Registration Received!`, {
                  description: `${item.participant.name} registered for ${item.event.name}. Pass: ${item.registrationNumber}`,
                  duration: 6000,
                });
              });

              if (soundEnabled) {
                playLiveTone();
              }
            }

            return freshData;
          });

          setLastSyncedAt(new Date());

          if (isManual) {
            toast.success("Registrations synchronized with database", {
              description: `Live total: ${json.data.length} registrations`,
            });
          }
        }
      } catch (err) {
        console.error("[Registrations Real-Time Sync Error]", err);
        if (isManual) {
          toast.error("Failed to sync registrations. Retrying...");
        }
      } finally {
        setIsSyncing(false);
      }
    },
    [soundEnabled, playLiveTone]
  );

  // Auto-sync polling timer (every 5 seconds)
  React.useEffect(() => {
    if (!autoSync) return;

    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchLiveRegistrations(false);
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [autoSync, fetchLiveRegistrations]);

  // Window focus & visibility change listener
  React.useEffect(() => {
    const handleVisibilityOrFocus = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        fetchLiveRegistrations(false);
      }
    };

    window.addEventListener("focus", handleVisibilityOrFocus);
    document.addEventListener("visibilitychange", handleVisibilityOrFocus);

    return () => {
      window.removeEventListener("focus", handleVisibilityOrFocus);
      document.removeEventListener("visibilitychange", handleVisibilityOrFocus);
    };
  }, [fetchLiveRegistrations]);

  const handleCopy = (regNo: string) => {
    navigator.clipboard.writeText(regNo);
    setCopiedId(regNo);
    toast.success(`Copied Pass Code: ${regNo}`);
    setTimeout(() => {
      setCopiedId(null);
    }, 2000);
  };

  // Derive available event names for filtering
  const availableEvents = React.useMemo(() => {
    const set = new Set<string>();
    events.forEach((e) => set.add(e.name));
    registrations.forEach((r) => set.add(r.event.name));
    return Array.from(set);
  }, [events, registrations]);

  // Filter registrations based on search, status filter, and event filter
  const filteredRegistrations = React.useMemo(() => {
    return registrations.filter((r) => {
      const q = search.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.registrationNumber.toLowerCase().includes(q) ||
        r.participant.name.toLowerCase().includes(q) ||
        r.participant.college.toLowerCase().includes(q) ||
        r.participant.email.toLowerCase().includes(q) ||
        r.event.name.toLowerCase().includes(q) ||
        (r.pickupStop && r.pickupStop.toLowerCase().includes(q));

      if (!matchesSearch) return false;

      if (filter === "CHECKED_IN") return r.checkedIn;
      if (filter === "PENDING") return !r.checkedIn;
      if (filter === "BUS") return r.transportOptIn;

      if (selectedEvent !== "ALL" && r.event.name !== selectedEvent) {
        return false;
      }

      return true;
    });
  }, [registrations, search, filter, selectedEvent]);

  // Dynamic counts computed directly from real-time registrations
  const totalCount = registrations.length;
  const checkedInCount = registrations.filter((r) => r.checkedIn).length;
  const busCount = registrations.filter((r) => r.transportOptIn).length;

  return (
    <div className="space-y-4 font-mono">
      {/* ── Real-Time Status & Live Sync Control Strip ── */}
      <div className="flex flex-wrap items-center justify-between gap-2.5 border border-[#152A54] bg-[#060D1A] px-3 py-2 text-xs">
        <div className="flex items-center gap-2.5">
          <div className="flex items-center gap-1.5">
            <span
              className={`size-2 rounded-full ${
                autoSync
                  ? isSyncing
                    ? "bg-amber-400 animate-ping"
                    : "bg-emerald-400 animate-pulse"
                  : "bg-slate-500"
              }`}
            />
            <span
              className={`text-[11px] font-bold uppercase tracking-wider ${
                autoSync ? "text-emerald-400" : "text-slate-400"
              }`}
            >
              {autoSync ? (isSyncing ? "SYNCING..." : "LIVE SYNC ACTIVE") : "SYNC PAUSED"}
            </span>
          </div>

          <span className="text-slate-600 hidden sm:inline">&bull;</span>

          <span className="text-[11px] text-slate-400 hidden sm:inline">
            Auto-refresh (5s)
          </span>

          <span className="text-slate-600 hidden md:inline">&bull;</span>

          <span className="text-[10px] sm:text-[11px] text-slate-400">
            Last update:{" "}
            <strong className="text-slate-200">
              {lastSyncedAt.toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
                second: "2-digit",
              })}
            </strong>
          </span>
        </div>

        <div className="flex items-center gap-1.5">
          {/* Audio Chime Toggle */}
          <button
            type="button"
            onClick={() => {
              const next = !soundEnabled;
              setSoundEnabled(next);
              if (next) {
                playLiveTone();
                toast.success("Live sound alert enabled");
              } else {
                toast.info("Live sound alert muted");
              }
            }}
            title={soundEnabled ? "Mute audio alerts" : "Enable sound chime for incoming registrations"}
            className={`p-1.5 border transition-colors cursor-pointer ${
              soundEnabled
                ? "bg-blue-600/20 text-blue-400 border-blue-500/40"
                : "bg-[#03060E] text-slate-500 border-[#152A54] hover:text-slate-300"
            }`}
          >
            {soundEnabled ? <BellIcon className="size-3.5" /> : <BellOffIcon className="size-3.5" />}
          </button>

          {/* Auto-Sync Toggle */}
          <button
            type="button"
            onClick={() => setAutoSync((prev) => !prev)}
            className={`px-2 py-1 text-[10px] uppercase tracking-wider font-semibold border transition-colors cursor-pointer ${
              autoSync
                ? "bg-emerald-950/40 text-emerald-400 border-emerald-500/40"
                : "bg-[#03060E] text-slate-400 border-[#152A54] hover:text-white"
            }`}
          >
            {autoSync ? "AUTO: ON" : "AUTO: OFF"}
          </button>

          {/* Manual Refresh Trigger */}
          <button
            type="button"
            onClick={() => fetchLiveRegistrations(true)}
            disabled={isSyncing}
            className="flex items-center gap-1.5 px-2.5 py-1 text-[11px] uppercase tracking-wider font-bold bg-blue-600 hover:bg-blue-500 disabled:opacity-50 text-white border border-blue-500 cursor-pointer transition-colors"
          >
            <RefreshCwIcon className={`size-3 ${isSyncing ? "animate-spin" : ""}`} />
            <span>Sync</span>
          </button>
        </div>
      </div>

      {/* ── Top Metric Cards (Dynamically Live Updated) ── */}
      <div className="grid grid-cols-3 gap-2 sm:gap-4">
        <div className="border border-[#152A54] bg-[#060D1A] p-2.5 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-slate-400">Total Registered</p>
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
        {/* Search Input */}
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by attendee name, email, pass code, event, college..."
            className="w-full bg-[#03060E] border border-[#152A54] pl-9 pr-8 py-2 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500 rounded-none"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white p-0.5 cursor-pointer"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills & Event Dropdown */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          {/* Status Filter Pills */}
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

          {/* Event Filter Dropdown */}
          {availableEvents.length > 0 && (
            <div className="flex items-center gap-1.5 shrink-0 text-xs">
              <span className="text-[11px] text-slate-400 uppercase tracking-wider">Event:</span>
              <select
                value={selectedEvent}
                onChange={(e) => setSelectedEvent(e.target.value)}
                className="bg-[#03060E] border border-[#152A54] text-xs text-white px-2 py-1 focus:border-blue-500 focus:outline-hidden rounded-none cursor-pointer"
              >
                <option value="ALL">All Hosted Events ({availableEvents.length})</option>
                {availableEvents.map((evtName) => (
                  <option key={evtName} value={evtName}>
                    {evtName}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* ── Results Count Bar ── */}
      <div className="flex items-center justify-between text-[11px] text-slate-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredRegistrations.length}</strong> of {totalCount} registrations
          {newlyAddedIds.size > 0 && (
            <span className="ml-2 px-1.5 py-0.5 text-[10px] bg-blue-600/30 text-blue-300 border border-blue-500/40">
              +{newlyAddedIds.size} NEW
            </span>
          )}
        </span>
        {(search || filter !== "ALL" || selectedEvent !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setFilter("ALL");
              setSelectedEvent("ALL");
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
          filteredRegistrations.map((r) => {
            const isNew = newlyAddedIds.has(r.id);
            return (
              <div
                key={r.id}
                className={`border p-3.5 space-y-2.5 transition-all relative ${
                  isNew
                    ? "border-blue-400 bg-blue-950/40 shadow-md shadow-blue-500/20"
                    : "border-[#152A54] bg-[#060D1A] hover:border-blue-500/40"
                }`}
              >
                {/* Card Header: Reg ID + Status Badges */}
                <div className="flex items-center justify-between gap-2 border-b border-[#152A54] pb-2">
                  <div className="flex items-center gap-1.5">
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

                    {isNew && (
                      <span className="px-1.5 py-0.5 text-[9px] font-bold bg-blue-500 text-white animate-pulse">
                        NEW
                      </span>
                    )}
                  </div>

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
                  <p className="text-xs text-slate-400 truncate">{r.participant.email}</p>
                  <div className="flex items-center gap-1.5 text-xs text-slate-400 truncate">
                    <Building2Icon className="size-3 text-slate-500 shrink-0" />
                    <span className="truncate">{r.participant.college}</span>
                  </div>
                </div>

                {/* Event Info */}
                <div className="flex items-center justify-between gap-2 text-xs pt-1">
                  <span className="text-slate-400 text-[11px] uppercase">Event:</span>
                  <span className="text-slate-200 font-semibold truncate text-right">
                    {r.event.name}
                  </span>
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
            );
          })
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
              filteredRegistrations.map((r) => {
                const isNew = newlyAddedIds.has(r.id);
                return (
                  <tr
                    key={r.id}
                    className={`transition-colors ${
                      isNew
                        ? "bg-blue-950/40 border-l-2 border-l-blue-400"
                        : "hover:bg-[#0B162C]"
                    }`}
                  >
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1.5">
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
                        {isNew && (
                          <span className="px-1.5 py-0.2 text-[9px] font-bold bg-blue-500 text-white rounded-none animate-pulse">
                            NEW
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-4 py-3">
                      <p className="font-semibold text-white">{r.participant.name}</p>
                      <p className="text-[10px] text-slate-400 truncate max-w-[170px]" title={r.participant.email}>
                        {r.participant.email}
                      </p>
                    </td>
                    <td className="px-4 py-3 text-slate-300 font-semibold">{r.event.name}</td>
                    <td className="px-4 py-3 text-slate-400 truncate max-w-[180px]" title={r.participant.college}>
                      {r.participant.college}
                    </td>
                    <td className="px-4 py-3">
                      {r.transportOptIn ? (
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[10px] uppercase font-mono font-bold px-1.5 py-0.5 rounded-none border border-sky-500/40 bg-sky-500/10 text-sky-300 inline-block w-fit">
                            BUS • {r.passengersCount} SEAT{r.passengersCount > 1 ? "S" : ""}
                          </span>
                          <span
                            className="text-[11px] text-white font-semibold truncate max-w-[160px]"
                            title={r.pickupStop || ""}
                          >
                            {r.pickupStop}
                          </span>
                          <span
                            className="text-[10px] text-slate-400 truncate max-w-[160px]"
                            title={r.pickupLandmark || ""}
                          >
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
                );
              })
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}


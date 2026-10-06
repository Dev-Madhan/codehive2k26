"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  CalendarDaysIcon,
  SearchIcon,
  UsersIcon,
  TagIcon,
  MapPinIcon,
  XIcon,
  SparklesIcon,
  PlusIcon,
  MoreVerticalIcon,
  EditIcon,
  Trash2Icon,
  ExternalLinkIcon,
  CopyIcon,
  CheckIcon,
  LockIcon,
  UnlockIcon,
  ShieldAlertIcon,
  LayersIcon,
} from "lucide-react";
import { toast } from "sonner";
import { formatDate } from "@/utils/formatters";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { Button } from "@/components/ui/button";
import { CreateEventDialog } from "@/components/admin/create-event-dialog";
import { EditEventDialog } from "@/components/admin/edit-event-dialog";
import { DeleteEventDialog } from "@/components/admin/delete-event-dialog";
import { toggleEventRegistration } from "@/actions/event";

export interface EventItem {
  id: string;
  name: string;
  slug: string;
  description?: string | null;
  venue: string;
  startAt: Date | string;
  endAt?: Date | string | null;
  registrationDeadline?: Date | string | null;
  capacity?: number;
  status: string;
  registrationOpen?: boolean;
  isTeamEvent: boolean;
  minTeamSize: number;
  maxTeamSize: number;
  categoryId?: string | null;
  category?: {
    id: string;
    name: string;
    slug?: string;
  } | null;
  _count: {
    registrations: number;
    teams?: number;
  };
}

export function EventsClient({
  initialEvents,
  categories = [],
}: {
  initialEvents: EventItem[];
  categories?: { id: string; name: string; slug: string }[];
}) {
  const router = useRouter();
  const [events, setEvents] = React.useState<EventItem[]>(initialEvents);
  const [search, setSearch] = React.useState("");
  const [selectedCategory, setSelectedCategory] = React.useState<string>("ALL");
  const [selectedStatus, setSelectedStatus] = React.useState<string>("ALL");

  // Dialog & Drawer states
  const [createDialogOpen, setCreateDialogOpen] = React.useState(false);
  const [editEvent, setEditEvent] = React.useState<EventItem | null>(null);
  const [editDialogOpen, setEditDialogOpen] = React.useState(false);
  const [deleteEventItem, setDeleteEventItem] = React.useState<EventItem | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);
  const [dossierEvent, setDossierEvent] = React.useState<EventItem | null>(null);
  const [dossierOpen, setDossierOpen] = React.useState(false);
  const [isTogglingId, setIsTogglingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    setEvents(initialEvents);
  }, [initialEvents]);

  // Unique categories derived from props or event items
  const allCategories = React.useMemo(() => {
    if (categories.length > 0) return categories;
    const map = new Map<string, { id: string; name: string; slug: string }>();
    initialEvents.forEach((e) => {
      if (e.category?.name) {
        map.set(e.category.name, {
          id: e.category.id,
          name: e.category.name,
          slug: e.category.slug || e.category.name.toLowerCase(),
        });
      }
    });
    return Array.from(map.values());
  }, [categories, initialEvents]);

  const filteredEvents = React.useMemo(() => {
    return events.filter((e) => {
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

      if (selectedStatus !== "ALL") {
        if (selectedStatus === "OPEN" && !e.registrationOpen && e.status !== "REGISTRATION_OPEN") {
          return false;
        }
        if (selectedStatus === "CLOSED" && (e.registrationOpen || e.status === "REGISTRATION_OPEN")) {
          return false;
        }
      }

      return true;
    });
  }, [events, search, selectedCategory, selectedStatus]);

  // Live KPI totals
  const totalRegistrations = events.reduce((acc, e) => acc + e._count.registrations, 0);
  const totalTeams = events.reduce((acc, e) => acc + (e._count.teams || 0), 0);
  const openEventsCount = events.filter(
    (e) => e.registrationOpen !== false && e.status !== "REGISTRATION_CLOSED"
  ).length;

  // Toggle registration open/closed
  const handleToggleRegistration = async (event: EventItem) => {
    const isCurrentlyOpen =
      event.registrationOpen !== false && event.status !== "REGISTRATION_CLOSED";
    const nextState = !isCurrentlyOpen;

    try {
      setIsTogglingId(event.id);
      const res = await toggleEventRegistration(event.id, nextState);
      if (!res.success) {
        toast.error(res.error?.message || "Failed to update registration status.");
        return;
      }

      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id
            ? {
                ...e,
                registrationOpen: nextState,
                status: nextState ? "REGISTRATION_OPEN" : "REGISTRATION_CLOSED",
              }
            : e
        )
      );

      toast.success(
        nextState
          ? `Registrations opened for ${event.name}`
          : `Registrations locked for ${event.name}`
      );
      router.refresh();
    } catch {
      toast.error("Failed to change registration state.");
    } finally {
      setIsTogglingId(null);
    }
  };

  const copyPublicLink = (slug: string, name: string) => {
    const url = `${window.location.origin}/events/${slug}`;
    navigator.clipboard.writeText(url);
    toast.success(`Copied public link for ${name}`, {
      description: url,
    });
  };

  return (
    <div className="space-y-4 font-mono">
      {/* ── Top Operations Bar ── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#262626] pb-3">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-white bg-white/10 border border-[#404040] px-2 py-0.5 uppercase tracking-wider inline-flex items-center gap-1.5">
            <span className="size-1.5 rounded-none bg-white animate-pulse" />
            LIVE SYMPOSIUM TRACKS
          </span>
        </div>

        <Button
          onClick={() => setCreateDialogOpen(true)}
          className="rounded-none bg-white hover:bg-zinc-200 text-black font-mono text-xs uppercase font-bold px-4 py-2 cursor-pointer border border-white flex items-center gap-1.5 self-start sm:self-auto"
        >
          <PlusIcon className="size-4" />
          <span>Create New Event Track</span>
        </Button>
      </div>

      {/* ── Top Metrics Overview ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        <div className="border border-[#262626] bg-[#0F0F0F] p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400">Total Tracks</p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 tabular-nums">
            {events.length}
          </p>
          <p className="text-[10px] text-zinc-500 mt-1">Catalogued</p>
        </div>

        <div className="border border-[#262626] bg-[#0F0F0F] p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400">Registrations Open</p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 tabular-nums">
            {openEventsCount} <span className="text-xs font-normal text-zinc-400">/ {events.length}</span>
          </p>
          <p className="text-[10px] text-zinc-400 mt-1">Accepting Candidates</p>
        </div>

        <div className="border border-[#262626] bg-[#0F0F0F] p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400">Total Candidates</p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 tabular-nums">
            {totalRegistrations}
          </p>
          <p className="text-[10px] text-zinc-400 mt-1">Across all tracks</p>
        </div>

        <div className="border border-[#262626] bg-[#0F0F0F] p-3 sm:p-4">
          <p className="text-[10px] sm:text-[11px] uppercase tracking-wider text-zinc-400">Teams Formed</p>
          <p className="text-xl sm:text-2xl font-bold text-white mt-0.5 tabular-nums">
            {totalTeams}
          </p>
          <p className="text-[10px] text-zinc-400 mt-1">Collaborative rosters</p>
        </div>
      </div>

      {/* ── Search & Filter Strip ── */}
      <div className="flex flex-col gap-2.5 border border-[#262626] bg-[#0F0F0F] p-3">
        <div className="relative w-full">
          <SearchIcon className="absolute left-3 top-1/2 -translate-y-1/2 size-3.5 text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search tracks by name, category, venue..."
            className="w-full bg-[#080808] border border-[#262626] pl-9 pr-8 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-white rounded-none font-mono"
          />
          {search && (
            <button
              onClick={() => setSearch("")}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-white p-0.5 cursor-pointer"
            >
              <XIcon className="size-3.5" />
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex items-center gap-1.5 overflow-x-auto no-scrollbar pb-0.5">
            <button
              type="button"
              onClick={() => setSelectedCategory("ALL")}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                selectedCategory === "ALL"
                  ? "bg-white text-black border-white font-bold shadow-xs"
                  : "bg-[#080808] text-zinc-400 border-[#262626] hover:bg-[#161616] hover:text-white"
              }`}
            >
              All Categories ({events.length})
            </button>
            {allCategories.map((cat) => {
              const count = events.filter((e) => e.category?.name === cat.name).length;
              const isActive = selectedCategory === cat.name;
              return (
                <button
                  key={cat.id}
                  type="button"
                  onClick={() => setSelectedCategory(cat.name)}
                  className={`px-2.5 py-1 text-[11px] uppercase tracking-wider font-semibold whitespace-nowrap transition-colors cursor-pointer border ${
                    isActive
                      ? "bg-white text-black border-white font-bold shadow-xs"
                      : "bg-[#080808] text-zinc-400 border-[#262626] hover:bg-[#161616] hover:text-white"
                  }`}
                >
                  {cat.name} ({count})
                </button>
              );
            })}
          </div>

          <div className="flex items-center gap-1">
            <span className="text-[10px] uppercase text-zinc-500 mr-1">Status:</span>
            {[
              { id: "ALL", label: "All" },
              { id: "OPEN", label: "Open" },
              { id: "CLOSED", label: "Closed" },
            ].map((st) => (
              <button
                key={st.id}
                type="button"
                onClick={() => setSelectedStatus(st.id)}
                className={`px-2 py-0.5 text-[10px] uppercase font-bold border transition-colors cursor-pointer ${
                  selectedStatus === st.id
                    ? "bg-white text-black border-white"
                    : "bg-[#080808] text-zinc-400 border-[#262626] hover:text-white hover:bg-[#161616]"
                }`}
              >
                {st.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Results Info ── */}
      <div className="flex items-center justify-between text-[11px] text-zinc-400 px-1">
        <span>
          Showing <strong className="text-white">{filteredEvents.length}</strong> of {events.length} symposium tracks
        </span>
        {(search || selectedCategory !== "ALL" || selectedStatus !== "ALL") && (
          <button
            onClick={() => {
              setSearch("");
              setSelectedCategory("ALL");
              setSelectedStatus("ALL");
            }}
            className="text-zinc-300 hover:text-white hover:underline cursor-pointer"
          >
            [ Reset All Filters ]
          </button>
        )}
      </div>

      {/* ── Mobile Card View (< md) ── */}
      <div className="block md:hidden space-y-3">
        {filteredEvents.length === 0 ? (
          <div className="border border-[#262626] bg-[#0F0F0F] p-8 text-center text-xs text-zinc-500">
            No events match your criteria.
          </div>
        ) : (
          filteredEvents.map((e) => {
            const isOpen =
              e.registrationOpen !== false && e.status !== "REGISTRATION_CLOSED";
            return (
              <div
                key={e.id}
                className="border border-[#262626] bg-[#0F0F0F] p-3.5 space-y-3 transition-colors hover:border-[#404040] relative"
              >
                {/* Header: Category Badge + Status Toggle */}
                <div className="flex items-center justify-between gap-2 border-b border-[#262626] pb-2">
                  <span className="text-[10px] uppercase font-bold text-zinc-400 bg-white/5 border border-[#262626] px-2 py-0.5">
                    [ {e.category?.name || "General"} ]
                  </span>

                  <button
                    type="button"
                    onClick={() => handleToggleRegistration(e)}
                    disabled={isTogglingId === e.id}
                    className={`inline-flex items-center gap-1 text-[10px] uppercase font-bold px-2 py-0.5 border cursor-pointer transition-colors ${
                      isOpen
                        ? "border-emerald-500/40 bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/25"
                        : "border-amber-500/40 bg-amber-500/15 text-amber-400 hover:bg-amber-500/25"
                    }`}
                  >
                    {isOpen ? (
                      <>
                        <UnlockIcon className="size-2.5" />
                        <span>OPEN</span>
                      </>
                    ) : (
                      <>
                        <LockIcon className="size-2.5" />
                        <span>CLOSED</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Event Name & Format */}
                <div
                  className="space-y-1 cursor-pointer"
                  onClick={() => {
                    setDossierEvent(e);
                    setDossierOpen(true);
                  }}
                >
                  <h3 className="text-sm font-bold text-white uppercase hover:text-zinc-300 transition-colors">
                    {e.name}
                  </h3>
                  <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-zinc-400">
                    <span className="flex items-center gap-1">
                      <CalendarDaysIcon className="size-3 text-zinc-500" />
                      {formatDate(e.startAt)}
                    </span>
                    {e.venue && (
                      <span className="flex items-center gap-1 truncate max-w-[180px]">
                        <MapPinIcon className="size-3 text-zinc-500 shrink-0" />
                        <span className="truncate">{e.venue}</span>
                      </span>
                    )}
                  </div>
                </div>

                {/* Metrics */}
                <div className="grid grid-cols-2 gap-2 text-xs pt-1 border-t border-[#262626]">
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase block">Candidates:</span>
                    <span className="text-xs font-bold font-mono text-white">
                      {e._count.registrations} registered
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 text-[10px] uppercase block">Format:</span>
                    <span className="text-xs text-zinc-300">
                      {e.isTeamEvent ? `Team (${e.minTeamSize}-${e.maxTeamSize})` : "Solo Entry"}
                    </span>
                  </div>
                </div>

                {/* Operations Actions Footer */}
                <div className="flex items-center justify-between gap-2 pt-2 border-t border-[#262626] text-xs">
                  <Link
                    href={`/admin/registrations?eventId=${e.id}`}
                    className="inline-flex items-center gap-1 text-[11px] font-bold text-white bg-white/10 hover:bg-white/20 border border-white/20 px-2.5 py-1 uppercase"
                  >
                    <UsersIcon className="size-3" />
                    <span>Attendees ({e._count.registrations})</span>
                  </Link>

                  <div className="flex items-center gap-1.5">
                    <button
                      type="button"
                      onClick={() => {
                        setEditEvent(e);
                        setEditDialogOpen(true);
                      }}
                      className="p-1.5 border border-[#262626] bg-[#080808] text-zinc-300 hover:text-white hover:bg-[#161616] cursor-pointer"
                      title="Edit Track"
                    >
                      <EditIcon className="size-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => copyPublicLink(e.slug, e.name)}
                      className="p-1.5 border border-[#262626] bg-[#080808] text-zinc-300 hover:text-white hover:bg-[#161616] cursor-pointer"
                      title="Copy Public Link"
                    >
                      <CopyIcon className="size-3.5" />
                    </button>

                    <button
                      type="button"
                      onClick={() => {
                        setDeleteEventItem(e);
                        setDeleteDialogOpen(true);
                      }}
                      className="p-1.5 border border-red-900/60 bg-red-950/30 text-red-400 hover:bg-red-900/40 cursor-pointer"
                      title="Delete Track"
                    >
                      <Trash2Icon className="size-3.5" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* ── Desktop Table View (>= md) ── */}
      <div className="hidden md:block rounded-none border border-[#262626] bg-[#0F0F0F] overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead className="bg-[#080808] text-[11px] uppercase tracking-wider text-zinc-400 border-b border-[#262626]">
            <tr>
              <th className="px-4 py-3">Event Track</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Venue &amp; Dates</th>
              <th className="px-4 py-3 text-right">Headcount</th>
              <th className="px-4 py-3 text-center">Registration Gateway</th>
              <th className="px-4 py-3 text-right">Operations</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-[#262626]">
            {filteredEvents.length === 0 ? (
              <tr>
                <td colSpan={6} className="text-center py-8 text-zinc-500">
                  No event tracks found.
                </td>
              </tr>
            ) : (
              filteredEvents.map((e) => {
                const isOpen =
                  e.registrationOpen !== false && e.status !== "REGISTRATION_CLOSED";
                return (
                  <tr key={e.id} className="hover:bg-[#161616] transition-colors group">
                    {/* Track Name */}
                    <td className="px-4 py-3">
                      <button
                        type="button"
                        onClick={() => {
                          setDossierEvent(e);
                          setDossierOpen(true);
                        }}
                        className="text-left font-bold text-white group-hover:text-zinc-300 transition-colors uppercase cursor-pointer"
                      >
                        {e.name}
                      </button>
                      <p className="text-[10px] text-zinc-400 mt-0.5">
                        {e.isTeamEvent ? `Team (${e.minTeamSize}-${e.maxTeamSize} members)` : "Solo Entry"}
                      </p>
                    </td>

                    {/* Category */}
                    <td className="px-4 py-3">
                      <span className="font-mono text-zinc-300 text-[11px] bg-[#080808] border border-[#262626] px-2 py-0.5 uppercase">
                        {e.category?.name || "General"}
                      </span>
                    </td>

                    {/* Venue & Date */}
                    <td className="px-4 py-3">
                      <p className="text-zinc-300 font-semibold truncate max-w-[200px]" title={e.venue}>
                        {e.venue || "Vel Tech Multi Tech"}
                      </p>
                      <p className="text-[10px] text-zinc-500 mt-0.5">
                        {formatDate(e.startAt)}
                      </p>
                    </td>

                    {/* Registrations Headcount */}
                    <td className="px-4 py-3 text-right">
                      <Link
                        href={`/admin/registrations?eventId=${e.id}`}
                        className="inline-flex flex-col items-end hover:text-white transition-colors"
                      >
                        <span className="font-bold font-mono text-sm text-white tabular-nums">
                          {e._count.registrations}
                        </span>
                        <span className="text-[10px] text-zinc-500">
                          {e._count.teams ? `${e._count.teams} teams` : "candidates"}
                        </span>
                      </Link>
                    </td>

                    {/* Live Toggle Gateway */}
                    <td className="px-4 py-3 text-center">
                      <button
                        type="button"
                        onClick={() => handleToggleRegistration(e)}
                        disabled={isTogglingId === e.id}
                        className={`inline-flex items-center gap-1.5 px-3 py-1 text-[10px] uppercase font-bold tracking-wider border transition-all cursor-pointer ${
                          isOpen
                            ? "border-emerald-500/50 bg-emerald-950/60 text-emerald-400 hover:bg-emerald-900/60"
                            : "border-amber-500/50 bg-amber-950/60 text-amber-400 hover:bg-amber-900/60"
                        }`}
                        title="Click to toggle registration gate"
                      >
                        {isOpen ? (
                          <>
                            <span className="size-1.5 rounded-none bg-emerald-400 animate-pulse" />
                            <span>ACCEPTING REGISTRATIONS</span>
                          </>
                        ) : (
                          <>
                            <LockIcon className="size-3" />
                            <span>GATE LOCKED</span>
                          </>
                        )}
                      </button>
                    </td>

                    {/* Actions Menu */}
                    <td className="px-4 py-3 text-right">
                      <DropdownMenu>
                        <DropdownMenuTrigger
                          render={
                            <Button
                              variant="ghost"
                              className="size-8 p-0 text-zinc-400 hover:text-white hover:bg-[#161616] rounded-none cursor-pointer"
                              size="icon"
                            />
                          }
                        >
                          <MoreVerticalIcon className="size-4" />
                          <span className="sr-only">Operations menu</span>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent
                          align="end"
                          className="w-48"
                        >
                          <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500 border-b border-[#262626] mb-1 flex items-center justify-between">
                            <span>// TRACK ACTIONS</span>
                          </div>
                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-[#161616] flex items-center gap-2"
                            onClick={() => router.push(`/admin/registrations?eventId=${e.id}`)}
                          >
                            <UsersIcon className="size-3.5 text-white" />
                            <span>View Attendees ({e._count.registrations})</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-[#161616] flex items-center gap-2"
                            onClick={() => {
                              setEditEvent(e);
                              setEditDialogOpen(true);
                            }}
                          >
                            <EditIcon className="size-3.5 text-white" />
                            <span>Edit Event Track</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-[#161616] flex items-center gap-2"
                            onClick={() => copyPublicLink(e.slug, e.name)}
                          >
                            <CopyIcon className="size-3.5 text-zinc-400" />
                            <span>Copy Public URL</span>
                          </DropdownMenuItem>

                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-[#161616] flex items-center gap-2"
                            onClick={() => window.open(`/events/${e.slug}`, "_blank")}
                          >
                            <ExternalLinkIcon className="size-3.5 text-zinc-400" />
                            <span>Visit Public Page</span>
                          </DropdownMenuItem>

                          <DropdownMenuSeparator className="bg-[#262626]" />

                          <DropdownMenuItem
                            className="cursor-pointer hover:bg-red-950/60 text-red-400 flex items-center gap-2"
                            onClick={() => {
                              setDeleteEventItem(e);
                              setDeleteDialogOpen(true);
                            }}
                          >
                            <Trash2Icon className="size-3.5" />
                            <span>Delete Track</span>
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>
        </table>
      </div>

      {/* ── Slide-Over Event Dossier Drawer ── */}
      {dossierEvent && (
        <Drawer open={dossierOpen} onOpenChange={setDossierOpen}>
          <DrawerContent className="bg-[#0F0F0F] border-[#262626] text-white font-mono rounded-none max-w-2xl mx-auto">
            <DrawerHeader className="border-b border-[#262626] p-4 sm:p-5">
              <div className="flex items-center gap-2 mb-1.5">
                <span className="text-[10px] font-bold text-zinc-400 bg-white/5 border border-[#262626] px-2 py-0.5 uppercase tracking-wider">
                  {dossierEvent.category?.name || "General Track"}
                </span>
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 uppercase tracking-wider border ${
                    dossierEvent.registrationOpen !== false
                      ? "text-emerald-400 border-emerald-500/40 bg-emerald-950/40"
                      : "text-amber-400 border-amber-500/40 bg-amber-950/40"
                  }`}
                >
                  {dossierEvent.registrationOpen !== false ? "REGISTRATION OPEN" : "REGISTRATION LOCKED"}
                </span>
              </div>
              <DrawerTitle className="text-lg sm:text-xl font-bold uppercase tracking-tight text-white flex items-center gap-2">
                <SparklesIcon className="size-4 text-white shrink-0" />
                <span>{dossierEvent.name}</span>
              </DrawerTitle>
              <DrawerDescription className="text-xs text-zinc-400">
                {dossierEvent.venue} • {formatDate(dossierEvent.startAt)}
              </DrawerDescription>
            </DrawerHeader>

            <div className="p-4 sm:p-5 space-y-4 max-h-[65vh] overflow-y-auto no-scrollbar text-xs">
              {/* Stat Cards */}
              <div className="grid grid-cols-3 gap-2.5">
                <div className="border border-[#262626] bg-[#080808] p-3">
                  <span className="text-[10px] uppercase text-zinc-400 block">Registered</span>
                  <p className="text-xl font-bold text-white mt-1 tabular-nums">
                    {dossierEvent._count.registrations}
                  </p>
                </div>
                <div className="border border-[#262626] bg-[#080808] p-3">
                  <span className="text-[10px] uppercase text-zinc-400 block">Teams</span>
                  <p className="text-xl font-bold text-white mt-1 tabular-nums">
                    {dossierEvent._count.teams || 0}
                  </p>
                </div>
                <div className="border border-[#262626] bg-[#080808] p-3">
                  <span className="text-[10px] uppercase text-zinc-400 block">Format</span>
                  <p className="text-xs font-bold text-white mt-1 uppercase">
                    {dossierEvent.isTeamEvent
                      ? `Team (${dossierEvent.minTeamSize}-${dossierEvent.maxTeamSize})`
                      : "Solo"}
                  </p>
                </div>
              </div>

              {/* Description */}
              <div className="border border-[#262626] bg-[#080808] p-3.5 space-y-2">
                <p className="text-[10px] uppercase font-bold text-white tracking-wider">
                  Track Challenge Scope &amp; Rules
                </p>
                <p className="text-xs text-zinc-300 leading-relaxed whitespace-pre-line">
                  {dossierEvent.description || "No description provided."}
                </p>
              </div>

              {/* Venue & Timing Details */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div className="border border-[#262626] bg-[#080808] p-3 space-y-1">
                  <span className="text-[10px] uppercase text-zinc-400">Allocated Venue</span>
                  <p className="text-xs text-white font-semibold">{dossierEvent.venue}</p>
                </div>
                <div className="border border-[#262626] bg-[#080808] p-3 space-y-1">
                  <span className="text-[10px] uppercase text-zinc-400">Registration Deadline</span>
                  <p className="text-xs text-white font-semibold">
                    {dossierEvent.registrationDeadline
                      ? formatDate(dossierEvent.registrationDeadline)
                      : "October 2026"}
                  </p>
                </div>
              </div>
            </div>

            <DrawerFooter className="border-t border-[#262626] bg-[#080808] p-4 flex flex-row items-center justify-between gap-2.5">
              <div className="flex items-center gap-2">
                <Link
                  href={`/admin/registrations?eventId=${dossierEvent.id}`}
                  className="px-3 py-1.5 text-xs font-bold text-black bg-white hover:bg-zinc-200 border border-white uppercase inline-flex items-center gap-1.5"
                >
                  <UsersIcon className="size-3.5" />
                  <span>View Attendees ({dossierEvent._count.registrations})</span>
                </Link>

                <Button
                  variant="outline"
                  onClick={() => {
                    setDossierOpen(false);
                    setEditEvent(dossierEvent);
                    setEditDialogOpen(true);
                  }}
                  className="rounded-none border-[#262626] bg-[#0F0F0F] text-zinc-300 hover:text-white text-xs uppercase"
                >
                  Edit Track
                </Button>
              </div>

              <DrawerClose
                render={
                  <button
                    type="button"
                    className="inline-flex items-center justify-center px-4 py-2 text-xs uppercase font-mono border border-[#262626] bg-[#0F0F0F] text-zinc-300 hover:text-white hover:bg-[#161616] cursor-pointer"
                  >
                    Close
                  </button>
                }
              />
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      )}

      {/* ── Create Event Dialog ── */}
      <CreateEventDialog
        open={createDialogOpen}
        onOpenChange={setCreateDialogOpen}
        categories={allCategories}
        onSuccess={() => {
          router.refresh();
        }}
      />

      {/* ── Edit Event Dialog ── */}
      <EditEventDialog
        event={editEvent}
        open={editDialogOpen}
        onOpenChange={setEditDialogOpen}
        categories={allCategories}
        onSuccess={() => {
          router.refresh();
        }}
      />

      {/* ── Delete Event Dialog ── */}
      <DeleteEventDialog
        eventId={deleteEventItem?.id || null}
        eventName={deleteEventItem?.name || ""}
        registrationsCount={deleteEventItem?._count.registrations || 0}
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onSuccess={() => {
          setEvents((prev) => prev.filter((e) => e.id !== deleteEventItem?.id));
          router.refresh();
        }}
      />
    </div>
  );
}

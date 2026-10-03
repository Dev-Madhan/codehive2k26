"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  SparklesIcon,
  Loader2Icon,
  CalendarDaysIcon,
  MapPinIcon,
  UsersIcon,
  FileTextIcon,
  TagIcon,
  ActivityIcon,
} from "lucide-react";
import { updateEvent } from "@/actions/event";
import type { EventStatus } from "@prisma/client";

export interface EditableEvent {
  id: string;
  name: string;
  slug: string;
  venue: string;
  description?: string | null;
  startAt: Date | string;
  endAt?: Date | string | null;
  registrationDeadline?: Date | string | null;
  status: string;
  registrationOpen?: boolean;
  isTeamEvent: boolean;
  minTeamSize: number;
  maxTeamSize: number;
  categoryId?: string | null;
  category?: {
    id: string;
    name: string;
  } | null;
}

interface EditEventDialogProps {
  event: EditableEvent | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: { id: string; name: string; slug: string }[];
  onSuccess?: () => void;
}

export function EditEventDialog({
  event,
  open,
  onOpenChange,
  categories,
  onSuccess,
}: EditEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form state
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [categoryId, setCategoryId] = React.useState("");
  const [status, setStatus] = React.useState<EventStatus>("PUBLISHED");
  const [venue, setVenue] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [startAt, setStartAt] = React.useState("");
  const [endAt, setEndAt] = React.useState("");
  const [registrationDeadline, setRegistrationDeadline] = React.useState("");
  const [isTeamEvent, setIsTeamEvent] = React.useState(true);
  const [minTeamSize, setMinTeamSize] = React.useState(1);
  const [maxTeamSize, setMaxTeamSize] = React.useState(3);

  // Sync state when event prop changes
  React.useEffect(() => {
    if (event) {
      setName(event.name || "");
      setSlug(event.slug || "");
      setCategoryId(event.categoryId || event.category?.id || categories[0]?.id || "");
      setStatus((event.status as EventStatus) || "PUBLISHED");
      setVenue(event.venue || "");
      setDescription(event.description || "");

      // Date format for datetime-local
      const formatDT = (d?: Date | string | null) => {
        if (!d) return "";
        const dateObj = new Date(d);
        if (isNaN(dateObj.getTime())) return "";
        return dateObj.toISOString().slice(0, 16);
      };

      setStartAt(formatDT(event.startAt));
      setEndAt(formatDT(event.endAt || event.startAt));
      setRegistrationDeadline(formatDT(event.registrationDeadline || event.startAt));
      setIsTeamEvent(event.isTeamEvent ?? true);
      setMinTeamSize(event.minTeamSize || 1);
      setMaxTeamSize(event.maxTeamSize || 3);
    }
  }, [event, categories]);

  const handleGenerateSlug = () => {
    if (!name.trim()) {
      toast.error("Please enter an Event Name first to create a slug.");
      return;
    }
    const clean = name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    const newSlug = clean ? (clean.endsWith("2026") ? clean : `${clean}-2026`) : "";
    setSlug(newSlug);
    toast.success("Slug updated from event name!", {
      description: `/events/${newSlug}`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!event) return;

    if (!name.trim()) {
      toast.error("Event name is required.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await updateEvent(event.id, {
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        venue: venue.trim(),
        status,
        ...(startAt && { startAt: new Date(startAt) }),
        ...(endAt && { endAt: new Date(endAt) }),
        ...(registrationDeadline && {
          registrationDeadline: new Date(registrationDeadline),
        }),
        categoryId: categoryId || undefined,
        isTeamEvent,
        minTeamSize: isTeamEvent ? Number(minTeamSize) : 1,
        maxTeamSize: isTeamEvent ? Number(maxTeamSize) : 1,
      });

      if (!res.success) {
        toast.error(res.error?.message || "Failed to update event.");
        return;
      }

      toast.success(`Event "${res.data.name}" updated successfully!`);
      onOpenChange(false);
      onSuccess?.();
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full bg-[#060D1A] border border-[#152A54] text-white p-0 overflow-hidden font-mono text-xs rounded-none shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-[#152A54] bg-[#03060E] space-y-1 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-sky-400 bg-blue-950/60 border border-blue-500/40 px-2 py-0.5 uppercase tracking-wider inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-full bg-blue-400 animate-pulse" />
              EVENT CONFIGURATION DESK
            </span>
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
            <SparklesIcon className="size-4 text-blue-400 shrink-0" />
            <span>Edit Event Track: {event?.name}</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-slate-400">
            Modify venue, schedule, participation mode, and lifecycle status.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form
          id="edit-event-form"
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 no-scrollbar"
        >
          {/* Section: Status & Identity */}
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#152A54]/60 pb-1">
              <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-blue-400">
                <TagIcon className="size-3.5" />
                <span>Track Identity &amp; Lifecycle</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-300">
                  Event Name *
                </label>
                <input
                  type="text"
                  required
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 bg-[#03060E] border border-[#152A54] px-3 text-xs text-white focus:outline-hidden focus:border-blue-500 rounded-none uppercase font-semibold"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-300">
                  Lifecycle Status
                </label>
                <Select
                  value={status}
                  onValueChange={(val) => {
                    if (val) setStatus(val as EventStatus);
                  }}
                >
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#152A54]/60 mb-1 flex items-center justify-between">
                      <span>// LIFECYCLE STATUS</span>
                      <span className="text-blue-400 font-bold">5 STATES</span>
                    </div>
                    <SelectItem value="PUBLISHED">PUBLISHED (Live)</SelectItem>
                    <SelectItem value="REGISTRATION_OPEN">REGISTRATION OPEN (Active)</SelectItem>
                    <SelectItem value="REGISTRATION_CLOSED">REGISTRATION CLOSED (Locked)</SelectItem>
                    <SelectItem value="DRAFT">DRAFT (Hidden)</SelectItem>
                    <SelectItem value="EVENT_COMPLETED">EVENT COMPLETED (Concluded)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-300">
                  Track Category
                </label>
                <Select
                  value={categoryId}
                  onValueChange={(val) => {
                    if (val) setCategoryId(val);
                  }}
                >
                  <SelectTrigger className="w-full h-9">
                    <SelectValue placeholder="Select track category" />
                  </SelectTrigger>
                  <SelectContent>
                    <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-slate-500 border-b border-[#152A54]/60 mb-1 flex items-center justify-between">
                      <span>// TRACK CATEGORIES</span>
                      <span className="text-blue-400 font-bold">{categories.length} TOTAL</span>
                    </div>
                    {categories.map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name} ({cat.slug})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase text-slate-300">
                    URL Slug *
                  </label>
                  <span className="text-[10px] text-slate-500 font-mono truncate max-w-[140px]">
                    {slug ? `/events/${slug}` : ""}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="w-full h-9 bg-[#03060E] border border-[#152A54] pl-3 pr-28 text-xs text-blue-400 font-mono focus:outline-hidden focus:border-blue-500 rounded-none lowercase"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateSlug}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2.5 bg-blue-600/25 hover:bg-blue-600/40 text-sky-300 hover:text-white border border-blue-500/40 text-[10px] uppercase font-bold tracking-wider cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
                    title="Create slug from event name"
                  >
                    <SparklesIcon className="size-3 text-sky-400" />
                    <span>Create Slug</span>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Format */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-purple-400 border-b border-[#152A54]/60 pb-1">
              <UsersIcon className="size-3.5" />
              <span>Participation Mode</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsTeamEvent(false)}
                className={`h-9 px-3 text-xs font-bold uppercase border transition-all cursor-pointer ${
                  !isTeamEvent
                    ? "border-blue-500 bg-blue-950/60 text-blue-300 font-bold"
                    : "border-[#152A54] bg-[#03060E] text-slate-400 hover:text-white"
                }`}
              >
                Solo Entry (Individual)
              </button>
              <button
                type="button"
                onClick={() => setIsTeamEvent(true)}
                className={`h-9 px-3 text-xs font-bold uppercase border transition-all cursor-pointer ${
                  isTeamEvent
                    ? "border-purple-500 bg-purple-950/60 text-purple-300 font-bold"
                    : "border-[#152A54] bg-[#03060E] text-slate-400 hover:text-white"
                }`}
              >
                Team Participation
              </button>
            </div>

            {isTeamEvent && (
              <div className="grid grid-cols-2 gap-3 bg-[#03060E] border border-[#152A54] p-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-300">
                    Min Team Size
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={minTeamSize}
                    onChange={(e) => setMinTeamSize(Number(e.target.value))}
                    className="w-full h-8 bg-[#060D1A] border border-[#152A54] px-3 text-xs text-white focus:outline-hidden focus:border-blue-500 rounded-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-slate-300">
                    Max Team Size
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={maxTeamSize}
                    onChange={(e) => setMaxTeamSize(Number(e.target.value))}
                    className="w-full h-8 bg-[#060D1A] border border-[#152A54] px-3 text-xs text-white focus:outline-hidden focus:border-blue-500 rounded-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section: Venue & Timing */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-sky-400 border-b border-[#152A54]/60 pb-1">
              <MapPinIcon className="size-3.5" />
              <span>Logistics &amp; Timings</span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-slate-300">
                Venue Location *
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full h-9 bg-[#03060E] border border-[#152A54] px-3 text-xs text-white focus:outline-hidden focus:border-blue-500 rounded-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-300">
                  Starts At
                </label>
                <input
                  type="datetime-local"
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  className="w-full h-8 bg-[#03060E] border border-[#152A54] px-2 text-[11px] text-white focus:outline-hidden focus:border-blue-500 rounded-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-300">
                  Ends At
                </label>
                <input
                  type="datetime-local"
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  className="w-full h-8 bg-[#03060E] border border-[#152A54] px-2 text-[11px] text-white focus:outline-hidden focus:border-blue-500 rounded-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-slate-300">
                  Reg Deadline
                </label>
                <input
                  type="datetime-local"
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="w-full h-8 bg-[#03060E] border border-[#152A54] px-2 text-[11px] text-white focus:outline-hidden focus:border-blue-500 rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Description */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-emerald-400 border-b border-[#152A54]/60 pb-1">
              <FileTextIcon className="size-3.5" />
              <span>Description &amp; Challenge Details</span>
            </div>

            <div className="space-y-1">
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="w-full bg-[#03060E] border border-[#152A54] p-3 text-xs text-white placeholder:text-slate-600 focus:outline-hidden focus:border-blue-500 rounded-none leading-relaxed"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <DialogFooter className="p-4 border-t border-[#152A54] bg-[#03060E] flex flex-row items-center justify-between gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="rounded-none border-[#152A54] bg-[#060D1A] text-slate-300 font-mono text-xs uppercase"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="edit-event-form"
            disabled={isSubmitting}
            className="rounded-none bg-blue-600 hover:bg-blue-500 text-white font-mono text-xs uppercase font-bold px-5 cursor-pointer shadow-md shadow-blue-600/30"
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="size-3.5 animate-spin mr-1.5" />
                <span>Saving Changes...</span>
              </>
            ) : (
              <span>Save Changes</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

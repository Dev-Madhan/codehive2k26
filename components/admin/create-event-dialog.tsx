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
} from "lucide-react";
import { createEvent } from "@/actions/event";
import type { EventCategory } from "@prisma/client";

interface CreateEventDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  categories: { id: string; name: string; slug: string }[];
  onSuccess?: () => void;
}

export function CreateEventDialog({
  open,
  onOpenChange,
  categories,
  onSuccess,
}: CreateEventDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);

  // Form state
  const [name, setName] = React.useState("");
  const [slug, setSlug] = React.useState("");
  const [categoryId, setCategoryId] = React.useState(categories[0]?.id || "");
  const [venue, setVenue] = React.useState(
    "Palani Murugan Hall of Fame, Vel Tech Multi Tech, Avadi"
  );
  const [description, setDescription] = React.useState("");
  const [startAt, setStartAt] = React.useState("2026-10-23T08:30");
  const [endAt, setEndAt] = React.useState("2026-10-24T15:30");
  const [registrationDeadline, setRegistrationDeadline] = React.useState(
    "2026-10-22T23:59"
  );
  const [isTeamEvent, setIsTeamEvent] = React.useState(true);
  const [minTeamSize, setMinTeamSize] = React.useState(1);
  const [maxTeamSize, setMaxTeamSize] = React.useState(3);

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
    toast.success("Slug created from event name!", {
      description: `/events/${newSlug}`,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name.trim()) {
      toast.error("Please provide an event name.");
      return;
    }
    if (!slug.trim()) {
      toast.error("Please provide a valid URL slug.");
      return;
    }
    if (!description.trim() || description.length < 10) {
      toast.error("Description must be at least 10 characters.");
      return;
    }

    try {
      setIsSubmitting(true);
      const res = await createEvent({
        name: name.trim(),
        slug: slug.trim(),
        description: description.trim(),
        venue: venue.trim(),
        startAt: new Date(startAt),
        endAt: new Date(endAt),
        registrationDeadline: new Date(registrationDeadline),
        registrationOpen: true,
        capacity: 99999,
        categoryId: categoryId || undefined,
        isTeamEvent,
        minTeamSize: isTeamEvent ? Number(minTeamSize) : 1,
        maxTeamSize: isTeamEvent ? Number(maxTeamSize) : 1,
      });

      if (!res.success) {
        toast.error(res.error?.message || "Failed to create event track.");
        return;
      }

      toast.success(`Event track "${res.data.name}" created successfully!`, {
        description: `URL: /events/${res.data.slug}`,
      });

      onOpenChange(false);
      onSuccess?.();

      // Reset fields
      setName("");
      setSlug("");
      setDescription("");
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl w-full bg-[#0F0F0F] border border-[#262626] text-white p-0 overflow-hidden font-mono text-xs rounded-none shadow-2xl flex flex-col max-h-[90vh]">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 border-b border-[#262626] bg-[#080808] space-y-1 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white bg-white/10 border border-[#404040] px-2 py-0.5 uppercase tracking-wider inline-flex items-center gap-1.5">
              <span className="size-1.5 rounded-none bg-white animate-pulse" />
              EVENT AUTHORING ENGINE
            </span>
          </div>
          <DialogTitle className="text-base sm:text-lg font-bold text-white uppercase tracking-tight flex items-center gap-2">
            <SparklesIcon className="size-4 text-white shrink-0" />
            <span>Create New Symposium Event Track</span>
          </DialogTitle>
          <DialogDescription className="text-xs text-zinc-400">
            Publish a new competition or challenge for CodeHive 2K26 symposium.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Form Body */}
        <form
          id="create-event-form"
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 overflow-y-auto flex-1 no-scrollbar"
        >
          {/* Section: Track Identity */}
          <div className="space-y-3">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white border-b border-[#262626] pb-1">
              <TagIcon className="size-3.5" />
              <span>Track Identity</span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-300">
                  Event Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. CODE CRAFT HACKATHON"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full h-9 bg-[#080808] border border-[#262626] px-3 text-xs text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-white rounded-none uppercase font-semibold"
                />
              </div>

              <div className="space-y-1">
                <div className="flex items-center justify-between">
                  <label className="text-[10px] font-bold uppercase text-zinc-300">
                    URL Slug *
                  </label>
                  <span className="text-[10px] text-zinc-500 font-mono truncate max-w-[140px]">
                    {slug ? `/events/${slug}` : ""}
                  </span>
                </div>
                <div className="relative flex items-center">
                  <input
                    type="text"
                    required
                    placeholder="e.g. code-craft-2026"
                    value={slug}
                    onChange={(e) => setSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ""))}
                    className="w-full h-9 bg-[#080808] border border-[#262626] pl-3 pr-28 text-xs text-white font-mono focus:outline-hidden focus:border-white rounded-none lowercase"
                  />
                  <button
                    type="button"
                    onClick={handleGenerateSlug}
                    className="absolute right-1 top-1/2 -translate-y-1/2 h-7 px-2.5 bg-[#161616] hover:bg-[#262626] text-white border border-[#404040] text-[10px] uppercase font-bold tracking-wider cursor-pointer flex items-center gap-1.5 transition-all shadow-xs"
                    title="Create slug from event name"
                  >
                    <SparklesIcon className="size-3 text-white" />
                    <span>Create Slug</span>
                  </button>
                </div>
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-300">
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
                  <div className="px-2 py-1 text-[9px] font-bold uppercase tracking-wider text-zinc-500 border-b border-[#262626] mb-1 flex items-center justify-between">
                    <span>// TRACK CATEGORIES</span>
                    <span className="text-white font-bold">{categories.length} TOTAL</span>
                  </div>
                  {categories.map((cat) => (
                    <SelectItem key={cat.id} value={cat.id}>
                      {cat.name} ({cat.slug})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          {/* Section: Format & Participation */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white border-b border-[#262626] pb-1">
              <UsersIcon className="size-3.5" />
              <span>Participation Mode</span>
            </div>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setIsTeamEvent(false)}
                className={`h-9 px-3 text-xs font-bold uppercase border transition-all cursor-pointer ${
                  !isTeamEvent
                    ? "border-white bg-white/10 text-white font-bold"
                    : "border-[#262626] bg-[#080808] text-zinc-400 hover:text-white"
                }`}
              >
                Solo Entry (Individual)
              </button>
              <button
                type="button"
                onClick={() => setIsTeamEvent(true)}
                className={`h-9 px-3 text-xs font-bold uppercase border transition-all cursor-pointer ${
                  isTeamEvent
                    ? "border-white bg-white/10 text-white font-bold"
                    : "border-[#262626] bg-[#080808] text-zinc-400 hover:text-white"
                }`}
              >
                Team Participation
              </button>
            </div>

            {isTeamEvent && (
              <div className="grid grid-cols-2 gap-3 bg-[#080808] border border-[#262626] p-3">
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-zinc-300">
                    Min Team Size
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={minTeamSize}
                    onChange={(e) => setMinTeamSize(Number(e.target.value))}
                    className="w-full h-8 bg-[#080808] border border-[#262626] px-3 text-xs text-white focus:outline-hidden focus:border-white rounded-none"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-[10px] font-bold uppercase text-zinc-300">
                    Max Team Size
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={10}
                    value={maxTeamSize}
                    onChange={(e) => setMaxTeamSize(Number(e.target.value))}
                    className="w-full h-8 bg-[#080808] border border-[#262626] px-3 text-xs text-white focus:outline-hidden focus:border-white rounded-none"
                  />
                </div>
              </div>
            )}
          </div>

          {/* Section: Logistics & Timings */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white border-b border-[#262626] pb-1">
              <MapPinIcon className="size-3.5" />
              <span>Logistics &amp; Venue</span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-300">
                Venue Location *
              </label>
              <input
                type="text"
                required
                value={venue}
                onChange={(e) => setVenue(e.target.value)}
                className="w-full h-9 bg-[#080808] border border-[#262626] px-3 text-xs text-white focus:outline-hidden focus:border-white rounded-none"
              />
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-300">
                  Starts At
                </label>
                <input
                  type="datetime-local"
                  required
                  value={startAt}
                  onChange={(e) => setStartAt(e.target.value)}
                  className="w-full h-8 bg-[#080808] border border-[#262626] px-2 text-[11px] text-white focus:outline-hidden focus:border-white rounded-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-300">
                  Ends At
                </label>
                <input
                  type="datetime-local"
                  required
                  value={endAt}
                  onChange={(e) => setEndAt(e.target.value)}
                  className="w-full h-8 bg-[#080808] border border-[#262626] px-2 text-[11px] text-white focus:outline-hidden focus:border-white rounded-none"
                />
              </div>
              <div className="space-y-1">
                <label className="text-[10px] font-bold uppercase text-zinc-300">
                  Reg Deadline
                </label>
                <input
                  type="datetime-local"
                  required
                  value={registrationDeadline}
                  onChange={(e) => setRegistrationDeadline(e.target.value)}
                  className="w-full h-8 bg-[#080808] border border-[#262626] px-2 text-[11px] text-white focus:outline-hidden focus:border-white rounded-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Challenge Scope */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-white border-b border-[#262626] pb-1">
              <FileTextIcon className="size-3.5" />
              <span>Track Challenge Brief &amp; Rules</span>
            </div>

            <div className="space-y-1">
              <label className="text-[10px] font-bold uppercase text-zinc-300">
                Detailed Description &amp; Problem Statement *
              </label>
              <textarea
                required
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Explain the objectives, problem statement, judging criteria, and round formats..."
                className="w-full bg-[#080808] border border-[#262626] p-3 text-xs text-white placeholder:text-zinc-600 focus:outline-hidden focus:border-white rounded-none leading-relaxed"
              />
            </div>
          </div>
        </form>

        {/* Footer */}
        <DialogFooter className="p-4 border-t border-[#262626] bg-[#080808] flex flex-row items-center justify-between gap-3 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="rounded-none border-[#262626] bg-[#0F0F0F] text-zinc-300 hover:bg-[#161616] hover:text-white font-mono text-xs uppercase"
          >
            Cancel
          </Button>

          <Button
            type="submit"
            form="create-event-form"
            disabled={isSubmitting}
            className="rounded-none bg-white hover:bg-zinc-200 text-black font-mono text-xs uppercase font-bold px-5 cursor-pointer border border-white"
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="size-3.5 animate-spin mr-1.5" />
                <span>Publishing Track...</span>
              </>
            ) : (
              <span>Publish Event Track</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

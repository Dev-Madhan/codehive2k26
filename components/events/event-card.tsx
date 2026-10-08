"use client";

import * as React from "react";
import Link from "next/link";
import { Event } from "@prisma/client";
import {
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  ArrowRightIcon,
  LayersIcon,
  CpuIcon,
  BrainCircuitIcon,
  SparklesIcon,
  AlertTriangleIcon,
  TrophyIcon,
  BusIcon,
  ShieldCheckIcon,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: Event & {
    category?: { name: string } | null;
    _count?: { registrations: number };
  };
}

export function EventCard({ event }: EventCardProps) {
  const [dialogOpen, setDialogOpen] = React.useState(false);

  const isAgentVibe = event.slug.includes("agentvibe");
  const isTechForge = event.slug.includes("techforge");
  const Icon = isAgentVibe ? BrainCircuitIcon : CpuIcon;

  const tag = isTechForge
    ? "EVENT 01 // TECHNICAL"
    : isAgentVibe
    ? "EVENT 02 // AI AGENT"
    : `TRACK // ${(event.category?.name || "TECHNICAL").toUpperCase()}`;

  const mobileTag = isTechForge ? "EVENT 01" : isAgentVibe ? "EVENT 02" : "TRACK";

  const subtitle = isTechForge
    ? "Analyze. Build. Adapt. Defend."
    : isAgentVibe
    ? "Imagine. Build. Adapt. Deploy."
    : "Code. Innovate. Compete.";

  const description = isTechForge
    ? "A 2-day technical challenge where teams solve real-world problems through coding, system design, and surprise constraints across 4 progressive rounds."
    : isAgentVibe
    ? "A 2-day AI challenge where teams design, build, and deploy autonomous AI agents and intelligent workflows across 4 progressive rounds."
    : event.description;

  const initialIsOpen = event.registrationOpen !== false && event.status !== "REGISTRATION_CLOSED";
  const [isOpen, setIsOpen] = React.useState(initialIsOpen);

  React.useEffect(() => {
    setIsOpen(event.registrationOpen !== false && event.status !== "REGISTRATION_CLOSED");
  }, [event.registrationOpen, event.status]);

  React.useEffect(() => {
    const checkGate = async () => {
      try {
        const res = await fetch(`/api/events/gate?slug=${event.slug}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setIsOpen(Boolean(json.data.isOpen));
          }
        }
      } catch {
        // Silently ignore background polling network errors
      }
    };

    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        checkGate();
      }
    }, 6000);

    const handleFocus = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        checkGate();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [event.slug]);

  // Sister event data for smart redirection dialog
  const sisterEvent = isTechForge
    ? {
        name: "AGENT VIBE",
        slug: "agentvibe-2026",
        subtitle: "2-Day AI Agent Hackathon",
      }
    : {
        name: "TECH FORGE",
        slug: "techforge-2026",
        subtitle: "2-Day Technical Coding & Architecture",
      };

  return (
    <>
      <div className="group relative border border-[#262626] bg-[#0A0A0A] p-4 sm:p-8 transition-colors duration-150 hover:border-[#404040] hover:bg-[#0D0D0D] active:border-white flex flex-col justify-between h-full font-mono">
        {/* Corner accent brackets */}
        <div className="absolute top-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 border-t border-r border-[#333333] group-hover:border-white transition-colors duration-200" />
        <div className="absolute bottom-0 left-0 w-2 h-2 sm:w-2.5 sm:h-2.5 border-b border-l border-[#333333] group-hover:border-white transition-colors duration-200" />

        <div className="flex flex-col flex-1 space-y-4 sm:space-y-6">
          {/* Status & Tag Bar */}
          <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#1c1c1c] gap-2">
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#121212] text-neutral-300 border border-[#262626] shrink-0">
              <span className="hidden xs:inline">[ {tag} ]</span>
              <span className="xs:hidden">[ {mobileTag} ]</span>
            </span>

            {isOpen ? (
              <div className="flex items-center gap-1.5 shrink-0">
                {isAgentVibe && (
                  <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-amber-400 font-bold border border-amber-500/40 bg-amber-500/10 px-1.5 py-0.5 hidden xs:inline-block">
                    SPOTLIGHT TRACK
                  </span>
                )}
                <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5 shrink-0">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  <span>REGISTRATION OPEN</span>
                </span>
              </div>
            ) : (
              <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-wider text-amber-400 font-bold flex items-center gap-1.5 shrink-0 border border-amber-500/40 bg-amber-500/10 px-2 py-0.5">
                <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                <span>SLOTS PAUSED</span>
              </span>
            )}
          </div>

          {/* Header Info */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="p-2.5 sm:p-3 bg-[#121212] border border-[#262626] group-hover:border-[#383838] transition-colors shrink-0">
              <Icon className="size-5 sm:size-6 text-white" />
            </div>
            <div className="min-w-0">
              <h3 className="font-mono text-xl sm:text-3xl font-black uppercase text-white tracking-tight group-hover:text-neutral-100 transition-colors leading-tight truncate">
                {event.name}
              </h3>
              <p className="font-mono text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wide mt-0.5 truncate">
                // {subtitle}
              </p>
            </div>
          </div>

          {/* Description - Equal height calibrated */}
          <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans line-clamp-2 sm:line-clamp-none sm:min-h-[3.5rem] flex items-center">
            {description}
          </p>

          {/* ── Mobile Telemetry List (sm:hidden) ── */}
          <div className="sm:hidden border border-[#222222] bg-[#080808] divide-y divide-[#1A1A1A] font-mono mt-auto">
            <div className="flex items-center justify-between px-3 py-2 text-[11px]">
              <span className="text-[#737373] flex items-center gap-1.5">
                <LayersIcon className="size-3 text-neutral-400 shrink-0" />
                <span>// ROUNDS</span>
              </span>
              <span className="text-white font-bold">4 Rounds (200 M)</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-[11px]">
              <span className="text-[#737373] flex items-center gap-1.5">
                <UsersIcon className="size-3 text-neutral-400 shrink-0" />
                <span>// SQUAD</span>
              </span>
              <span className="text-white font-bold">
                {event.minTeamSize === event.maxTeamSize
                  ? `Team of ${event.minTeamSize}`
                  : `${event.minTeamSize}–${event.maxTeamSize} Builders`}
              </span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-[11px]">
              <span className="text-[#737373] flex items-center gap-1.5">
                <CalendarIcon className="size-3 text-neutral-400 shrink-0" />
                <span>// DATE</span>
              </span>
              <span className="text-white font-bold">23 &amp; 24 Oct 2026</span>
            </div>
            <div className="flex items-center justify-between px-3 py-2 text-[11px]">
              <span className="text-[#737373] flex items-center gap-1.5">
                <MapPinIcon className="size-3 text-neutral-400 shrink-0" />
                <span>// VENUE</span>
              </span>
              <span className="text-white font-bold" title="Vel Tech Multi Tech (VTMT)">VTMT</span>
            </div>
          </div>

          {/* ── Desktop 4-Cell Partitioned Telemetry Spec Block (hidden sm:block) ── */}
          <div className="hidden sm:block border border-[#222222] bg-[#080808] divide-y divide-[#222222] font-mono mt-auto">
            {/* Row 1 */}
            <div className="grid grid-cols-2 divide-x divide-[#222222]">
              <div className="p-3.5 flex items-center gap-2.5">
                <div className="p-1.5 bg-[#141414] border border-[#262626] shrink-0">
                  <LayersIcon className="size-3.5 text-neutral-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-[#737373]">
                    // ROUNDS
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    4 Rounds // 200 Pts
                  </div>
                </div>
              </div>

              <div className="p-3.5 flex items-center gap-2.5">
                <div className="p-1.5 bg-[#141414] border border-[#262626] shrink-0">
                  <UsersIcon className="size-3.5 text-neutral-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-[#737373]">
                    // TEAM
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    {event.minTeamSize === event.maxTeamSize
                      ? `Team of ${event.minTeamSize}`
                      : `${event.minTeamSize}–${event.maxTeamSize} Builders`}
                  </div>
                </div>
              </div>
            </div>

            {/* Row 2 */}
            <div className="grid grid-cols-2 divide-x divide-[#222222]">
              <div className="p-3.5 flex items-center gap-2.5">
                <div className="p-1.5 bg-[#141414] border border-[#262626] shrink-0">
                  <CalendarIcon className="size-3.5 text-neutral-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-[#737373]">
                    // DATE
                  </div>
                  <div className="text-xs font-bold text-white truncate">
                    23 &amp; 24 Oct 2026
                  </div>
                </div>
              </div>

              <div className="p-3.5 flex items-center gap-2.5">
                <div className="p-1.5 bg-[#141414] border border-[#262626] shrink-0">
                  <MapPinIcon className="size-3.5 text-neutral-300" />
                </div>
                <div className="min-w-0">
                  <div className="text-[10px] uppercase tracking-widest text-[#737373]">
                    // VENUE
                  </div>
                  <div className="text-xs font-bold text-white truncate" title={event.venue}>
                    Vel Tech Multi Tech
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Action Button */}
        <div className="pt-4 sm:pt-6">
          {isOpen ? (
            <Link
              href={`/events/${event.slug}`}
              className="group/btn w-full inline-flex items-center justify-center gap-2 h-11 sm:h-12 font-mono text-xs uppercase tracking-wider font-bold bg-white hover:bg-neutral-200 text-black border border-white transition-all duration-150 active:scale-[0.99]"
            >
              <span className="hidden sm:inline">[ View Track Details &amp; Register ]</span>
              <span className="sm:hidden">[ View Track &amp; Register ]</span>
              <ArrowRightIcon className="size-3.5 group-hover/btn:translate-x-1 transition-transform" />
            </Link>
          ) : (
            <button
              type="button"
              onClick={() => setDialogOpen(true)}
              className="group/btn w-full inline-flex items-center justify-center gap-2 h-11 sm:h-12 font-mono text-xs uppercase tracking-wider font-bold bg-[#121212] hover:bg-[#1A1A1A] hover:border-amber-500/50 text-white border border-[#333333] transition-all duration-150 active:scale-[0.99] cursor-pointer"
            >
              <span className="size-1.5 rounded-full bg-amber-400 shrink-0" />
              <span className="hidden sm:inline">[ View Track Status &amp; Alternatives ]</span>
              <span className="sm:hidden">[ Track Status &amp; Alternatives ]</span>
              <ArrowRightIcon className="size-3.5 group-hover/btn:translate-x-1 transition-transform text-neutral-400" />
            </button>
          )}
        </div>
      </div>

      {/* Realtime Slots Paused Dialog */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="w-[calc(100vw-2rem)] max-w-md bg-[#0F0F0F] border border-[#262626] text-white p-0 overflow-hidden font-mono text-xs rounded-none shadow-2xl flex flex-col max-h-[90vh] sm:max-h-[85vh] no-scrollbar">
          {/* Header */}
          <DialogHeader className="p-4 sm:p-5 pr-12 border-b border-[#262626] bg-[#0A0A0A] space-y-1.5 shrink-0">
            <div className="flex items-center justify-between gap-2">
              <span className="text-[10px] font-bold text-amber-400 bg-amber-500/15 border border-amber-500/40 px-2 py-0.5 uppercase tracking-wider inline-flex items-center gap-1.5">
                <span className="size-1.5 rounded-full bg-amber-400" />
                SLOTS PAUSED
              </span>
              <span className="text-[9px] text-neutral-400 uppercase tracking-widest hidden xs:inline font-mono">
                REALTIME CAPACITY GATE
              </span>
            </div>
            <DialogTitle className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
              {event.name}
            </DialogTitle>
            <DialogDescription className="text-xs text-neutral-300 leading-relaxed font-sans">
              Registrations are temporarily paused to manage track capacity. Confirmed teams are safe.
            </DialogDescription>
          </DialogHeader>

          {/* Dialog Scrollable Body (Scrollbar removed, full touch/wheel scroll retained) */}
          <div className="p-4 sm:p-5 space-y-3.5 overflow-y-auto flex-1 no-scrollbar">
            {/* Sister Track Showcase */}
            <div className="border border-[#262626] bg-[#080808] p-3.5 space-y-3">
              <div className="flex items-center justify-between border-b border-[#1A1A1A] pb-2">
                <span className="text-[10px] text-neutral-300 uppercase font-bold flex items-center gap-1.5">
                  <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  RECOMMENDED ACTIVE TRACK:
                </span>
                <span className="text-[9px] text-emerald-400 font-bold border border-emerald-500/40 bg-emerald-500/10 px-1.5 py-0.5">
                  SLOTS OPEN
                </span>
              </div>

              <div>
                <h4 className="text-sm sm:text-base font-black text-white uppercase tracking-tight">
                  {sisterEvent.name}
                </h4>
                <p className="text-[11px] text-neutral-400 font-sans mt-0.5">
                  {sisterEvent.subtitle} • 4 progressive rounds at Vel Tech Multi Tech.
                </p>
              </div>

              {/* 4 Feature Badges with Lucide Icons */}
              <div className="grid grid-cols-2 gap-1.5 text-[10px] pt-1">
                <div className="bg-[#121212] p-2 border border-[#222222] flex items-center gap-2 text-neutral-300">
                  <TrophyIcon className="size-3.5 text-amber-400 shrink-0" />
                  <span className="font-bold text-white truncate">₹20,000 Prizes</span>
                </div>
                <div className="bg-[#121212] p-2 border border-[#222222] flex items-center gap-2 text-neutral-300">
                  <BusIcon className="size-3.5 text-sky-400 shrink-0" />
                  <span className="font-bold text-white truncate">Free Bus &amp; Food</span>
                </div>
                <div className="bg-[#121212] p-2 border border-[#222222] flex items-center gap-2 text-neutral-300">
                  <CalendarIcon className="size-3.5 text-neutral-400 shrink-0" />
                  <span className="font-bold text-white truncate">23 &amp; 24 Oct 2026</span>
                </div>
                <div className="bg-[#121212] p-2 border border-[#222222] flex items-center gap-2 text-neutral-300">
                  <MapPinIcon className="size-3.5 text-neutral-400 shrink-0" />
                  <span className="font-bold text-white truncate">VTMT Campus</span>
                </div>
              </div>
            </div>

            {/* Zero Data Loss Reassurance Note */}
            <div className="border border-emerald-500/30 bg-emerald-950/20 p-2.5 sm:p-3 flex items-start gap-2.5">
              <ShieldCheckIcon className="size-4 text-emerald-400 shrink-0 mt-0.5" />
              <div className="space-y-0.5 min-w-0">
                <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                  Confirmed Teams 100% Safe
                </p>
                <p className="text-[10px] text-neutral-300 leading-relaxed font-sans">
                  Teams already registered for {event.name} maintain full confirmed status. All entry passes remain valid.
                </p>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-1">
              <Link
                href={`/events/${sisterEvent.slug}`}
                onClick={() => setDialogOpen(false)}
                className="group/cta w-full h-11 sm:h-12 bg-white hover:bg-neutral-200 text-black font-mono text-xs uppercase font-bold tracking-wider border border-white flex items-center justify-center gap-2 transition-all active:scale-[0.99] cursor-pointer"
              >
                <span>Register for {sisterEvent.name} Now</span>
                <ArrowRightIcon className="size-3.5 group-hover/cta:translate-x-1 transition-transform" />
              </Link>

              <Link
                href={`/events/${event.slug}`}
                onClick={() => setDialogOpen(false)}
                className="w-full h-10 sm:h-11 bg-[#141414] hover:bg-[#1A1A1A] text-neutral-300 hover:text-white font-mono text-xs uppercase font-bold border border-[#2E2E2E] flex items-center justify-center transition-colors cursor-pointer"
              >
                <span>View {event.name} Track Specs</span>
              </Link>
            </div>
          </div>

          {/* Footer */}
          <DialogFooter className="p-3 sm:p-3.5 border-t border-[#262626] bg-[#0A0A0A] flex flex-row items-center justify-between shrink-0">
            <span className="text-[10px] text-neutral-400 font-mono hidden xs:inline">
              [ CODEHIVE // SYMPOSIUM 2026 ]
            </span>
            <Button
              type="button"
              variant="outline"
              onClick={() => setDialogOpen(false)}
              className="w-full xs:w-auto rounded-none border-[#333333] bg-[#141414] text-neutral-300 hover:text-white font-mono text-xs uppercase h-9 px-4 cursor-pointer"
            >
              Dismiss
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

export default EventCard;

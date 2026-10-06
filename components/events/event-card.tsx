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
} from "lucide-react";

interface EventCardProps {
  event: Event & {
    category?: { name: string } | null;
    _count?: { registrations: number };
  };
}

export function EventCard({ event }: EventCardProps) {
  const isAgentVibe = event.slug.includes("agentvibe");
  const isTechForge = event.slug.includes("techforge");
  const Icon = isAgentVibe ? BrainCircuitIcon : CpuIcon;

  const tag = isTechForge
    ? "EVENT 01 // TECHNICAL"
    : isAgentVibe
    ? "EVENT 02 // AI AGENT"
    : `TRACK // ${(event.category?.name || "TECHNICAL").toUpperCase()}`;

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

  return (
    <div className="group relative border border-[#262626] bg-[#0A0A0A] p-4 sm:p-8 transition-colors duration-150 hover:border-[#404040] hover:bg-[#0D0D0D] active:border-white flex flex-col justify-between h-full">
      {/* Corner accent brackets */}
      <div className="absolute top-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 border-t border-r border-[#333333] group-hover:border-white transition-colors duration-200" />
      <div className="absolute bottom-0 left-0 w-2 h-2 sm:w-2.5 sm:h-2.5 border-b border-l border-[#333333] group-hover:border-white transition-colors duration-200" />

      <div className="flex flex-col flex-1 space-y-4 sm:space-y-6">
        {/* Status & Tag Bar */}
        <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#1c1c1c] gap-2">
          <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#121212] text-neutral-300 border border-[#262626] truncate">
            [ {tag} ]
          </span>
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5 shrink-0">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>REGISTRATION OPEN</span>
          </span>
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

        {/* ── Mobile Telemetry List (sm:hidden) - Zero Truncation, Clean Alignment ── */}
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
        <Link
          href={`/events/${event.slug}`}
          className="group/btn w-full inline-flex items-center justify-center gap-2 h-11 sm:h-12 font-mono text-xs uppercase tracking-wider font-bold bg-white hover:bg-neutral-200 text-black border border-white transition-all duration-150 active:scale-[0.99]"
        >
          <span className="hidden sm:inline">[ View Track Details &amp; Register ]</span>
          <span className="sm:hidden">[ View Track &amp; Register ]</span>
          <ArrowRightIcon className="size-3.5 group-hover/btn:translate-x-1 transition-transform" />
        </Link>
      </div>
    </div>
  );
}

export default EventCard;

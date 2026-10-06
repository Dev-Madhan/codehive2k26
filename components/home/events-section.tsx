"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  ArrowRightIcon,
  BrainCircuitIcon,
  CpuIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  LayersIcon,
} from "lucide-react";

interface RealEventItem {
  id: string;
  slug: string;
  name: string;
  tag: string;
  category: string;
  subtitle: string;
  description: string;
  rounds: string;
  teamSize: string;
  venue: string;
  status: string;
  href: string;
}

const REAL_EVENTS: RealEventItem[] = [
  {
    id: "techforge-2026",
    slug: "techforge-2026",
    name: "TECH FORGE",
    tag: "EVENT 01 // TECHNICAL",
    category: "2-DAY CODING // 4 ROUNDS",
    subtitle: "Analyze. Build. Adapt. Defend.",
    description:
      "A 2-day technical challenge where teams solve real-world problems through coding, system design, and surprise constraints across 4 progressive rounds.",
    rounds: "4 Rounds // 200 Pts",
    teamSize: "Team of 3",
    venue: "Palani Murugan Hall of Fame",
    status: "OPEN",
    href: "/events/techforge-2026",
  },
  {
    id: "agentvibe-2026",
    slug: "agentvibe-2026",
    name: "AGENT VIBE",
    tag: "EVENT 02 // AI AGENT",
    category: "2-DAY AI // 4 ROUNDS",
    subtitle: "Imagine. Build. Adapt. Deploy.",
    description:
      "A 2-day AI challenge where teams design, build, and deploy autonomous AI agents and intelligent workflows across 4 progressive rounds.",
    rounds: "4 Rounds // 200 Pts",
    teamSize: "Team of 3",
    venue: "Palani Murugan Hall of Fame",
    status: "OPEN",
    href: "/events/agentvibe-2026",
  },
];

interface EventsSectionProps {
  initialEvents?: any[];
}

export function EventsSection({ initialEvents }: EventsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.05, once: true });

  // Map and sort so TECH FORGE is first, then AGENT VIBE, with balanced descriptions
  const displayEvents: RealEventItem[] = (() => {
    if (!initialEvents || initialEvents.length === 0) return REAL_EVENTS;

    const sorted = [...initialEvents].sort((a, b) => {
      if (a.slug?.includes("techforge")) return -1;
      if (b.slug?.includes("techforge")) return 1;
      return 0;
    });

    return sorted.map((ev) => {
      const isTechforge = ev.slug?.includes("techforge");
      const defaultRef = isTechforge ? REAL_EVENTS[0] : REAL_EVENTS[1];

      return {
        id: ev.id || defaultRef.id,
        slug: ev.slug || defaultRef.slug,
        name: ev.name || defaultRef.name,
        tag: isTechforge ? "EVENT 01 // TECHNICAL" : "EVENT 02 // AI AGENT",
        category: isTechforge ? "2-DAY CODING // 4 ROUNDS" : "2-DAY AI // 4 ROUNDS",
        subtitle: defaultRef.subtitle,
        description: defaultRef.description,
        rounds: "4 Rounds // 200 Pts",
        teamSize:
          ev.minTeamSize && ev.maxTeamSize && ev.minTeamSize === ev.maxTeamSize
            ? `Team of ${ev.minTeamSize}`
            : "Team of 3",
        venue: ev.venue || defaultRef.venue,
        status: "OPEN",
        href: `/events/${ev.slug || defaultRef.slug}`,
      };
    });
  })();

  return (
    <section
      ref={ref}
      id="events"
      className="relative py-16 sm:py-28 bg-black border-t border-[#262626] overflow-hidden"
    >
      {/* Subtle grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Top ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-gradient-to-b from-white/5 to-transparent blur-[90px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header - 100% flush aligned with cards below and entire website */}
        <div
          className={cn(
            "flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2 transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="h-px w-8 bg-white" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#737373]">
                // COMPETITION TRACKS
              </span>
            </div>

            <h2 className="font-mono text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              CHOOSE YOUR TRACK<span className="inline-block animate-pulse text-white">_</span>
            </h2>

            <p className="text-xs sm:text-sm font-sans text-neutral-400 leading-relaxed">
              Two flagship hackathon tracks at CodeHive 2K26. 100% Free entry, 4 progressive rounds, and ₹20,000 in prizes.
            </p>
          </div>

          <Link
            href="/events"
            className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white border border-[#262626] hover:border-white bg-[#0A0A0A] hover:bg-[#141414] px-5 py-3 transition-all shrink-0 self-start sm:self-end"
          >
            <span>[ View All Tracks ]</span>
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>

        {/* 2-Column Balanced Grid - Exact equal heights & horizontal baseline alignment */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 items-stretch">
          {displayEvents.map((event, i) => {
            const Icon = event.slug.includes("agentvibe") ? BrainCircuitIcon : CpuIcon;

            return (
              <div
                key={event.id}
                className={cn(
                  "group relative flex flex-col justify-between p-4 sm:p-8 border border-[#262626] bg-[#0A0A0A] backdrop-blur-sm h-full",
                  "hover:border-[#404040] hover:bg-[#0D0D0D] active:border-white transition-colors duration-150",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Corner accent brackets */}
                <div className="absolute top-0 right-0 w-2 h-2 sm:w-2.5 sm:h-2.5 border-t border-r border-[#333333] group-hover:border-white transition-colors duration-200" />
                <div className="absolute bottom-0 left-0 w-2 h-2 sm:w-2.5 sm:h-2.5 border-b border-l border-[#333333] group-hover:border-white transition-colors duration-200" />

                <div className="flex flex-col flex-1 space-y-4 sm:space-y-6">
                  {/* Status & Tag Bar */}
                  <div className="flex items-center justify-between pb-3 sm:pb-4 border-b border-[#1c1c1c] gap-2">
                    <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-wider px-2 py-0.5 sm:px-2.5 sm:py-1 bg-[#121212] text-neutral-300 border border-[#262626] truncate">
                      [ {event.tag} ]
                    </span>
                    <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-emerald-400 font-bold flex items-center gap-1.5 shrink-0">
                      <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
                      <span>REGISTRATION OPEN</span>
                    </span>
                  </div>

                  {/* Header info */}
                  <div className="flex items-center gap-3 sm:gap-4">
                    <div className="p-2.5 sm:p-3 bg-[#121212] border border-[#262626] group-hover:border-[#383838] transition-colors shrink-0">
                      <Icon className="size-5 sm:size-6 text-white" />
                    </div>
                    <div className="min-w-0">
                      <h3 className="font-mono text-xl sm:text-3xl font-black uppercase text-white tracking-tight group-hover:text-neutral-100 transition-colors leading-tight truncate">
                        {event.name}
                      </h3>
                      <p className="font-mono text-[10px] sm:text-xs text-neutral-400 uppercase tracking-wide mt-0.5 truncate">
                        // {event.subtitle}
                      </p>
                    </div>
                  </div>

                  {/* Description - Equal height calibrated */}
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans line-clamp-2 sm:line-clamp-none sm:min-h-[3.5rem] flex items-center">
                    {event.description}
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
                      <span className="text-white font-bold">{event.teamSize}</span>
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
                      <span className="text-white font-bold">Vel Tech Campus</span>
                    </div>
                  </div>

                  {/* ── Desktop 4-Cell Partitioned Telemetry Spec Block (hidden sm:block) ── */}
                  <div className="hidden sm:block border border-[#222222] bg-[#080808] divide-y divide-[#222222] font-mono mt-auto">
                    {/* Row 1 */}
                    <div className="grid grid-cols-2 divide-x divide-[#222222]">
                      <div className="p-3 sm:p-3.5 flex items-center gap-2.5">
                        <div className="p-1.5 bg-[#141414] border border-[#262626] shrink-0">
                          <LayersIcon className="size-3.5 text-neutral-300" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase tracking-widest text-[#737373]">
                            // ROUNDS
                          </div>
                          <div className="text-xs font-bold text-white truncate">
                            {event.rounds}
                          </div>
                        </div>
                      </div>

                      <div className="p-3 sm:p-3.5 flex items-center gap-2.5">
                        <div className="p-1.5 bg-[#141414] border border-[#262626] shrink-0">
                          <UsersIcon className="size-3.5 text-neutral-300" />
                        </div>
                        <div className="min-w-0">
                          <div className="text-[10px] uppercase tracking-widest text-[#737373]">
                            // TEAM
                          </div>
                          <div className="text-xs font-bold text-white truncate">
                            {event.teamSize}
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Row 2 */}
                    <div className="grid grid-cols-2 divide-x divide-[#222222]">
                      <div className="p-3 sm:p-3.5 flex items-center gap-2.5">
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

                      <div className="p-3 sm:p-3.5 flex items-center gap-2.5">
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
                    href={event.href}
                    className="group/btn w-full inline-flex items-center justify-center gap-2 h-11 sm:h-12 font-mono text-xs uppercase tracking-wider font-bold bg-white hover:bg-neutral-200 text-black border border-white transition-all duration-150 active:scale-[0.99]"
                  >
                    <span className="hidden sm:inline">[ View Track Details &amp; Register ]</span>
                    <span className="sm:hidden">[ View Track &amp; Register ]</span>
                    <ArrowRightIcon className="size-3.5 group-hover/btn:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

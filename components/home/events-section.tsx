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
  AwardIcon,
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
  entries: string;
  venue: string;
  status: string;
  accent: "blue" | "sky";
  href: string;
}

const REAL_EVENTS: RealEventItem[] = [
  {
    id: "techforge-2026",
    slug: "techforge-2026",
    name: "TECH FORGE",
    tag: "EVENT 1 // TECHNICAL",
    category: "2-DAY TECHNICAL // 4 ROUNDS",
    subtitle: "One Problem. Four Rounds. One Champion.",
    description:
      "TECHFORGE is a 2-day technical challenge where you Analyze, Build, Adapt & Defend. Solve a real-world problem, develop your solution, and face a surprise technical challenge that will test your coding, problem-solving, and innovation skills.",
    rounds: "4 Rounds (200 Pts)",
    teamSize: "1–3 Builders",
    entries: "Unlimited",
    venue: "Palani Murugan Hall of Fame, Vel Tech Multi Tech",
    status: "OPEN",
    accent: "blue",
    href: "/events/techforge-2026",
  },
  {
    id: "agentvibe-2026",
    slug: "agentvibe-2026",
    name: "AGENT VIBE",
    tag: "EVENT 2 // AI AGENT",
    category: "2-DAY AI // 4 ROUNDS",
    subtitle: "One Idea. Four Rounds. One AI Champion.",
    description:
      "AGENT VIBE is a 2-day AI challenge where you Imagine, Build, Adapt & Deploy. Design and develop intelligent AI agents to solve real-world problems, then tackle surprise challenges that will test your creativity, AI skills, and ability to innovate using LLMs, APIs, and modern AI tools.",
    rounds: "4 Rounds (200 Pts)",
    teamSize: "1–3 Builders",
    entries: "Unlimited",
    venue: "Palani Murugan Hall of Fame, Vel Tech Multi Tech",
    status: "OPEN",
    accent: "sky",
    href: "/events/agentvibe-2026",
  },
];

const monochromeEventCard = {
  tagColor: "text-white",
  border: "border-[#262626] hover:border-[#404040]",
  prizeBg: "bg-[#161616] text-[#E5E5E5] border-[#262626]",
  statusColor: "text-white",
  glow: "shadow-[inset_0_0_40px_rgba(255,255,255,0.02)] hover:shadow-[0_0_35px_rgba(255,255,255,0.06)]",
  cornerColor: "border-[#404040] group-hover:border-white transition-colors",
  iconColor: "text-white",
  iconBg: "bg-[#161616] border border-[#262626]",
  line: "bg-white",
  buttonBg: "bg-white hover:bg-[#E5E5E5] text-black border border-white",
};

interface EventsSectionProps {
  initialEvents?: any[];
}

export function EventsSection({ initialEvents }: EventsSectionProps) {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.05, once: true });

  // Map database events if provided, else use the real static definitions
  const displayEvents: RealEventItem[] =
    initialEvents && initialEvents.length > 0
      ? initialEvents.map((ev, idx) => {
          const isTechforge = ev.slug?.includes("techforge");
          const defaultRef = isTechforge ? REAL_EVENTS[0] : REAL_EVENTS[1] || REAL_EVENTS[0];
          return {
            id: ev.id || defaultRef.id,
            slug: ev.slug || defaultRef.slug,
            name: defaultRef.name,
            tag: isTechforge ? "EVENT 1 // TECHNICAL" : "EVENT 2 // AI AGENT",
            category: isTechforge ? "2-DAY TECHNICAL // 4 ROUNDS" : "2-DAY AI // 4 ROUNDS",
            subtitle: defaultRef.subtitle,
            description: defaultRef.description,
            rounds: defaultRef.rounds,
            teamSize: `${ev.minTeamSize || 1}–${ev.maxTeamSize || 3} Builders`,
            entries: "Unlimited",
            venue: "Palani Murugan Hall of Fame, Vel Tech Multi Tech",
            status: ev.registrationOpen ? "OPEN" : "CLOSED",
            accent: (idx % 2 === 0 ? "blue" : "sky") as "blue" | "sky",
            href: `/events/${ev.slug}`,
          };
        })
      : REAL_EVENTS;

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 bg-black border-t border-[#262626] overflow-hidden"
    >
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - No section numbers */}
        <div
          className={cn(
            "mb-16 transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-white" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#737373]">
              EVENTS
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                CHOOSE YOUR{" "}
                <span className="text-white">
                  BATTLEFIELD
                </span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm font-sans text-neutral-400 max-w-xl">
                Official 2-Day National Hackathon challenges of CodeHive 2K26 2.0. Entry is 100% Free with Certificates awarded to all participants.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-white hover:text-white border border-[#262626] hover:border-[#404040] bg-[#0F0F0F] hover:bg-[#161616] px-4 py-2 transition-all shrink-0"
            >
              [ View Event Registry ] <ArrowRightIcon className="size-3" />
            </Link>
          </div>
        </div>

        {/* Real Event Cards - 2-Column Balanced Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {displayEvents.map((event, i) => {
            const Icon = event.slug.includes("agentvibe") ? BrainCircuitIcon : CpuIcon;

            return (
              <div
                key={event.id}
                className={cn(
                  "group relative flex flex-col p-6 sm:p-8 border bg-[#0F0F0F] backdrop-blur-sm transition-all duration-500",
                  monochromeEventCard.border,
                  monochromeEventCard.glow,
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Top accent line */}
                <div className={cn("absolute top-0 left-0 right-0 h-[2px]", monochromeEventCard.line)} />

                {/* Sharp Corner brackets */}
                <div className={cn("absolute top-2 right-2 w-3.5 h-3.5 border-t border-r", monochromeEventCard.cornerColor)} />
                <div className={cn("absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l", monochromeEventCard.cornerColor)} />

                {/* Status & Tag bar */}
                <div className="flex items-center justify-between mb-6">
                  <span className={cn("font-mono text-[11px] uppercase font-bold tracking-widest px-2.5 py-0.5 bg-[#161616] border border-[#262626]", monochromeEventCard.tagColor)}>
                    [ {event.tag} ]
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-white uppercase tracking-wider font-semibold">
                    <span className="w-1.5 h-1.5 rounded-none bg-white animate-pulse" />
                    REGISTRATION {event.status}
                  </span>
                </div>

                {/* Header info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn("p-3 shrink-0", monochromeEventCard.iconBg)}>
                    <Icon className={cn("size-6", monochromeEventCard.iconColor)} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-[#737373] mb-0.5">
                      {event.category}
                    </p>
                    <h3 className="font-mono text-2xl font-black uppercase text-white tracking-tight">
                      {event.name}
                    </h3>
                    <p className="font-mono text-xs text-neutral-300 uppercase tracking-wide mt-0.5">
                      // {event.subtitle}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-neutral-400 leading-relaxed flex-1 mb-6 font-sans">
                  {event.description}
                </p>

                {/* Telemetry / Metadata specs grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-y border-[#262626] py-4 mb-6 bg-[#080808] px-3">
                  <div>
                    <div className="flex items-center gap-1 text-[#737373] mb-0.5">
                      <AwardIcon className="size-3 text-white" />
                      <span className="font-mono text-[9px] uppercase tracking-wider">FORMAT</span>
                    </div>
                    <p className="font-mono text-xs font-bold text-white">
                      {event.rounds}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-[#737373] mb-0.5">
                      <UsersIcon className="size-3 text-white" />
                      <span className="font-mono text-[9px] uppercase tracking-wider">TEAM SIZE</span>
                    </div>
                    <p className="font-mono text-xs font-bold text-white">
                      {event.teamSize}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-[#737373] mb-0.5">
                      <CalendarIcon className="size-3 text-white" />
                      <span className="font-mono text-[9px] uppercase tracking-wider">ENTRIES</span>
                    </div>
                    <p className="font-mono text-xs font-bold text-white">
                      {event.entries}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-[#737373] mb-0.5">
                      <MapPinIcon className="size-3 text-white" />
                      <span className="font-mono text-[9px] uppercase tracking-wider">VENUE</span>
                    </div>
                    <p className="font-mono text-xs font-bold text-white truncate" title={event.venue}>
                      {event.venue.split("&")[0].trim()}
                    </p>
                  </div>
                </div>

                {/* Primary Action Button */}
                <div>
                  <Link
                    href={event.href}
                    className={cn(
                      "w-full inline-flex items-center justify-center gap-2 h-11 font-mono text-xs uppercase tracking-wider font-bold border transition-all shadow-sm",
                      monochromeEventCard.buttonBg
                    )}
                  >
                    [ View Event Details ]
                    <ArrowRightIcon className="size-3.5 group-hover:translate-x-1 transition-transform" />
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

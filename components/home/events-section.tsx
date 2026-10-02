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
  capacity: string;
  venue: string;
  status: string;
  accent: "blue" | "sky";
  href: string;
}

const REAL_EVENTS: RealEventItem[] = [
  {
    id: "techforge-2026",
    slug: "techforge-2026",
    name: "TECHFORGE",
    tag: "FLAGSHIP TECHNICAL",
    category: "TECHNICAL // 4 ROUNDS",
    subtitle: "Enterprise Software Challenge",
    description:
      "The flagship 2-day progressive technical challenge of CodeHive 2K26. Teams design, develop, and defend an enterprise-grade software solution across multiple rounds, testing core system architecture, practical engineering, and adaptability under pressure.",
    rounds: "4 Rounds (200 Pts)",
    teamSize: "1–3 Builders",
    capacity: "120 Slots",
    venue: "Main Auditorium & Computing Center",
    status: "OPEN",
    accent: "blue",
    href: "/events/techforge-2026",
  },
  {
    id: "agentvibe-2026",
    slug: "agentvibe-2026",
    name: "AGENTVIBE",
    tag: "AI AGENT CHALLENGE",
    category: "AI // 4 ROUNDS",
    subtitle: "Autonomous AI Engineering",
    description:
      "The premier AI agent engineering challenge of CodeHive 2K26. Teams design, build, and deploy an autonomous productivity agent that understands context, connects data, and executes real-world actions safely.",
    rounds: "4 Rounds (200 Pts)",
    teamSize: "1–3 Builders",
    capacity: "100 Slots",
    venue: "AI Innovation Lab & Tech Center",
    status: "OPEN",
    accent: "sky",
    href: "/events/agentvibe-2026",
  },
];

const accentMap = {
  blue: {
    tagColor: "text-blue-400",
    border: "border-blue-500/60 hover:border-blue-400",
    prizeBg: "bg-blue-500/10 text-blue-300 border-blue-500/40",
    statusColor: "text-emerald-400",
    glow: "shadow-[inset_0_0_40px_rgba(37,99,235,0.06)] hover:shadow-[0_0_35px_rgba(37,99,235,0.2)]",
    cornerColor: "border-blue-400/80",
    iconColor: "text-blue-400",
    iconBg: "bg-blue-500/10 border border-blue-500/30",
    line: "bg-blue-500",
    buttonBg: "bg-blue-600 hover:bg-blue-500 text-white border-blue-400/80",
  },
  sky: {
    tagColor: "text-sky-400",
    border: "border-sky-500/60 hover:border-sky-400",
    prizeBg: "bg-sky-500/10 text-sky-300 border-sky-500/40",
    statusColor: "text-emerald-400",
    glow: "shadow-[inset_0_0_40px_rgba(14,165,233,0.06)] hover:shadow-[0_0_35px_rgba(14,165,233,0.2)]",
    cornerColor: "border-sky-400/80",
    iconColor: "text-sky-400",
    iconBg: "bg-sky-500/10 border border-sky-500/30",
    line: "bg-sky-500",
    buttonBg: "bg-sky-600 hover:bg-sky-500 text-white border-sky-400/80",
  },
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
            name: ev.name || defaultRef.name,
            tag: isTechforge ? "FLAGSHIP TECHNICAL" : "AI AGENT CHALLENGE",
            category: ev.category?.name ? `${ev.category.name.toUpperCase()} // 4 ROUNDS` : defaultRef.category,
            subtitle: defaultRef.subtitle,
            description: ev.description || defaultRef.description,
            rounds: defaultRef.rounds,
            teamSize: `${ev.minTeamSize || 1}–${ev.maxTeamSize || 3} Builders`,
            capacity: `${ev.capacity || 100} Slots`,
            venue: ev.venue || defaultRef.venue,
            status: ev.registrationOpen ? "OPEN" : "CLOSED",
            accent: (idx % 2 === 0 ? "blue" : "sky") as "blue" | "sky",
            href: `/events/${ev.slug}`,
          };
        })
      : REAL_EVENTS;

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 bg-[#030712] border-t border-[#152A54]/60 overflow-hidden"
    >
      {/* Grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(21,42,84,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(21,42,84,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header - No section numbers */}
        <div
          className={cn(
            "mb-16 transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-blue-500" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-blue-500">
              EVENTS
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <div>
              <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
                CHOOSE YOUR{" "}
                <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
                  BATTLEFIELD
                </span>
              </h2>
              <p className="mt-2 text-xs sm:text-sm font-sans text-slate-400 max-w-xl">
                Official technical symposium challenges of CodeHive 2K26. Register your team to compete.
              </p>
            </div>
            <Link
              href="/events"
              className="inline-flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-blue-400 hover:text-white border border-[#152A54] hover:border-blue-500/60 px-4 py-2 transition-all shrink-0"
            >
              [ View Event Registry ] <ArrowRightIcon className="size-3" />
            </Link>
          </div>
        </div>

        {/* Real Event Cards - 2-Column Balanced Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8 max-w-5xl mx-auto">
          {displayEvents.map((event, i) => {
            const a = accentMap[event.accent];
            const Icon = event.slug.includes("agentvibe") ? BrainCircuitIcon : CpuIcon;

            return (
              <div
                key={event.id}
                className={cn(
                  "group relative flex flex-col p-6 sm:p-8 border bg-[#060D1A]/90 backdrop-blur-sm transition-all duration-500",
                  a.border,
                  a.glow,
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Top accent line */}
                <div className={cn("absolute top-0 left-0 right-0 h-[2px]", a.line)} />

                {/* Sharp Corner brackets */}
                <div className={cn("absolute top-2 right-2 w-3.5 h-3.5 border-t border-r", a.cornerColor)} />
                <div className={cn("absolute bottom-2 left-2 w-3.5 h-3.5 border-b border-l", a.cornerColor)} />

                {/* Status & Tag bar */}
                <div className="flex items-center justify-between mb-6">
                  <span className={cn("font-mono text-[11px] uppercase font-bold tracking-widest px-2.5 py-0.5 bg-blue-600/10 border border-blue-500/20", a.tagColor)}>
                    [ {event.tag} ]
                  </span>
                  <span className="inline-flex items-center gap-1.5 font-mono text-[11px] text-emerald-400 uppercase tracking-wider font-semibold">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    REGISTRATION {event.status}
                  </span>
                </div>

                {/* Header info */}
                <div className="flex items-start gap-4 mb-4">
                  <div className={cn("p-3 shrink-0", a.iconBg)}>
                    <Icon className={cn("size-6", a.iconColor)} />
                  </div>
                  <div>
                    <p className="font-mono text-[10px] uppercase tracking-wider text-slate-500 mb-0.5">
                      {event.category}
                    </p>
                    <h3 className="font-mono text-2xl font-black uppercase text-white tracking-tight">
                      {event.name}
                    </h3>
                    <p className="font-mono text-xs text-blue-400 uppercase tracking-wide mt-0.5">
                      // {event.subtitle}
                    </p>
                  </div>
                </div>

                {/* Description */}
                <p className="text-sm text-slate-300 leading-relaxed flex-1 mb-6 font-sans">
                  {event.description}
                </p>

                {/* Telemetry / Metadata specs grid */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 border-y border-[#152A54]/80 py-4 mb-6 bg-black/40 px-3">
                  <div>
                    <div className="flex items-center gap-1 text-slate-500 mb-0.5">
                      <AwardIcon className="size-3 text-blue-400" />
                      <span className="font-mono text-[9px] uppercase tracking-wider">FORMAT</span>
                    </div>
                    <p className="font-mono text-xs font-bold text-white">
                      {event.rounds}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-slate-500 mb-0.5">
                      <UsersIcon className="size-3 text-blue-400" />
                      <span className="font-mono text-[9px] uppercase tracking-wider">TEAM SIZE</span>
                    </div>
                    <p className="font-mono text-xs font-bold text-white">
                      {event.teamSize}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-slate-500 mb-0.5">
                      <CalendarIcon className="size-3 text-blue-400" />
                      <span className="font-mono text-[9px] uppercase tracking-wider">CAPACITY</span>
                    </div>
                    <p className="font-mono text-xs font-bold text-white">
                      {event.capacity}
                    </p>
                  </div>

                  <div>
                    <div className="flex items-center gap-1 text-slate-500 mb-0.5">
                      <MapPinIcon className="size-3 text-blue-400" />
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
                      a.buttonBg
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

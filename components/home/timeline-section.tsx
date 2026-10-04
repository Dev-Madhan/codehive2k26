"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const timeline = [
  {
    phase: "PHASE_01",
    date: "OCTOBER 2026",
    title: "Online Registrations & Team Locking",
    desc: "Team onboarding (1–3 builders) opens online with 100% Free Entry. Select your track: TECH FORGE or AGENT VIBE.",
    status: "active",
  },
  {
    phase: "PHASE_02",
    date: "23 OCT • 8:30 AM",
    title: "Day 1: Check-in & Round 1 (Analyze / Blueprint)",
    desc: "Arrival at Palani Murugan Hall of Fame, Avadi. QR Check-In, briefing, problem analysis, architecture, and Round 1 submission.",
    status: "upcoming",
  },
  {
    phase: "PHASE_03",
    date: "23 OCT • 1:00 PM",
    title: "Day 1: Round 2 (Core Build & Prototype)",
    desc: "Intensive development sprint. Working prototype implementation, role-based workflows, and Day 1 jury evaluation.",
    status: "upcoming",
  },
  {
    phase: "PHASE_04",
    date: "24 OCT • 8:30 AM",
    title: "Day 2: Round 3 (Surprise Challenge / Adapt)",
    desc: "Day 2 kicks off with a surprise technical challenge testing agility, live data integration, and edge-case resilience.",
    status: "upcoming",
  },
  {
    phase: "PHASE_05",
    date: "24 OCT • 1:30 PM",
    title: "Day 2: Round 4 (Defend & Deploy) & Valedictory",
    desc: "Live system viva defense before industry juries. Grand ₹20,000 cash prize distribution and certificates awarded to all.",
    status: "upcoming",
  },
];

export function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.05, once: true });

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 bg-background border-t border-border/60 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(21,42,84,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(21,42,84,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={cn(
            "mb-16 transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-blue-500" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-blue-500">
              TIMELINE
            </span>
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-foreground leading-tight">
            MARK YOUR{" "}
            <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
              CALENDAR
            </span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-px bg-secondary" />

          <div className="space-y-0">
            {timeline.map((item, i) => {
              const isLeft = i % 2 === 0;
              return (
                <div
                  key={item.phase}
                  className={cn(
                    "relative flex items-start gap-6 sm:gap-0 pb-10 transition-all duration-700",
                    "sm:grid sm:grid-cols-2",
                    inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                  )}
                  style={{ transitionDelay: `${i * 100}ms` }}
                >
                  {/* Desktop left side */}
                  <div
                    className={cn(
                      "hidden sm:block pr-12 pt-1",
                      !isLeft && "order-last pl-12 pr-0"
                    )}
                  >
                    {isLeft && (
                      <TimelineCard item={item} />
                    )}
                  </div>

                  {/* Center dot */}
                  <div className="relative flex justify-center sm:absolute sm:left-1/2 sm:-translate-x-1/2 sm:top-1.5 z-10 shrink-0">
                    <div
                      className={cn(
                        "w-10 h-10 flex items-center justify-center border-2 font-mono text-[9px] font-bold uppercase tracking-widest transition-all",
                        item.status === "completed"
                          ? "border-blue-500 bg-blue-500/20 text-blue-300"
                          : item.status === "active"
                          ? "border-emerald-500 bg-emerald-500/20 text-emerald-300 animate-[pulse_2s_infinite]"
                          : "border-border bg-card text-slate-600"
                      )}
                    >
                      {String(i + 1).padStart(2, "0")}
                    </div>
                  </div>

                  {/* Desktop right side */}
                  <div
                    className={cn(
                      "hidden sm:block pl-12 pt-1",
                      !isLeft && "pr-12 pl-0 text-right"
                    )}
                  >
                    {!isLeft && (
                      <TimelineCard item={item} align={!isLeft ? "right" : "left"} />
                    )}
                  </div>

                  {/* Mobile card */}
                  <div className="sm:hidden flex-1 pt-1">
                    <TimelineCard item={item} />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

function TimelineCard({
  item,
  align = "left",
}: {
  item: (typeof timeline)[0];
  align?: "left" | "right";
}) {
  return (
    <div
      className={cn(
        "p-4 border bg-card/80 max-w-sm",
        item.status === "completed"
          ? "border-blue-500/30"
          : item.status === "active"
          ? "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          : "border-border/60",
        align === "right" && "ml-auto"
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-slate-500">
          {item.phase}
        </span>
        <span
          className={cn(
            "font-mono text-[10px] uppercase tracking-widest",
            item.status === "completed"
              ? "text-blue-400"
              : item.status === "active"
              ? "text-emerald-400"
              : "text-slate-600"
          )}
        >
          {item.status === "active" ? "● LIVE" : item.date}
        </span>
      </div>
      <h3 className="font-mono text-sm font-bold uppercase text-foreground mb-1">
        {item.title}
      </h3>
      <p className="text-xs text-muted-foreground leading-relaxed">{item.desc}</p>
    </div>
  );
}

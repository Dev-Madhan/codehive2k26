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
      className="relative py-24 sm:py-32 bg-black border-t border-[#262626] overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={cn(
            "mb-16 transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-white" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#737373]">
              TIMELINE
            </span>
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            MARK YOUR <span className="text-white">CALENDAR</span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-px bg-[#262626]" />

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
                        item.status === "active"
                          ? "border-white bg-white text-black shadow-[0_0_15px_rgba(255,255,255,0.2)]"
                          : "border-[#262626] bg-[#0F0F0F] text-neutral-500"
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
        "p-4 border bg-[#0F0F0F] max-w-sm",
        item.status === "active"
          ? "border-white shadow-[0_0_20px_rgba(255,255,255,0.06)]"
          : "border-[#262626]",
        align === "right" && "ml-auto"
      )}
    >
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className="font-mono text-[10px] uppercase tracking-widest text-[#737373]">
          {item.phase}
        </span>
        <span
          className={cn(
            "font-mono text-[10px] uppercase tracking-widest",
            item.status === "active"
              ? "text-white font-bold"
              : "text-[#737373]"
          )}
        >
          {item.status === "active" ? "● LIVE" : item.date}
        </span>
      </div>
      <h3 className="font-mono text-sm font-bold uppercase text-white mb-1">
        {item.title}
      </h3>
      <p className="text-xs text-neutral-400 leading-relaxed">{item.desc}</p>
    </div>
  );
}

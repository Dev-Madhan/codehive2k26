"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const timeline = [
  {
    phase: "PHASE_01",
    date: "JAN 2026",
    title: "Registrations Open",
    desc: "Team formation begins. Solo or group — assemble your crew and lock in your spot.",
    status: "completed",
  },
  {
    phase: "PHASE_02",
    date: "FEB 2026",
    title: "Problem Statements Released",
    desc: "Detailed challenge briefs for TECHFORGE and AGENTVIBE tracks go live.",
    status: "completed",
  },
  {
    phase: "PHASE_03",
    date: "MAR 2026",
    title: "Qualifier Round",
    desc: "Online screening round to shortlist top 500 participants. Algo Forge qualifier included.",
    status: "active",
  },
  {
    phase: "PHASE_04",
    date: "APR 2026",
    title: "Finale – 24H Hackathon",
    desc: "Onsite 24-hour hackathon at the main venue. 4 evaluation rounds by industry experts.",
    status: "upcoming",
  },
  {
    phase: "PHASE_05",
    date: "APR 2026",
    title: "Demo Day & Awards",
    desc: "Final presentations, live demos, and the grand prize ceremony.",
    status: "upcoming",
  },
];

export function TimelineSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.05, once: true });

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 bg-black border-t border-[#152A54]/60 overflow-hidden"
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
          <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            MARK YOUR{" "}
            <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
              CALENDAR
            </span>
          </h2>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-[19px] sm:left-1/2 sm:-translate-x-px top-0 bottom-0 w-px bg-[#152A54]" />

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
                          : "border-[#152A54] bg-[#060D1A] text-slate-600"
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
        "p-4 border bg-[#060D1A]/80 max-w-sm",
        item.status === "completed"
          ? "border-blue-500/30"
          : item.status === "active"
          ? "border-emerald-500/50 shadow-[0_0_20px_rgba(16,185,129,0.1)]"
          : "border-[#152A54]/60",
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
      <h3 className="font-mono text-sm font-bold uppercase text-white mb-1">
        {item.title}
      </h3>
      <p className="text-xs text-slate-400 leading-relaxed">{item.desc}</p>
    </div>
  );
}

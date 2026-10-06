"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { BrainCircuitIcon, CpuIcon, ShieldCheckIcon } from "lucide-react";

const pillars = [
  {
    icon: CpuIcon,
    tag: "EVENT_01 // TECH FORGE",
    title: "TECH FORGE",
    subtitle: "One Problem. Four Rounds. One Champion.",
    desc: "A 2-day technical challenge where you Analyze, Build, Adapt & Defend. Solve a real-world problem, build your solution, and face surprise technical challenges testing your coding, problem-solving, and innovation skills.",
    accent: "blue",
  },
  {
    icon: BrainCircuitIcon,
    tag: "EVENT_02 // AGENT VIBE",
    title: "AGENT VIBE",
    subtitle: "One Idea. Four Rounds. One AI Champion.",
    desc: "A 2-day AI challenge where you Imagine, Build, Adapt & Deploy. Design and develop intelligent AI agents to solve real-world problems using LLMs, APIs, and modern AI tools.",
    accent: "sky",
  },
  {
    icon: ShieldCheckIcon,
    tag: "INDUSTRY COLLABORATION",
    title: "INDUSTRY & BIC",
    subtitle: "Real-World Evaluation",
    desc: "Organized by the Department of CSBS, Vel Tech Multi Tech, in association with Sri Vensy Technologies Pvt Ltd & Business Intelligence Club with four rigorous evaluation rounds.",
    accent: "indigo",
  },
];

const monochromeCardStyle = {
  border: "hover:border-[#404040]",
  iconBg: "bg-[#161616] border border-[#262626]",
  iconColor: "text-white",
  tagColor: "text-[#737373]",
  glow: "hover:shadow-[0_0_24px_rgba(255,255,255,0.05)]",
  corner: "border-[#404040] group-hover:border-white transition-colors",
};

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.1, once: true });

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 bg-black border-t border-[#262626] overflow-hidden"
    >
      {/* Subtle grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Top accent blur */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-b from-white/5 to-transparent blur-[80px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className={cn(
            "mb-16 transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-white" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#737373]">
              ABOUT CODEHIVE 2K26 2.0
            </span>
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            IDEAS × CODE × <span className="text-white">IMPACT</span>
          </h2>
          <p className="mt-4 max-w-2xl text-neutral-400 text-base leading-relaxed">
            CodeHive 2K26 2.0 is a flagship National Level Hackathon organized on 23 &amp; 24 October 2026 by the Department of Computer Science and Business Systems, Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College, in association with Sri Vensy Technologies Pvt Ltd &amp; Business Intelligence Club.
          </p>
        </div>

        {/* Pillar cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {pillars.map((pillar, i) => {
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={cn(
                  "relative group p-6 border border-[#262626] bg-[#0F0F0F]/80 backdrop-blur-sm transition-all duration-500",
                  monochromeCardStyle.border,
                  monochromeCardStyle.glow,
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Corner accent */}
                <div className={cn("absolute top-0 right-0 w-3 h-3 border-t border-r", monochromeCardStyle.corner)} />
                <div className={cn("absolute bottom-0 left-0 w-3 h-3 border-b border-l", monochromeCardStyle.corner)} />

                {/* Icon */}
                <div className={cn("inline-flex p-2.5 mb-4", monochromeCardStyle.iconBg)}>
                  <Icon className={cn("size-5", monochromeCardStyle.iconColor)} />
                </div>

                {/* Tag */}
                <p className={cn("font-mono text-[10px] uppercase tracking-widest mb-2", monochromeCardStyle.tagColor)}>
                  {pillar.tag}
                </p>

                <h3 className="font-mono text-lg font-black uppercase text-white mb-1 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="font-mono text-xs text-neutral-300 mb-3 uppercase tracking-wide">
                  // {pillar.subtitle}
                </p>
                <p className="text-sm text-neutral-400 leading-relaxed font-sans">
                  {pillar.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats row */}
        <div
          className={cn(
            "mt-12 grid grid-cols-2 sm:grid-cols-4 gap-4 transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "400ms" }}
        >
          {[
            { val: "2 DAYS", label: "23 & 24 Oct 2026" },
            { val: "₹20,000", label: "Total Prize Pool" },
            { val: "100% FREE", label: "Zero Entry Fee" },
            { val: "ALL", label: "Certificates Awarded" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 border border-[#262626] bg-[#080808] text-center"
            >
              <p className="font-mono text-2xl sm:text-3xl font-black text-white">
                {stat.val}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-[#737373] mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

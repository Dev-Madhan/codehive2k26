"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { BrainCircuitIcon, CpuIcon, ShieldCheckIcon } from "lucide-react";

const pillars = [
  {
    icon: CpuIcon,
    tag: "FLAGSHIP_EVENT_01",
    title: "TECHFORGE",
    subtitle: "Enterprise Software Crucible",
    desc: "The flagship progressive technical challenge of CodeHive 2K26. Teams design, develop, and defend an enterprise-grade software architecture across four rounds.",
    accent: "blue",
  },
  {
    icon: BrainCircuitIcon,
    tag: "FLAGSHIP_EVENT_02",
    title: "AGENTVIBE",
    subtitle: "Autonomous AI Engineering",
    desc: "The premier AI agent engineering challenge. Architect and deploy intelligent autonomous agents that process context, call tools, and execute workflows safely.",
    accent: "sky",
  },
  {
    icon: ShieldCheckIcon,
    tag: "EVALUATION_PROTOCOL",
    title: "TECHNICAL VIVA",
    subtitle: "Architectural Defense",
    desc: "Zero tolerance for shallow demos. Qualifying teams face live stress-testing, codebase scrutiny, and technical defense before industry engineering juries.",
    accent: "indigo",
  },
];

const accentMap = {
  blue: {
    border: "hover:border-blue-500/60",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    tagColor: "text-blue-500",
    glow: "hover:shadow-[0_0_24px_rgba(37,99,235,0.2)]",
    corner: "border-blue-400/80",
  },
  sky: {
    border: "hover:border-sky-500/60",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-400",
    tagColor: "text-sky-500",
    glow: "hover:shadow-[0_0_24px_rgba(14,165,233,0.2)]",
    corner: "border-sky-400/80",
  },
  indigo: {
    border: "hover:border-indigo-500/60",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    tagColor: "text-indigo-400",
    glow: "hover:shadow-[0_0_24px_rgba(99,102,241,0.2)]",
    corner: "border-indigo-400/80",
  },
};

export function AboutSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.1, once: true });

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 bg-black border-t border-[#152A54]/60 overflow-hidden"
    >
      {/* Subtle grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(21,42,84,0.06)_1px,transparent_1px),linear-gradient(90deg,rgba(21,42,84,0.06)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Top accent blur */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-b from-blue-900/20 to-transparent blur-[80px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section header */}
        <div
          className={cn(
            "mb-16 transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-blue-500" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-blue-500">
              WHAT IS CODEHIVE
            </span>
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            FORGE YOUR{" "}
            <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
              LEGACY
            </span>
          </h2>
          <p className="mt-4 max-w-2xl text-slate-400 text-base leading-relaxed">
            CodeHive 2K26 is South India&apos;s premier 24-hour national engineering crucible — where 500+ elite builders compete, collaborate, and ship products that matter.
          </p>
        </div>

        {/* Pillar cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {pillars.map((pillar, i) => {
            const a = accentMap[pillar.accent as keyof typeof accentMap];
            const Icon = pillar.icon;
            return (
              <div
                key={pillar.title}
                className={cn(
                  "relative group p-6 border border-[#152A54]/80 bg-[#060D1A]/60 backdrop-blur-sm transition-all duration-500",
                  a.border,
                  a.glow,
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Corner accent */}
                <div className={cn("absolute top-0 right-0 w-3 h-3 border-t border-r", a.corner)} />
                <div className={cn("absolute bottom-0 left-0 w-3 h-3 border-b border-l", a.corner)} />

                {/* Icon */}
                <div className={cn("inline-flex p-2.5 mb-4", a.iconBg)}>
                  <Icon className={cn("size-5", a.iconColor)} />
                </div>

                {/* Tag */}
                <p className={cn("font-mono text-[10px] uppercase tracking-widest mb-2", a.tagColor)}>
                  {pillar.tag}
                </p>

                <h3 className="font-mono text-lg font-black uppercase text-white mb-1 tracking-tight">
                  {pillar.title}
                </h3>
                <p className="font-mono text-xs text-slate-400 mb-3 uppercase tracking-wide">
                  // {pillar.subtitle}
                </p>
                <p className="text-sm text-slate-400 leading-relaxed">
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
            { val: "500+", label: "Elite Builders" },
            { val: "24H", label: "Non-Stop Hacking" },
            { val: "₹50K+", label: "Prize Pool" },
            { val: "4", label: "Evaluation Rounds" },
          ].map((stat) => (
            <div
              key={stat.label}
              className="p-4 border border-[#152A54]/60 bg-[#030712]/80 text-center"
            >
              <p className="font-mono text-2xl sm:text-3xl font-black text-white">
                {stat.val}
              </p>
              <p className="font-mono text-[11px] uppercase tracking-wider text-slate-500 mt-1">
                {stat.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

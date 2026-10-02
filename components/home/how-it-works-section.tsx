"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import Link from "next/link";
import {
  UserPlusIcon,
  CodeIcon,
  UploadIcon,
  TrophyIcon,
  ArrowRightIcon,
} from "lucide-react";

const steps = [
  {
    step: "01",
    icon: UserPlusIcon,
    title: "Register",
    subtitle: "Form Your Team",
    desc: "Create an account, assemble a team of 1–3 builders, and lock in your event challenge — TECHFORGE or AGENTVIBE.",
    cta: { label: "Register Now", href: "/auth" },
    tag: "STEP_01 // ONBOARDING",
    accent: "blue",
  },
  {
    step: "02",
    icon: CodeIcon,
    title: "Build",
    subtitle: "24-Hour Sprint",
    desc: "Receive your problem statement, access API credits, and spend 24 continuous hours designing, coding, and shipping your solution.",
    cta: null,
    tag: "STEP_02 // EXECUTION",
    accent: "sky",
  },
  {
    step: "03",
    icon: UploadIcon,
    title: "Submit",
    subtitle: "Deploy & Demo",
    desc: "Submit your project before the deadline. Present a live demo to a panel of industry judges across 4 rigorous evaluation rounds.",
    cta: null,
    tag: "STEP_03 // EVALUATION",
    accent: "indigo",
  },
  {
    step: "04",
    icon: TrophyIcon,
    title: "Win",
    subtitle: "Claim Your Prize",
    desc: "Top builders claim cash prizes, internship referrals, exclusive swag, and a permanent spot on the CodeHive Hall of Fame.",
    cta: { label: "View Prizes", href: "#prizes" },
    tag: "STEP_04 // REWARD",
    accent: "emerald",
  },
];

const accentMap = {
  blue: {
    stepColor: "text-blue-500",
    iconBg: "bg-blue-500/10",
    iconColor: "text-blue-400",
    border: "border-blue-500/40",
    glow: "hover:shadow-[0_0_30px_rgba(37,99,235,0.18)]",
    corner: "border-blue-400/60",
    lineDot: "bg-blue-500",
    tagColor: "text-blue-500",
    topLine: "bg-blue-500",
    connectorColor: "bg-blue-500/30",
  },
  sky: {
    stepColor: "text-sky-500",
    iconBg: "bg-sky-500/10",
    iconColor: "text-sky-400",
    border: "border-sky-500/40",
    glow: "hover:shadow-[0_0_30px_rgba(14,165,233,0.18)]",
    corner: "border-sky-400/60",
    lineDot: "bg-sky-500",
    tagColor: "text-sky-500",
    topLine: "bg-sky-500",
    connectorColor: "bg-sky-500/30",
  },
  indigo: {
    stepColor: "text-indigo-400",
    iconBg: "bg-indigo-500/10",
    iconColor: "text-indigo-400",
    border: "border-indigo-500/40",
    glow: "hover:shadow-[0_0_30px_rgba(99,102,241,0.18)]",
    corner: "border-indigo-400/60",
    lineDot: "bg-indigo-500",
    tagColor: "text-indigo-400",
    topLine: "bg-indigo-500",
    connectorColor: "bg-indigo-500/30",
  },
  emerald: {
    stepColor: "text-emerald-500",
    iconBg: "bg-emerald-500/10",
    iconColor: "text-emerald-400",
    border: "border-emerald-500/40",
    glow: "hover:shadow-[0_0_30px_rgba(16,185,129,0.18)]",
    corner: "border-emerald-400/60",
    lineDot: "bg-emerald-500",
    tagColor: "text-emerald-500",
    topLine: "bg-emerald-500",
    connectorColor: "bg-emerald-500/30",
  },
};

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.05, once: true });

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 bg-black border-t border-[#152A54]/60 overflow-hidden"
    >
      {/* Cyber grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(21,42,84,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(21,42,84,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-blue-900/12 to-transparent blur-[100px]" />

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
              HOW IT WORKS
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              FOUR STEPS TO{" "}
              <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-emerald-400 bg-clip-text text-transparent">
                VICTORY
              </span>
            </h2>
            <p className="text-sm text-slate-500 max-w-xs font-mono uppercase tracking-wide">
              // register → build → submit → win
            </p>
          </div>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 relative">

          {/* Horizontal connector line (desktop only) */}
          <div className="pointer-events-none absolute top-[52px] left-[calc(25%+8px)] right-[calc(25%+8px)] hidden xl:block h-px bg-gradient-to-r from-blue-500/40 via-sky-500/30 via-indigo-500/30 to-emerald-500/40" />

          {steps.map((step, i) => {
            const a = accentMap[step.accent as keyof typeof accentMap];
            const Icon = step.icon;

            return (
              <div
                key={step.step}
                className={cn(
                  "relative flex flex-col border bg-[#060D1A]/70 backdrop-blur-sm transition-all duration-500 group",
                  a.border,
                  a.glow,
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Top accent line */}
                <div className={cn("h-[2px] w-full", a.topLine)} />

                {/* Corner brackets */}
                <div className={cn("absolute top-2 right-2 w-3 h-3 border-t border-r", a.corner)} />
                <div className={cn("absolute bottom-2 left-2 w-3 h-3 border-b border-l", a.corner)} />

                <div className="p-6 flex flex-col flex-1 gap-5">

                  {/* Step number + icon row */}
                  <div className="flex items-start justify-between">
                    {/* Large step number watermark */}
                    <span
                      className={cn(
                        "font-mono text-5xl font-black leading-none select-none",
                        a.stepColor,
                        "opacity-20"
                      )}
                    >
                      {step.step}
                    </span>

                    {/* Icon badge */}
                    <div
                      className={cn(
                        "p-3 border transition-all duration-300",
                        a.iconBg,
                        a.border,
                        "group-hover:scale-110"
                      )}
                    >
                      <Icon className={cn("size-5", a.iconColor)} />
                    </div>
                  </div>

                  {/* Tag */}
                  <p className={cn("font-mono text-[10px] uppercase tracking-widest", a.tagColor)}>
                    {step.tag}
                  </p>

                  {/* Title & subtitle */}
                  <div>
                    <h3 className="font-mono text-2xl font-black uppercase text-white tracking-tight leading-none mb-1">
                      {step.title}
                    </h3>
                    <p className="font-mono text-xs text-slate-500 uppercase tracking-wide">
                      // {step.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-slate-400 leading-relaxed flex-1">
                    {step.desc}
                  </p>

                  {/* CTA (optional) */}
                  {step.cta && (
                    <Link
                      href={step.cta.href}
                      className={cn(
                        "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider transition-all mt-auto",
                        a.iconColor,
                        "hover:opacity-70"
                      )}
                    >
                      {step.cta.label}
                      <ArrowRightIcon className="size-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>

                {/* Arrow connector (between cards on desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden xl:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-8 h-8 bg-black border border-[#152A54]">
                    <ArrowRightIcon className="size-3 text-slate-600" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom callout strip */}
        <div
          className={cn(
            "mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#152A54]/60 bg-[#060D1A]/50 px-6 py-4 transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "520ms" }}
        >
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-emerald-400 animate-pulse" />
            <p className="font-mono text-xs uppercase tracking-wider text-slate-400">
              Registrations are live — Slots fill up fast
            </p>
          </div>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-bold bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/80 transition-all shadow-[0_0_16px_rgba(37,99,235,0.3)] hover:shadow-[0_0_24px_rgba(59,130,246,0.5)] shrink-0"
          >
            Secure Your Spot <ArrowRightIcon className="size-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}

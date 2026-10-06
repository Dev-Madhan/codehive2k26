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
    subtitle: "100% Free Entry",
    desc: "Create an account, assemble a team of 1–3 builders, and lock in your challenge — TECH FORGE or AGENT VIBE.",
    cta: { label: "Register Free", href: "/events" },
    tag: "STEP_01 // ONBOARDING",
    accent: "blue",
  },
  {
    step: "02",
    icon: CodeIcon,
    title: "Build",
    subtitle: "2-Day Challenge",
    desc: "Hack on 23 & 24 October 2026 (8:30 AM – 3:30 PM). Analyze the problem, build your solution, and tackle surprise challenges.",
    cta: null,
    tag: "STEP_02 // EXECUTION",
    accent: "sky",
  },
  {
    step: "03",
    icon: UploadIcon,
    title: "Defend",
    subtitle: "Live Jury Viva",
    desc: "Demonstrate your working prototype, explain your technical architecture, and defend your codebase across 4 progressive rounds.",
    cta: null,
    tag: "STEP_03 // EVALUATION",
    accent: "indigo",
  },
  {
    step: "04",
    icon: TrophyIcon,
    title: "Win",
    subtitle: "Claim Your Award",
    desc: "Top builders claim their share of the ₹20,000 prize pool, winner trophies, and certificates awarded to all participants.",
    cta: { label: "View Prizes", href: "#prizes" },
    tag: "STEP_04 // REWARD",
    accent: "emerald",
  },
];

const monochromeStepStyle = {
  stepColor: "text-neutral-600",
  iconBg: "bg-[#161616]",
  iconColor: "text-white",
  border: "border-[#262626] hover:border-[#404040]",
  glow: "hover:shadow-[0_0_30px_rgba(255,255,255,0.05)]",
  corner: "border-[#404040] group-hover:border-white transition-colors",
  lineDot: "bg-white",
  tagColor: "text-[#737373]",
  topLine: "bg-white",
  connectorColor: "bg-[#262626]",
};

export function HowItWorksSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.05, once: true });

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 bg-black border-t border-[#262626] overflow-hidden"
    >
      {/* Cyber grid */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[300px] bg-gradient-to-b from-white/5 to-transparent blur-[100px]" />

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
              HOW IT WORKS
            </span>
          </div>
          <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
            <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              FOUR STEPS TO{" "}
              <span className="text-white">
                VICTORY
              </span>
            </h2>
            <p className="text-sm text-[#737373] max-w-xs font-mono uppercase tracking-wide">
              // register → build → submit → win
            </p>
          </div>
        </div>

        {/* Steps grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-4 sm:gap-5 relative">

          {/* Horizontal connector line (desktop only) */}
          <div className="pointer-events-none absolute top-[52px] left-[calc(25%+8px)] right-[calc(25%+8px)] hidden xl:block h-px bg-[#262626]" />

          {steps.map((step, i) => {
            const Icon = step.icon;

            return (
              <div
                key={step.step}
                className={cn(
                  "relative flex flex-col border bg-[#0F0F0F] backdrop-blur-sm transition-all duration-500 group",
                  monochromeStepStyle.border,
                  monochromeStepStyle.glow,
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
                )}
                style={{ transitionDelay: `${i * 120}ms` }}
              >
                {/* Top accent line */}
                <div className={cn("h-[2px] w-full", monochromeStepStyle.topLine)} />

                {/* Corner brackets */}
                <div className={cn("absolute top-2 right-2 w-3 h-3 border-t border-r", monochromeStepStyle.corner)} />
                <div className={cn("absolute bottom-2 left-2 w-3 h-3 border-b border-l", monochromeStepStyle.corner)} />

                <div className="p-6 flex flex-col flex-1 gap-5">

                  {/* Step number + icon row */}
                  <div className="flex items-start justify-between">
                    {/* Large step number watermark */}
                    <span
                      className={cn(
                        "font-mono text-5xl font-black leading-none select-none",
                        monochromeStepStyle.stepColor,
                        "opacity-30"
                      )}
                    >
                      {step.step}
                    </span>

                    {/* Icon badge */}
                    <div
                      className={cn(
                        "p-3 border border-[#262626] transition-all duration-300",
                        monochromeStepStyle.iconBg,
                        "group-hover:scale-110"
                      )}
                    >
                      <Icon className={cn("size-5", monochromeStepStyle.iconColor)} />
                    </div>
                  </div>

                  {/* Tag */}
                  <p className={cn("font-mono text-[10px] uppercase tracking-widest", monochromeStepStyle.tagColor)}>
                    {step.tag}
                  </p>

                  {/* Title & subtitle */}
                  <div>
                    <h3 className="font-mono text-2xl font-black uppercase text-white tracking-tight leading-none mb-1">
                      {step.title}
                    </h3>
                    <p className="font-mono text-xs text-[#737373] uppercase tracking-wide">
                      // {step.subtitle}
                    </p>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-neutral-400 leading-relaxed flex-1">
                    {step.desc}
                  </p>

                  {/* CTA (optional) */}
                  {step.cta && (
                    <Link
                      href={step.cta.href}
                      className={cn(
                        "inline-flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider transition-all mt-auto text-white hover:text-neutral-300"
                      )}
                    >
                      {step.cta.label}
                      <ArrowRightIcon className="size-3 group-hover:translate-x-1 transition-transform" />
                    </Link>
                  )}
                </div>

                {/* Arrow connector (between cards on desktop) */}
                {i < steps.length - 1 && (
                  <div className="hidden xl:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 items-center justify-center w-8 h-8 bg-[#0F0F0F] border border-[#262626]">
                    <ArrowRightIcon className="size-3 text-neutral-400" />
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Bottom callout strip */}
        <div
          className={cn(
            "mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#262626] bg-[#0F0F0F] px-6 py-4 transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "520ms" }}
        >
          <div className="flex items-center gap-3">
            <span className="w-1.5 h-1.5 bg-white animate-pulse" />
            <p className="font-mono text-xs uppercase tracking-wider text-neutral-400">
              Registrations are live — Open to all participants
            </p>
          </div>
          <Link
            href="/auth"
            className="inline-flex items-center gap-2 px-5 py-2.5 font-mono text-xs uppercase tracking-wider font-bold bg-white hover:bg-[#E5E5E5] text-black border border-white transition-all shadow-[0_0_16px_rgba(255,255,255,0.1)] shrink-0"
          >
            Register Now <ArrowRightIcon className="size-3" />
          </Link>
        </div>
      </div>
    </section>
  );
}

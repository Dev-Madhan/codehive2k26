"use client";

import { useRef } from "react";
import Link from "next/link";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import {
  UserPlusIcon,
  CodeIcon,
  ShieldCheckIcon,
  TrophyIcon,
  ArrowRightIcon,
} from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface StepItem {
  number: string;
  title: string;
  desc: string;
  meta: string;
  icon: any;
}

const steps: StepItem[] = [
  {
    number: "01",
    title: "REGISTER",
    desc: "Assemble a squad of 3 builders and choose your track: Tech Forge or Agent Vibe. 100% free entry.",
    meta: "TEAM OF 3 • FREE ENTRY",
    icon: UserPlusIcon,
  },
  {
    number: "02",
    title: "BUILD",
    desc: "Hack on campus on 23 & 24 October. Solve real-world problem statements and tackle surprise constraints.",
    meta: "23 & 24 OCT • ON-CAMPUS",
    icon: CodeIcon,
  },
  {
    number: "03",
    title: "DEFEND",
    desc: "Demonstrate your working prototype, explain your architecture, and defend your codebase across 4 rounds.",
    meta: "4 ROUNDS • LIVE JURY",
    icon: ShieldCheckIcon,
  },
  {
    number: "04",
    title: "WIN",
    desc: "Top teams claim their share of the ₹20,000 prize pool, championship trophies, and certificates.",
    meta: "₹20,000 POOL • TROPHIES",
    icon: TrophyIcon,
  },
];

export function HowItWorksSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            ".gsap-hiw-rule",
            ".gsap-hiw-tag",
            ".gsap-hiw-title",
            ".gsap-hiw-desc",
            ".gsap-hiw-badge",
            ".gsap-hiw-card",
            ".gsap-hiw-callout",
          ],
          { opacity: 1, y: 0, scaleX: 1 }
        );
        return;
      }

      gsap.set(".gsap-hiw-rule", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(
        [
          ".gsap-hiw-tag",
          ".gsap-hiw-title",
          ".gsap-hiw-desc",
          ".gsap-hiw-badge",
        ],
        { opacity: 0, y: 16 }
      );
      gsap.set(".gsap-hiw-card", { opacity: 0, y: 18 });
      gsap.set(".gsap-hiw-callout", { opacity: 0, y: 14 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });

      tl.to(".gsap-hiw-rule", { scaleX: 1, duration: 0.5, ease: "power3.out" })
        .to(
          ".gsap-hiw-tag",
          { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
          "-=0.3"
        )
        .to(
          ".gsap-hiw-title",
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
          "-=0.2"
        )
        .to(
          ".gsap-hiw-desc",
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
          "-=0.3"
        )
        .to(
          ".gsap-hiw-badge",
          { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
          "-=0.3"
        )
        .to(
          ".gsap-hiw-card",
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.25"
        )
        .to(
          ".gsap-hiw-callout",
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
          "-=0.2"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="how-it-works"
      className="relative py-20 sm:py-28 bg-black border-t border-[#262626] overflow-hidden"
    >
      {/* Subtle grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Top ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-gradient-to-b from-white/5 to-transparent blur-[90px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header - Perfectly aligned to max-w-7xl with outer container */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="gsap-hiw-rule h-px w-8 bg-white" />
              <span className="gsap-hiw-tag font-mono text-[11px] uppercase tracking-widest text-[#737373]">
                // HOW IT WORKS
              </span>
            </div>

            <h2 className="gsap-hiw-title font-mono text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              FOUR STEPS TO VICTORY
              <span className="inline-block animate-pulse text-white">_</span>
            </h2>

            <p className="gsap-hiw-desc text-xs sm:text-sm font-sans text-neutral-400 leading-relaxed">
              A simple roadmap from team registration to the grand finale.
            </p>
          </div>

          {/* Quick Telemetry Summary Pill */}
          <div className="gsap-hiw-badge inline-flex items-center gap-2 border border-[#222222] bg-[#0A0A0A] px-4 py-2 font-mono text-xs text-neutral-400 shrink-0 self-start sm:self-end">
            <span className="text-[#737373]">// PIPELINE:</span>
            <span className="font-bold text-white tracking-wider">
              4 PHASES // 2 DAYS
            </span>
          </div>
        </div>

        {/* 4-Step Minimalist Grid - Optimal Spacing & Equal Height */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 items-stretch">
          {steps.map((step) => {
            const Icon = step.icon;

            return (
              <div
                key={step.number}
                className={cn(
                  "gsap-hiw-card group relative flex flex-col justify-between p-6 sm:p-7 border border-[#222222] bg-[#0A0A0A] backdrop-blur-sm h-full",
                  "hover:border-[#383838] hover:bg-[#0D0D0D] active:border-white transition-colors duration-150"
                )}
              >
                {/* Corner accent brackets */}
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#333333] group-hover:border-white transition-colors duration-200" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#333333] group-hover:border-white transition-colors duration-200" />

                <div className="flex flex-col flex-1">
                  {/* Step Index & Icon Header */}
                  <div className="flex items-center justify-between pb-4 border-b border-[#1c1c1c]">
                    <span className="font-mono text-xs font-bold text-neutral-300 tracking-wider">
                      [ {step.number} ]
                    </span>
                    <div className="p-2 bg-[#121212] border border-[#222222] group-hover:border-[#383838] transition-colors">
                      <Icon className="step-icon size-4 text-neutral-300 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Title */}
                  <h3 className="font-mono text-xl sm:text-2xl font-black uppercase text-white tracking-tight group-hover:text-neutral-100 transition-colors mt-5 mb-2 leading-none">
                    {step.title}
                  </h3>

                  {/* Description */}
                  <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans flex-1">
                    {step.desc}
                  </p>

                  {/* Bottom Telemetry Tag */}
                  <div className="pt-6 mt-auto">
                    <div className="pt-3.5 border-t border-[#1c1c1c] font-mono text-[10px] sm:text-[11px] text-[#737373] tracking-widest uppercase">
                      // {step.meta}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Bottom Minimal Terminal Strip */}
        <div className="gsap-hiw-callout flex flex-col sm:flex-row items-center justify-between gap-4 border border-[#222222] bg-[#0A0A0A] p-5">
          <div className="flex items-center gap-2.5 font-mono text-xs uppercase tracking-wider text-neutral-300">
            <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
            <span>REGISTRATIONS ARE 100% FREE • OPEN TO ALL STUDENTS</span>
          </div>

          <Link
            href="/events"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-4 py-2 font-mono text-xs uppercase tracking-wider font-bold bg-white hover:bg-neutral-200 text-black border border-white transition-colors shrink-0"
          >
            <span>[ View Tracks &amp; Register ]</span>
            <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}



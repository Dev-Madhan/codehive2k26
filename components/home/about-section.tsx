"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { BrainCircuitIcon, CpuIcon, ShieldCheckIcon } from "lucide-react";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

const highlights = [
  {
    tag: "EVENT 01",
    title: "TECH FORGE",
    desc: "A 2-day coding challenge where teams solve real-world problems across 4 rounds.",
    icon: CpuIcon,
  },
  {
    tag: "EVENT 02",
    title: "AGENT VIBE",
    desc: "An AI hackathon to design and build intelligent AI agents and applications.",
    icon: BrainCircuitIcon,
  },
  {
    tag: "EVALUATION",
    title: "INDUSTRY PARTNERS",
    desc: "Mentored and evaluated by engineers from Sri Vensy Technologies & BIC.",
    icon: ShieldCheckIcon,
  },
];

export function AboutSection() {
  const containerRef = useRef<HTMLDivElement>(null);
  const daysRef = useRef<HTMLSpanElement>(null);
  const prizeRef = useRef<HTMLSpanElement>(null);
  const entryRef = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            ".gsap-rule",
            ".gsap-tag",
            ".gsap-title",
            ".gsap-desc",
            ".gsap-card",
            ".gsap-stats",
          ],
          { opacity: 1, y: 0, scaleX: 1 }
        );
        return;
      }

      // Initial clean state
      gsap.set(".gsap-rule", { scaleX: 0, transformOrigin: "left center" });
      gsap.set([".gsap-tag", ".gsap-title", ".gsap-desc"], { opacity: 0, y: 16 });
      gsap.set(".gsap-card", { opacity: 0, y: 18 });
      gsap.set(".gsap-stats", { opacity: 0, y: 12 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });

      // 1. Rule & Tag
      tl.to(".gsap-rule", { scaleX: 1, duration: 0.5, ease: "power3.out" })
        .to(".gsap-tag", { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" }, "-=0.3")
        // 2. Headline & Description
        .to(".gsap-title", { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, "-=0.2")
        .to(".gsap-desc", { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, "-=0.3")
        // 3. Staggered Highlights Entrance
        .to(
          ".gsap-card",
          {
            opacity: 1,
            y: 0,
            duration: 0.45,
            stagger: 0.08,
            ease: "power3.out",
          },
          "-=0.25"
        )
        // 4. Stats Status Bar
        .to(".gsap-stats", { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" }, "-=0.2");

      // Live number counters
      const daysCounter = { val: 0 };
      tl.to(
        daysCounter,
        {
          val: 2,
          duration: 0.6,
          ease: "power2.out",
          onUpdate: () => {
            if (daysRef.current) {
              daysRef.current.textContent = `${Math.round(daysCounter.val)} DAYS // 23 & 24 OCT`;
            }
          },
        },
        "-=0.4"
      );

      const prizeCounter = { val: 0 };
      tl.to(
        prizeCounter,
        {
          val: 20000,
          duration: 0.8,
          ease: "power2.out",
          onUpdate: () => {
            if (prizeRef.current) {
              prizeRef.current.textContent = `₹${Math.round(prizeCounter.val).toLocaleString("en-IN")}`;
            }
          },
        },
        "-=0.55"
      );

      const entryCounter = { val: 0 };
      tl.to(
        entryCounter,
        {
          val: 100,
          duration: 0.6,
          ease: "power2.out",
          onUpdate: () => {
            if (entryRef.current) {
              entryRef.current.textContent = `${Math.round(entryCounter.val)}% FREE`;
            }
          },
        },
        "-=0.5"
      );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="about"
      className="relative py-20 sm:py-28 bg-black border-t border-[#262626] overflow-hidden"
    >
      {/* Subtle grid overlay */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Top accent blur */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] bg-gradient-to-b from-white/5 to-transparent blur-[80px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-10 sm:space-y-12">
        {/* Section Header */}
        <div className="max-w-3xl space-y-4">
          <div className="flex items-center gap-3">
            <div className="gsap-rule h-px w-8 bg-white" />
            <span className="gsap-tag font-mono text-[11px] uppercase tracking-widest text-[#737373]">
              // CODEHIVE 2K26
            </span>
          </div>

          <h2 className="gsap-title font-mono text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            ABOUT THE EVENT<span className="inline-block animate-pulse text-white">_</span>
          </h2>

          <p className="gsap-desc text-neutral-400 text-sm sm:text-base leading-relaxed font-sans">
            CodeHive 2K26 is a 2-day national-level hackathon organized by the Department of CSBS at Vel Tech Multi Tech. Solve real problems, build working solutions, and compete for ₹20,000 in prizes.
          </p>
        </div>

        {/* Highlight Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
          {highlights.map((item) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className={cn(
                  "gsap-card relative group p-6 border border-[#262626] bg-[#0A0A0A] backdrop-blur-sm",
                  "hover:border-[#404040] hover:bg-[#0D0D0D] active:border-white transition-colors duration-150"
                )}
              >
                {/* Corner accent brackets */}
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#333333] group-hover:border-white transition-colors duration-200" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#333333] group-hover:border-white transition-colors duration-200" />

                {/* Card Top */}
                <div className="flex items-center justify-between mb-6">
                  <div className="inline-flex p-2 bg-[#141414] border border-[#262626] group-hover:border-[#383838] transition-colors">
                    <Icon className="track-icon size-4 text-white" />
                  </div>
                  <span className="font-mono text-[10px] uppercase tracking-wider text-[#737373]">
                    {item.tag}
                  </span>
                </div>

                <h3 className="font-mono text-lg font-black uppercase text-white tracking-tight mb-2 group-hover:text-neutral-100 transition-colors">
                  {item.title}
                </h3>

                <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans">
                  {item.desc}
                </p>
              </div>
            );
          })}
        </div>

        {/* Stats Row */}
        <div className="gsap-stats flex flex-col sm:flex-row items-stretch border border-[#262626] bg-[#080808]">
          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-5 hover:bg-[#0c0c0c] transition-colors">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#737373] mb-1">
              // DATE
            </span>
            <span
              ref={daysRef}
              className="font-mono text-xs sm:text-sm font-bold text-white tracking-wide"
            >
              2 DAYS // 23 &amp; 24 OCT
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-5 border-t sm:border-t-0 sm:border-l border-[#262626] hover:bg-[#0c0c0c] transition-colors">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#737373] mb-1">
              // PRIZE POOL
            </span>
            <span
              ref={prizeRef}
              className="font-mono text-xs sm:text-sm font-bold text-white tracking-wide"
            >
              ₹20,000
            </span>
          </div>

          <div className="flex-1 flex flex-col items-center justify-center p-4 sm:p-5 border-t sm:border-t-0 sm:border-l border-[#262626] hover:bg-[#0c0c0c] transition-colors">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#737373] mb-1">
              // ENTRY FEE
            </span>
            <span
              ref={entryRef}
              className="font-mono text-xs sm:text-sm font-bold text-white tracking-wide"
            >
              100% FREE
            </span>
          </div>
        </div>
      </div>
    </section>
  );
}

"use client";

import { useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useGSAP } from "@gsap/react";
import { cn } from "@/lib/utils";
import { TrophyIcon, MedalIcon, AwardIcon, GiftIcon, UsersIcon } from "lucide-react";
import { NumberFlowCounter } from "@/components/ui/skiper-ui/skiper37";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface PrizeItem {
  rank: string;
  title: string;
  amount: number;
  subtitle: string;
  deliverables: string;
  icon: typeof TrophyIcon;
}

const prizes: PrizeItem[] = [
  {
    rank: "01",
    title: "FIRST PLACE",
    amount: 5000,
    subtitle: "PER TRACK • ₹10,000 COMBINED",
    deliverables: "Cash Award • Winner Trophy • Certificate • Hall of Fame",
    icon: TrophyIcon,
  },
  {
    rank: "02",
    title: "SECOND PLACE",
    amount: 3000,
    subtitle: "PER TRACK • ₹6,000 COMBINED",
    deliverables: "Cash Award • Runner-Up Trophy • Certificate • Mentorship",
    icon: MedalIcon,
  },
  {
    rank: "03",
    title: "THIRD PLACE",
    amount: 2000,
    subtitle: "PER TRACK • ₹4,000 COMBINED",
    deliverables: "Cash Award • 2nd Runner-Up Trophy • Certificate • Swag Pack",
    icon: AwardIcon,
  },
];

const perks = [
  {
    icon: GiftIcon,
    tag: "// ADMISSION",
    title: "100% FREE ENTRY",
    desc: "Zero registration fee for all eligible student teams.",
  },
  {
    icon: AwardIcon,
    tag: "// CREDENTIALS",
    title: "CERTIFICATES FOR ALL",
    desc: "Official participation certificates awarded to all attendees.",
  },
  {
    icon: UsersIcon,
    tag: "// EVALUATION",
    title: "INDUSTRY JURY",
    desc: "Live project evaluation by engineers from Sri Vensy Technologies.",
  },
];

export function PrizesSection() {
  const containerRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const prefersReducedMotion = window.matchMedia(
        "(prefers-reduced-motion: reduce)"
      ).matches;

      if (prefersReducedMotion) {
        gsap.set(
          [
            ".gsap-prize-rule",
            ".gsap-prize-tag",
            ".gsap-prize-title",
            ".gsap-prize-desc",
            ".gsap-prize-badge",
            ".gsap-prize-card",
            ".gsap-prize-strip",
          ],
          { opacity: 1, y: 0, scaleX: 1 }
        );
        return;
      }

      gsap.set(".gsap-prize-rule", { scaleX: 0, transformOrigin: "left center" });
      gsap.set(
        [
          ".gsap-prize-tag",
          ".gsap-prize-title",
          ".gsap-prize-desc",
          ".gsap-prize-badge",
        ],
        { opacity: 0, y: 16 }
      );
      gsap.set(".gsap-prize-card", { opacity: 0, y: 18 });
      gsap.set(".gsap-prize-strip", { opacity: 0, y: 14 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: containerRef.current,
          start: "top 80%",
          once: true,
        },
      });

      tl.to(".gsap-prize-rule", { scaleX: 1, duration: 0.5, ease: "power3.out" })
        .to(
          ".gsap-prize-tag",
          { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
          "-=0.3"
        )
        .to(
          ".gsap-prize-title",
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
          "-=0.2"
        )
        .to(
          ".gsap-prize-desc",
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
          "-=0.3"
        )
        .to(
          ".gsap-prize-badge",
          { opacity: 1, y: 0, duration: 0.35, ease: "power3.out" },
          "-=0.3"
        )
        .to(
          ".gsap-prize-card",
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
          ".gsap-prize-strip",
          { opacity: 1, y: 0, duration: 0.45, ease: "power3.out" },
          "-=0.2"
        );
    },
    { scope: containerRef }
  );

  return (
    <section
      ref={containerRef}
      id="prizes"
      className="relative py-20 sm:py-28 md:py-32 bg-black border-t border-[#262626] overflow-hidden"
    >
      {/* Subtle grid background */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Top ambient glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[250px] bg-gradient-to-b from-white/5 to-transparent blur-[90px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16">
        {/* Section Header - Perfectly aligned to max-w-7xl guideline */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6 pb-2">
          <div className="space-y-3 max-w-2xl">
            <div className="flex items-center gap-3">
              <div className="gsap-prize-rule h-px w-8 bg-white" />
              <span className="gsap-prize-tag font-mono text-xs uppercase tracking-widest text-[#737373]">
                // PRIZES &amp; RECOGNITION
              </span>
            </div>

            <h2 className="gsap-prize-title font-mono text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              TOTAL PRIZE POOL{" "}
              <span className="whitespace-nowrap">
                ₹20,000
                <span className="inline-block animate-pulse text-white">_</span>
              </span>
            </h2>

            <p className="gsap-prize-desc text-xs sm:text-sm font-sans text-neutral-400 leading-relaxed">
              Awarded across both competition tracks: TECH FORGE and AGENT VIBE.
            </p>
          </div>

          {/* Quick Telemetry Badge */}
          <div className="gsap-prize-badge inline-flex items-center gap-2 border border-[#222222] bg-[#0A0A0A] px-4 py-2 font-mono text-xs text-neutral-400 shrink-0 self-start sm:self-end">
            <span className="text-[#737373]">// ALLOCATION:</span>
            <span className="font-bold text-white tracking-wider">
              2 TRACKS // 6 PODIUMS
            </span>
          </div>
        </div>

        {/* 3-Column Minimalist Podium Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8 items-stretch">
          {prizes.map((prize) => {
            const Icon = prize.icon;

            return (
              <div
                key={prize.rank}
                className={cn(
                  "gsap-prize-card group relative flex flex-col justify-between p-7 sm:p-8 lg:p-9 border border-[#222222] bg-[#0A0A0A] backdrop-blur-sm h-full",
                  "hover:border-[#383838] hover:bg-[#0D0D0D] active:border-white transition-colors duration-150"
                )}
              >
                {/* Corner accent brackets */}
                <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-[#333333] group-hover:border-white transition-colors duration-200" />
                <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-[#333333] group-hover:border-white transition-colors duration-200" />

                <div className="flex flex-col flex-1">
                  {/* Top row: Rank indicator & Icon */}
                  <div className="flex items-center justify-between pb-5 border-b border-[#1A1A1A]">
                    <span className="font-mono text-xs font-bold text-neutral-300 tracking-wider">
                      [ {prize.rank} // {prize.title} ]
                    </span>
                    <div className="p-2 bg-[#121212] border border-[#222222] group-hover:border-[#383838] transition-colors">
                      <Icon className="size-4 text-neutral-300 group-hover:text-white transition-colors" />
                    </div>
                  </div>

                  {/* Hero Amount using NumberFlow */}
                  <div className="py-7 sm:py-8">
                    <NumberFlowCounter
                      value={prize.amount}
                      initialValue={0}
                      prefix="₹"
                      locales="en-IN"
                      duration={1.2}
                      className="font-mono text-4xl sm:text-5xl font-black text-white tracking-tight leading-none block"
                    />
                    <p className="font-mono text-xs text-[#737373] uppercase tracking-wide mt-2.5">
                      // {prize.subtitle}
                    </p>
                  </div>

                  {/* Minimal Deliverables Footer */}
                  <div className="pt-5 border-t border-[#1A1A1A] mt-auto">
                    <span className="font-mono text-[10px] text-[#737373] uppercase tracking-widest block mb-1.5">
                      // REWARDS
                    </span>
                    <p className="font-mono text-xs text-neutral-300 tracking-wide leading-relaxed">
                      {prize.deliverables}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* 3-Cell Unified Benefits Strip */}
        <div className="gsap-prize-strip border border-[#222222] bg-[#0A0A0A] grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-[#222222]">
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.title}
                className="p-6 sm:p-7 flex items-start gap-4 hover:bg-[#0D0D0D] transition-colors"
              >
                <div className="p-2.5 bg-[#121212] border border-[#222222] text-white shrink-0">
                  <Icon className="size-4 text-neutral-300" />
                </div>
                <div className="space-y-1.5 min-w-0">
                  <span className="font-mono text-[10px] uppercase tracking-widest text-[#737373] block">
                    {perk.tag}
                  </span>
                  <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-white">
                    {perk.title}
                  </h4>
                  <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                    {perk.desc}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

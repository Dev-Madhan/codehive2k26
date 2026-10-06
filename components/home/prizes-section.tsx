"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { TrophyIcon, MedalIcon, AwardIcon, GiftIcon, CodeIcon, UsersIcon } from "lucide-react";

const prizes = [
  {
    rank: "01",
    label: "FIRST PRIZE",
    amount: "₹5,000",
    track: "1ST PLACE // PER TRACK",
    perks: ["Cash Award", "Winner Trophy", "Merit Certificate", "Hall of Fame"],
    icon: TrophyIcon,
    featured: true,
    accent: "blue",
  },
  {
    rank: "02",
    label: "SECOND PRIZE",
    amount: "₹3,000",
    track: "2ND PLACE // PER TRACK",
    perks: ["Cash Award", "Runner-Up Trophy", "Merit Certificate", "Mentorship Session"],
    icon: MedalIcon,
    featured: false,
    accent: "sky",
  },
  {
    rank: "03",
    label: "THIRD PRIZE",
    amount: "₹2,000",
    track: "3RD PLACE // PER TRACK",
    perks: ["Cash Award", "Second Runner-Up Trophy", "Merit Certificate", "Exclusive Swag"],
    icon: AwardIcon,
    featured: false,
    accent: "indigo",
  },
];

const perks = [
  {
    icon: GiftIcon,
    title: "100% Free Entry",
    desc: "Zero registration fee for all eligible student builders and collegiate teams",
  },
  {
    icon: AwardIcon,
    title: "Certificates For All",
    desc: "Official CodeHive 2K26 2.0 participation certificates for all registered attendees",
  },
  {
    icon: UsersIcon,
    title: "Industry Jury & Networking",
    desc: "Direct evaluation and jury feedback with Sri Vensy Technologies & industry experts",
  },
];

export function PrizesSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.05, once: true });

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 bg-black border-t border-[#262626] overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* Prize glow */}
      <div className="pointer-events-none absolute top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-gradient-to-b from-white/5 to-transparent blur-[120px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={cn(
            "mb-16 text-center transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-white" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-[#737373]">
              PRIZES &amp; RECOGNITION
            </span>
            <div className="h-px w-8 bg-white" />
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            TOTAL PRIZE POOL{" "}
            <span className="text-white">
              ₹20,000
            </span>
          </h2>
          <p className="mt-3 text-neutral-400 text-base max-w-xl mx-auto font-sans">
            Cash awards for 1st, 2nd, and 3rd place winners across tracks, plus 100% Free Entry &amp; Certificates for all participants.
          </p>
        </div>

        {/* Prize podium */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 mb-12">
          {prizes.map((prize, i) => {
            const Icon = prize.icon;
            const isFeatured = prize.featured;
            return (
              <div
                key={prize.rank}
                className={cn(
                  "relative flex flex-col p-6 border transition-all duration-700",
                  isFeatured
                    ? "border-white bg-[#0F0F0F] shadow-[0_0_40px_rgba(255,255,255,0.08)] md:-mt-4"
                    : "border-[#262626] bg-[#0F0F0F]",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
                )}
                style={{ transitionDelay: `${i * 100}ms` }}
              >
                {/* Featured badge */}
                {isFeatured && (
                  <div className="absolute -top-px left-0 right-0 h-[2px] bg-white" />
                )}

                {/* Corner */}
                <div className={cn("absolute top-0 right-0 w-3 h-3 border-t border-r", isFeatured ? "border-white" : "border-[#404040]")} />

                {/* Rank */}
                <div className="flex items-start justify-between mb-4">
                  <span className="font-mono text-5xl font-black text-neutral-700 leading-none select-none">
                    {prize.rank}
                  </span>
                  <div className={cn(
                    "p-2.5",
                    isFeatured ? "bg-white text-black" : "bg-[#161616] text-white border border-[#262626]"
                  )}>
                    <Icon className="size-5" />
                  </div>
                </div>

                {/* Label & track */}
                <p className="font-mono text-[10px] uppercase tracking-widest text-[#737373] mb-1">
                  {prize.track} // {prize.label}
                </p>

                {/* Amount */}
                <p className="font-mono text-3xl sm:text-4xl font-black mb-4 tracking-tight text-white">
                  {prize.amount}
                </p>

                {/* Perks */}
                <ul className="space-y-2 flex-1">
                  {prize.perks.map((perk) => (
                    <li key={perk} className="flex items-center gap-2 text-sm text-neutral-400">
                      <span className={cn("w-1 h-1 shrink-0", isFeatured ? "bg-white" : "bg-[#404040]")} />
                      {perk}
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </div>

        {/* Additional perks */}
        <div
          className={cn(
            "grid grid-cols-1 sm:grid-cols-3 gap-4 transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "400ms" }}
        >
          {perks.map((perk) => {
            const Icon = perk.icon;
            return (
              <div
                key={perk.title}
                className="flex items-start gap-3 p-4 border border-[#262626] bg-[#0F0F0F]"
              >
                <div className="p-2 bg-[#161616] border border-[#262626] text-white shrink-0">
                  <Icon className="size-4" />
                </div>
                <div>
                  <p className="font-mono text-xs font-bold uppercase tracking-wider text-white mb-1">
                    {perk.title}
                  </p>
                  <p className="text-xs text-[#737373] leading-relaxed">{perk.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

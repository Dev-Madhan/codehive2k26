"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const sponsors = {
  title: [
    { name: "TechCorp AI", tier: "TITLE" },
  ],
  gold: [
    { name: "CloudNova", tier: "GOLD" },
    { name: "DevMatrix", tier: "GOLD" },
  ],
  silver: [
    { name: "ByteForge", tier: "SILVER" },
    { name: "Quantum Labs", tier: "SILVER" },
    { name: "NeuralStack", tier: "SILVER" },
  ],
};

function SponsorCard({ name, tier }: { name: string; tier: string }) {
  const sizeMap = {
    TITLE: "h-16 text-base",
    GOLD: "h-12 text-sm",
    SILVER: "h-10 text-xs",
  };
  return (
    <div
      className={cn(
        "flex items-center justify-center border border-[#152A54]/60 bg-[#060D1A]/60 px-6 font-mono font-bold uppercase tracking-widest text-slate-500 hover:text-slate-300 hover:border-blue-500/30 transition-all cursor-default",
        sizeMap[tier as keyof typeof sizeMap] || "h-10 text-xs"
      )}
    >
      {name}
    </div>
  );
}

export function SponsorsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.05, once: true });

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 bg-black border-t border-[#152A54]/60 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(21,42,84,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(21,42,84,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={cn(
            "mb-16 text-center transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-blue-500" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-blue-500">
              SPONSORS &amp; PARTNERS
            </span>
            <div className="h-px w-8 bg-blue-500" />
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            BACKED BY{" "}
            <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
              INDUSTRY LEADERS
            </span>
          </h2>
          <p className="mt-3 text-slate-500 text-sm max-w-lg mx-auto">
            Leading technology companies powering the next generation of builders.
          </p>
        </div>

        {/* Title sponsors */}
        <div
          className={cn(
            "mb-6 flex justify-center transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "100ms" }}
        >
          <div className="relative">
            <div className="absolute -top-2 left-1/2 -translate-x-1/2 font-mono text-[9px] uppercase tracking-widest text-blue-500 whitespace-nowrap">
              ◆ TITLE SPONSOR ◆
            </div>
            {sponsors.title.map((s) => (
              <SponsorCard key={s.name} {...s} />
            ))}
          </div>
        </div>

        {/* Gold sponsors */}
        <div className="mb-4">
          <p className="text-center font-mono text-[9px] uppercase tracking-widest text-slate-600 mb-3">
            ◆ GOLD ◆
          </p>
          <div
            className={cn(
              "flex flex-wrap justify-center gap-3 transition-all duration-700",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: "200ms" }}
          >
            {sponsors.gold.map((s) => (
              <SponsorCard key={s.name} {...s} />
            ))}
          </div>
        </div>

        {/* Silver sponsors */}
        <div>
          <p className="text-center font-mono text-[9px] uppercase tracking-widest text-slate-700 mb-3">
            ◆ SILVER ◆
          </p>
          <div
            className={cn(
              "flex flex-wrap justify-center gap-3 transition-all duration-700",
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
            )}
            style={{ transitionDelay: "300ms" }}
          >
            {sponsors.silver.map((s) => (
              <SponsorCard key={s.name} {...s} />
            ))}
          </div>
        </div>

        {/* CTA to become sponsor */}
        <div
          className={cn(
            "mt-12 text-center transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "400ms" }}
        >
          <p className="font-mono text-xs text-slate-600 uppercase tracking-widest">
            Interested in sponsoring?{" "}
            <a
              href="mailto:codehive@example.com"
              className="text-blue-400 hover:text-white transition-colors border-b border-blue-500/40 hover:border-blue-400"
            >
              contact@codehive.in
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}

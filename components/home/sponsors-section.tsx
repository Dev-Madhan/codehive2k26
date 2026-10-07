"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import {
  Building2Icon,
  GraduationCapIcon,
  AwardIcon,
  ShieldCheckIcon,
  CheckCircle2Icon,
} from "lucide-react";

const accreditations = [
  { code: "NBA", label: "Accredited" },
  { code: "NAAC 'A'", label: "Grade 'A'" },
  { code: "AICTE", label: "Approved" },
  { code: "ANNA UNIV", label: "Affiliated" },
];

const partnerHighlights = [
  "Curated industry-standard problem statements",
  "Live architecture & code evaluation by senior engineers",
  "Industry insights and direct mentorship for top finalists",
];

export function SponsorsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.05, once: true });

  return (
    <section
      ref={ref}
      id="partners"
      className="relative py-12 sm:py-24 md:py-28 bg-black border-t border-[#262626] overflow-hidden"
    >
      {/* Background Grid Pattern */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-7xl mx-auto px-3.5 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div
          className={cn(
            "mb-6 sm:mb-14 text-center transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center justify-center gap-2 sm:gap-3 mb-2 sm:mb-3">
            <div className="h-px w-6 sm:w-8 bg-white" />
            <span className="font-mono text-[10px] sm:text-[11px] uppercase tracking-widest text-[#737373]">
              // STRATEGIC PARTNERSHIP &amp; HOST
            </span>
            <div className="h-px w-6 sm:w-8 bg-white" />
          </div>
          <h2 className="font-mono text-2xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            IN ASSOCIATION <span className="text-white">WITH</span>
          </h2>
          {/* Subtitle - Desktop only */}
          <p className="hidden sm:block mt-2 sm:mt-3 text-neutral-400 text-xs sm:text-sm max-w-xl mx-auto font-sans leading-relaxed">
            Powering industry-standard problem statements, technical evaluation, and student excellence.
          </p>
        </div>

        {/* Unified Bento Console */}
        <div
          className={cn(
            "max-w-5xl mx-auto border border-[#262626] bg-[#0A0A0A] transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "150ms" }}
        >
          {/* Top Console Status Ribbon */}
          <div className="flex items-center justify-between px-3 sm:px-6 py-2 sm:py-2.5 border-b border-[#262626] bg-[#0D0D0D] font-mono text-[10px] sm:text-[11px]">
            <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
              <span className="size-1.5 bg-emerald-400 rounded-none animate-pulse shrink-0" />
              <span className="text-[#737373] uppercase tracking-wider hidden xs:inline">NETWORK:</span>
              <span className="text-white font-bold truncate">VERIFIED ALLIANCE</span>
            </div>
            <span className="text-[#737373] uppercase text-[9px] sm:text-[10px] font-mono tracking-wider shrink-0">
              CODEHIVE 2K26 // HOST
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 divide-y lg:divide-y-0 lg:divide-x divide-[#262626]">
            {/* Left Column: Title Industry Partner Spotlight */}
            <div className="p-3.5 sm:p-6 lg:p-7 flex flex-col justify-between space-y-3 sm:space-y-6">
              <div>
                <div className="flex items-center justify-between gap-2 mb-2.5 sm:mb-4">
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold text-white uppercase tracking-wider">
                    [ 01 // TITLE INDUSTRY PARTNER ]
                  </span>
                  <span className="font-mono text-[8px] sm:text-[9px] px-1.5 sm:px-2 py-0.5 border border-[#333333] bg-[#141414] text-white uppercase tracking-wider font-bold shrink-0">
                    PRIMARY PARTNER
                  </span>
                </div>

                <div className="group relative p-3.5 sm:p-5 lg:p-6 border border-[#262626] bg-[#0F0F0F] hover:border-[#404040] hover:bg-[#121212] transition-all duration-150">
                  {/* Cyber corner accents */}
                  <div className="absolute top-0 right-0 w-2 sm:w-2.5 h-2 sm:h-2.5 border-t border-r border-[#333333] group-hover:border-white transition-colors" />
                  <div className="absolute bottom-0 left-0 w-2 sm:w-2.5 h-2 sm:h-2.5 border-b border-l border-[#333333] group-hover:border-white transition-colors" />

                  <div className="flex items-start gap-3 sm:gap-4 mb-1 sm:mb-4">
                    <div className="p-2 sm:p-2.5 border border-[#262626] bg-[#161616] group-hover:border-white/40 transition-colors shrink-0">
                      <Building2Icon className="size-4 sm:size-5 text-white" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <span className="font-mono text-[9px] sm:text-[10px] text-[#737373] tracking-widest uppercase block mb-0.5 sm:mb-1">
                        OFFICIAL INDUSTRY COLLABORATOR
                      </span>
                      <h3 className="font-mono text-sm sm:text-base lg:text-lg font-black text-white tracking-tight uppercase leading-snug group-hover:text-white transition-colors">
                        SRI VENSY TECHNOLOGIES PVT LTD
                      </h3>
                      {/* Mobile concise role badge */}
                      <p className="sm:hidden text-[11px] text-neutral-400 font-mono mt-1">
                        Problem Statements &amp; Technical Evaluation
                      </p>
                    </div>
                  </div>

                  {/* Desktop detailed description */}
                  <p className="hidden sm:block text-xs text-neutral-300 font-sans leading-relaxed mb-3 sm:mb-4">
                    Partnering with CodeHive 2K26 to formulate real-world enterprise problem statements and evaluate participant submissions with professional engineering standards.
                  </p>

                  {/* Desktop detailed highlights list */}
                  <div className="hidden sm:block space-y-1.5 sm:space-y-2 pt-2.5 sm:pt-3 border-t border-[#1C1C1C]">
                    {partnerHighlights.map((highlight) => (
                      <div key={highlight} className="flex items-start gap-2 text-[11px] text-neutral-400 font-sans leading-snug">
                        <CheckCircle2Icon className="size-3.5 text-neutral-300 shrink-0 mt-0.5" />
                        <span>{highlight}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Status Note - Desktop only */}
              <div className="hidden sm:flex pt-2 sm:pt-2.5 border-t border-[#1C1C1C] items-center justify-between text-[#737373] font-mono text-[9px] sm:text-[10px]">
                <span className="flex items-center gap-1.5 truncate">
                  <ShieldCheckIcon className="size-3 text-neutral-400 shrink-0" />
                  <span className="truncate">OFFICIAL TITLE INDUSTRY PARTNER</span>
                </span>
                <span className="uppercase text-neutral-400 font-bold shrink-0 ml-2">VERIFIED</span>
              </div>
            </div>

            {/* Right Column: Host Institution & Department */}
            <div className="p-3.5 sm:p-6 lg:p-7 flex flex-col justify-between space-y-3 sm:space-y-6 bg-[#080808]">
              <div>
                <div className="flex items-center gap-2 mb-2.5 sm:mb-4">
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold text-white uppercase tracking-wider">
                    [ 02 // HOST INSTITUTION &amp; DEPARTMENT ]
                  </span>
                </div>

                <div className="relative p-3.5 sm:p-5 lg:p-6 border border-[#262626] bg-[#0F0F0F] group hover:border-[#404040] transition-colors">
                  <div className="absolute top-0 right-0 w-2 sm:w-2.5 h-2 sm:h-2.5 border-t border-r border-[#333333] group-hover:border-white transition-colors" />
                  <div className="absolute bottom-0 left-0 w-2 sm:w-2.5 h-2 sm:h-2.5 border-b border-l border-[#333333] group-hover:border-white transition-colors" />

                  <div className="flex items-center gap-2 sm:gap-2.5 mb-1.5 sm:mb-2.5">
                    <GraduationCapIcon className="size-4 text-white shrink-0" />
                    <span className="font-mono text-[9px] sm:text-[10px] text-[#737373] tracking-widest uppercase">
                      ORGANIZING DEPARTMENT
                    </span>
                  </div>

                  <h3 className="font-mono text-sm sm:text-base font-bold text-white uppercase tracking-tight leading-snug mb-0.5 sm:mb-1.5">
                    Department of Computer Science &amp; Business Systems
                  </h3>
                  <p className="text-xs text-neutral-300 font-sans leading-relaxed">
                    Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College
                  </p>

                  {/* Clean credential chips - Desktop only */}
                  <div className="hidden sm:flex flex-wrap gap-1.5 sm:gap-2 mt-2.5 sm:mt-3 pt-2 sm:pt-2.5 border-t border-[#1F1F1F]">
                    <span className="font-mono text-[9px] sm:text-[10px] px-2 py-0.5 border border-[#262626] bg-[#141414] text-[#A3A3A3] uppercase">
                      Autonomous
                    </span>
                    <span className="font-mono text-[9px] sm:text-[10px] px-2 py-0.5 border border-[#262626] bg-[#141414] text-[#A3A3A3] uppercase">
                      AICTE Approved
                    </span>
                    <span className="font-mono text-[9px] sm:text-[10px] px-2 py-0.5 border border-[#262626] bg-[#141414] text-[#A3A3A3] uppercase">
                      Anna Univ Affiliated
                    </span>
                  </div>
                </div>
              </div>

              {/* Accreditations Ribbon */}
              <div>
                <div className="flex items-center justify-between mb-1.5 sm:mb-2">
                  <span className="font-mono text-[9px] sm:text-[10px] text-[#737373] uppercase tracking-wider flex items-center gap-1.5">
                    <AwardIcon className="size-3 text-white shrink-0" />
                    ACCREDITATIONS
                  </span>
                  <span className="hidden sm:inline font-mono text-[8px] sm:text-[9px] text-[#737373] uppercase">
                    TIER-1 VERIFIED
                  </span>
                </div>
                <div className="grid grid-cols-3 sm:grid-cols-4 gap-1.5 sm:gap-2">
                  {accreditations.map((acc) => {
                    const isAnnaUniv = acc.code === "ANNA UNIV";
                    return (
                      <div
                        key={acc.code}
                        className={cn(
                          "flex flex-col items-center justify-center py-2 px-1 sm:p-2.5 border border-[#262626] bg-[#0F0F0F] hover:border-[#404040] hover:bg-[#141414] transition-all text-center group",
                          isAnnaUniv ? "col-span-3 sm:col-span-1" : "col-span-1"
                        )}
                      >
                        {isAnnaUniv ? (
                          <>
                            {/* Mobile full name & affiliation */}
                            <div className="sm:hidden flex items-center justify-center gap-1.5 py-0.5">
                              <span className="font-mono text-[11px] font-bold text-white tracking-wider group-hover:text-emerald-400 transition-colors">
                                ANNA UNIVERSITY
                              </span>
                              <span className="font-mono text-[9px] text-[#737373] uppercase">
                                (AFFILIATED)
                              </span>
                            </div>
                            {/* Desktop abbreviation */}
                            <span className="hidden sm:inline font-mono text-xs font-bold text-white tracking-wider group-hover:text-emerald-400 transition-colors">
                              {acc.code}
                            </span>
                          </>
                        ) : (
                          <span className="font-mono text-[11px] sm:text-xs font-bold text-white tracking-wider group-hover:text-emerald-400 transition-colors">
                            {acc.code}
                          </span>
                        )}

                        {/* Secondary label - Desktop only */}
                        <span className="hidden sm:inline font-mono text-[8px] sm:text-[9px] text-[#737373] uppercase mt-0.5 truncate max-w-full">
                          {acc.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

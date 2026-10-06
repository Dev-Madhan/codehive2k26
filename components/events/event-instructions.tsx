"use client";

import {
  CleanEventInstructions,
  getEventInstructions,
} from "@/lib/event-instructions";
import {
  SparklesIcon,
  LaptopIcon,
  AwardIcon,
  ClockIcon,
  CheckIcon,
} from "lucide-react";

interface EventInstructionsProps {
  slug: string;
  eventName?: string;
}

export function EventInstructions({ slug, eventName }: EventInstructionsProps) {
  const data: CleanEventInstructions = getEventInstructions(slug, eventName);

  return (
    <div className="border border-[#262626] bg-[#0A0A0A] p-5 sm:p-8 space-y-8">
      {/* Header & Badges */}
      <div className="border-b border-[#262626] pb-6 space-y-3">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#737373]">
              // COMPETITION FLOW
            </span>
            <h2 className="text-xl sm:text-2xl font-mono font-black uppercase tracking-tight text-white mt-1">
              ROUNDS &amp; RULES
            </h2>
          </div>

          {/* Quick Metrics */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="border border-[#262626] bg-[#121212] px-3 py-1 text-white">
              <span className="text-[#737373] mr-1.5">ROUNDS:</span>
              <span className="font-bold">4 ROUNDS</span>
            </div>
            <div className="border border-[#262626] bg-[#121212] px-3 py-1 text-white">
              <span className="text-[#737373] mr-1.5">POINTS:</span>
              <span className="font-bold">{data.totalMarks} MARKS</span>
            </div>
            <div className="border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-400 font-bold">
              AI TOOLS ALLOWED
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm text-neutral-400 leading-relaxed font-sans max-w-3xl">
          {data.brief}
        </p>
      </div>

      {/* 4 Rounds Progression */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono uppercase tracking-wider text-[#737373]">
            // 4 PROGRESSIVE ROUNDS ({data.totalMarks} MARKS TOTAL)
          </span>
          <span className="text-[11px] font-mono text-neutral-500 hidden sm:inline">
            DAY 1 (100M) &bull; DAY 2 (100M)
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.rounds.map((round) => (
            <div
              key={round.roundNumber}
              className="border border-[#262626] bg-[#0E0E0E] p-4 hover:border-[#404040] transition-colors flex flex-col justify-between space-y-3"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white uppercase tracking-wider px-2 py-0.5 bg-[#161616] border border-[#262626]">
                    ROUND 0{round.roundNumber}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-neutral-400 text-[11px] flex items-center gap-1 font-mono">
                      <ClockIcon className="size-3 text-[#737373]" />
                      {round.day}
                    </span>
                    <span className="border border-[#333333] bg-[#141414] px-2 py-0.5 text-white font-bold text-[11px] font-mono">
                      {round.marks} M
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-mono font-bold uppercase text-white tracking-tight">
                  {round.name}
                </h4>

                <p className="text-xs text-neutral-400 leading-relaxed font-sans">
                  {round.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 3 Important Guidelines */}
      <div className="space-y-4 pt-2">
        <span className="text-xs font-mono uppercase tracking-wider text-[#737373]">
          // ESSENTIAL GUIDELINES
        </span>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="border border-[#262626] bg-[#0E0E0E] p-4 space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase">
              <SparklesIcon className="size-4 text-emerald-400 shrink-0" />
              <span>AI Tools Allowed</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              GitHub Copilot, ChatGPT, Claude, and modern AI developer tools are 100% permitted throughout the hackathon.
            </p>
          </div>

          <div className="border border-[#262626] bg-[#0E0E0E] p-4 space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase">
              <LaptopIcon className="size-4 text-white shrink-0" />
              <span>Bring Laptops</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              All participants must bring their own laptops and chargers. High-speed campus Wi-Fi and power strips will be provided.
            </p>
          </div>

          <div className="border border-[#262626] bg-[#0E0E0E] p-4 space-y-2">
            <div className="flex items-center gap-2 font-mono text-xs font-bold text-white uppercase">
              <AwardIcon className="size-4 text-amber-400 shrink-0" />
              <span>Prizes &amp; Passes</span>
            </div>
            <p className="text-xs text-neutral-400 leading-relaxed font-sans">
              ₹20,000 total cash prize pool, trophies for top teams, and official participation certificates for everyone.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default EventInstructions;

"use client";

import { useState } from "react";
import {
  CleanEventInstructions,
  getEventInstructions,
} from "@/lib/event-instructions";
import {
  SparklesIcon,
  LaptopIcon,
  AwardIcon,
  ClockIcon,
  ChevronDownIcon,
} from "lucide-react";
import { cn } from "cn";

interface EventInstructionsProps {
  slug: string;
  eventName?: string;
}

export function EventInstructions({ slug, eventName }: EventInstructionsProps) {
  const data: CleanEventInstructions = getEventInstructions(slug, eventName);
  const [mobileExpanded, setMobileExpanded] = useState(false);

  return (
    <div>
      {/* ─────────────────────────────────────────────────────────────
          MOBILE COMPACT ACCORDION VIEW (sm:hidden)
          Saves ~1,100px of vertical scrolling on mobile devices
          ───────────────────────────────────────────────────────────── */}
      <div className="block sm:hidden border border-[#262626] bg-[#0A0A0A] p-3.5 space-y-3 relative">
        <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-[#333333] pointer-events-none !m-0" />
        <div className="absolute bottom-0 left-0 w-2 h-2 border-b border-l border-[#333333] pointer-events-none !m-0" />

        <div className="flex items-center justify-between gap-2 border-b border-[#262626] pb-2">
          <div>
            <span className="font-mono text-[9px] uppercase tracking-widest text-[#737373]">
              // COMPETITION FLOW
            </span>
            <h2 className="text-sm font-mono font-black uppercase tracking-tight text-white">
              ROUNDS &amp; RULES
            </h2>
          </div>
          <span className="text-[10px] font-mono font-bold px-2 py-0.5 border border-[#333333] bg-[#141414] text-white">
            4 ROUNDS • {data.totalMarks}M
          </span>
        </div>

        {/* Quick Highlights Chip Bar */}
        <div className="flex flex-wrap items-center gap-1 text-[10px] font-mono">
          <span className="px-2 py-0.5 bg-[#121212] border border-[#262626] text-neutral-300">
            Day 1 &amp; Day 2
          </span>
          <span className="px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
            AI Tools Allowed
          </span>
          <span className="px-2 py-0.5 bg-[#121212] border border-[#262626] text-amber-400">
            ₹20K Cash Pool
          </span>
        </div>

        {/* Interactive Expand / Collapse Trigger */}
        <button
          type="button"
          onClick={() => setMobileExpanded(!mobileExpanded)}
          className="w-full flex items-center justify-between px-3 py-2 bg-[#121212] border border-[#262626] hover:border-[#404040] text-[11px] font-mono text-neutral-200 transition-colors cursor-pointer"
        >
          <span className="font-bold">
            {mobileExpanded ? "[ Hide Round Details ]" : "[ View 4 Rounds & Guidelines ]"}
          </span>
          <ChevronDownIcon
            className={cn(
              "size-3.5 text-neutral-400 transition-transform duration-200",
              mobileExpanded && "rotate-180"
            )}
          />
        </button>

        {/* Collapsible Mobile Content */}
        {mobileExpanded && (
          <div className="space-y-3 pt-1 border-t border-[#1F1F1F]">
            <p className="text-xs text-neutral-400 font-sans leading-relaxed">
              {data.brief}
            </p>

            {/* 4 Rounds */}
            <div className="space-y-2">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] block">
                // 4 PROGRESSIVE ROUNDS
              </span>
              {data.rounds.map((round) => (
                <div
                  key={round.roundNumber}
                  className="border border-[#262626] bg-[#0E0E0E] p-2.5 space-y-1.5"
                >
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white uppercase text-[10px] px-1.5 py-0.5 bg-[#161616] border border-[#262626]">
                      ROUND 0{round.roundNumber}
                    </span>
                    <div className="flex items-center gap-1.5 text-[10px] font-mono">
                      <span className="text-neutral-400">{round.day}</span>
                      <span className="text-white font-bold border border-[#333333] px-1.5 py-0.5 bg-[#141414]">
                        {round.marks}M
                      </span>
                    </div>
                  </div>
                  <h4 className="text-xs font-mono font-bold uppercase text-white">
                    {round.name}
                  </h4>
                  <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                    {round.summary}
                  </p>
                </div>
              ))}
            </div>

            {/* Guidelines */}
            <div className="space-y-2 pt-1">
              <span className="text-[10px] font-mono uppercase tracking-wider text-[#737373] block">
                // ESSENTIAL GUIDELINES
              </span>
              <div className="border border-[#262626] bg-[#0E0E0E] p-2.5 space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-white">
                  <SparklesIcon className="size-3.5 text-emerald-400 shrink-0" />
                  <span>AI Tools Allowed</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                  Copilot, ChatGPT, Claude permitted throughout hackathon.
                </p>
              </div>
              <div className="border border-[#262626] bg-[#0E0E0E] p-2.5 space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-white">
                  <LaptopIcon className="size-3.5 text-white shrink-0" />
                  <span>Bring Laptops</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                  Bring personal laptops and chargers. High-speed Wi-Fi provided.
                </p>
              </div>
              <div className="border border-[#262626] bg-[#0E0E0E] p-2.5 space-y-1">
                <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-white">
                  <AwardIcon className="size-3.5 text-amber-400 shrink-0" />
                  <span>Prizes &amp; Passes</span>
                </div>
                <p className="text-[11px] text-neutral-400 font-sans leading-relaxed">
                  ₹20,000 cash prize pool, trophies and certificates for everyone.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ─────────────────────────────────────────────────────────────
          DESKTOP FULL GRID VIEW (hidden sm:block)
          Preserves 100% of the rich desktop layout exactly as before
          ───────────────────────────────────────────────────────────── */}
      <div className="hidden sm:block relative border border-[#262626] bg-[#0A0A0A] p-7 md:p-8 space-y-8">
        {/* Corner accents */}
        <div className="absolute top-0 right-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-t border-r border-[#333333] pointer-events-none !m-0" />
        <div className="absolute bottom-0 left-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-b border-l border-[#333333] pointer-events-none !m-0" />

        {/* Header & Badges */}
        <div className="border-b border-[#262626] pb-6 space-y-3">
          <div className="flex items-center justify-between gap-3">
            <div>
              <span className="font-mono text-[10px] uppercase tracking-widest text-[#737373]">
                // COMPETITION FLOW
              </span>
              <h2 className="text-2xl font-mono font-black uppercase tracking-tight text-white mt-1">
                ROUNDS &amp; RULES
              </h2>
            </div>

            {/* Quick Metrics */}
            <div className="flex items-center gap-2 text-xs font-mono">
              <div className="border border-[#262626] bg-[#121212] px-3 py-1 text-white">
                <span className="text-[#737373] mr-1">ROUNDS:</span>
                <span className="font-bold">4 ROUNDS</span>
              </div>
              <div className="border border-[#262626] bg-[#121212] px-3 py-1 text-white">
                <span className="text-[#737373] mr-1">POINTS:</span>
                <span className="font-bold">{data.totalMarks} MARKS</span>
              </div>
              <div className="border border-emerald-500/40 bg-emerald-500/10 px-3 py-1 text-emerald-400 font-bold">
                AI TOOLS ALLOWED
              </div>
            </div>
          </div>

          <p className="text-sm text-neutral-400 leading-relaxed font-sans max-w-3xl">
            {data.brief}
          </p>
        </div>

        {/* 4 Rounds Progression */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-xs font-mono uppercase tracking-wider text-[#737373]">
              // 4 PROGRESSIVE ROUNDS ({data.totalMarks} MARKS TOTAL)
            </span>
            <span className="text-[11px] font-mono text-neutral-500">
              DAY 1 (100M) &bull; DAY 2 (100M)
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4">
            {data.rounds.map((round) => (
              <div
                key={round.roundNumber}
                className="border border-[#262626] bg-[#0E0E0E] p-4 hover:border-[#404040] transition-colors flex flex-col justify-between space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-xs font-mono">
                    <span className="font-bold text-white uppercase tracking-wider px-2 py-0.5 bg-[#161616] border border-[#262626] text-xs">
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

          <div className="grid grid-cols-3 gap-4">
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
    </div>
  );
}

export default EventInstructions;


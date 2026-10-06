"use client";

import {
  CleanEventInstructions,
  getEventInstructions,
} from "@/lib/event-instructions";
import {
  SparklesIcon,
  ShieldCheckIcon,
  HelpCircleIcon,
  TerminalIcon,
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
    <div className="border border-[#262626] bg-[#0F0F0F] font-sans space-y-6 p-4 sm:p-8">
      {/* Header & Badges */}
      <div className="space-y-4 border-b border-[#262626] pb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div className="space-y-1">
            <h2 className="text-xl sm:text-2xl font-bold font-sans tracking-tight text-white uppercase">
              Event Instructions &amp; Rules
            </h2>
          </div>

          {/* Quick Metrics Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono">
            <div className="border border-[#262626] bg-[#161616] px-3 py-1 text-neutral-300">
              <span className="text-[#737373] mr-1.5">FORMAT:</span>
              <span className="text-white font-bold">{data.totalRounds} ROUNDS</span>
            </div>
            <div className="border border-[#262626] bg-[#161616] px-3 py-1 text-neutral-300">
              <span className="text-[#737373] mr-1.5">SCORE:</span>
              <span className="text-white font-bold">{data.totalMarks} MARKS</span>
            </div>
            <div className="border border-[#404040] bg-[#161616] px-3 py-1 text-white font-bold">
              AI TOOLS ALLOWED
            </div>
          </div>
        </div>

        <p className="text-xs sm:text-sm font-sans text-neutral-400 leading-relaxed max-w-3xl">
          {data.brief}
        </p>
      </div>

      {/* 4 Rounds Progression (Clean Grid) */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <span className="text-xs uppercase font-mono font-bold text-[#737373] tracking-wider flex items-center gap-2">
            <TerminalIcon className="size-3.5 text-white" />
            Competition Rounds (Cumulative {data.totalMarks} Marks)
          </span>
          <span className="text-[11px] font-mono text-[#737373] hidden sm:inline">
            Day 1: 100 M &bull; Day 2: 100 M
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {data.rounds.map((round) => (
            <div
              key={round.roundNumber}
              className="border border-[#262626] bg-[#080808] p-4 space-y-2 hover:border-[#404040] transition-colors flex flex-col justify-between"
            >
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-white font-mono text-xs uppercase tracking-wider">
                    Round {round.roundNumber}
                  </span>
                  <div className="flex items-center gap-2">
                    <span className="text-[#737373] text-[11px] flex items-center gap-1 font-mono">
                      <ClockIcon className="size-3 text-[#737373]" />
                      {round.day}
                    </span>
                    <span className="border border-[#404040] bg-[#161616] px-2 py-0.5 text-white font-bold text-[11px] font-mono">
                      {round.marks} M
                    </span>
                  </div>
                </div>

                <h4 className="text-sm font-sans font-bold text-white tracking-tight">
                  {round.name}
                </h4>

                <p className="text-xs font-sans text-neutral-400 leading-relaxed">
                  {round.summary}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Essential Directives: AI, Continuity, Defense (3 Cards) */}
      <div className="space-y-3 pt-2">
        <span className="text-xs uppercase font-mono font-bold text-[#737373] tracking-wider flex items-center gap-2">
          <ShieldCheckIcon className="size-3.5 text-white" />
          Key Competition Guidelines
        </span>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {data.directives.map((dir, idx) => (
            <div
              key={idx}
              className="border border-[#262626] bg-[#080808] p-4 space-y-2.5 hover:border-[#404040] transition-colors"
            >
              <div className="flex items-center gap-2 text-xs font-sans font-bold text-white uppercase tracking-wide">
                {dir.iconType === "ai" && <SparklesIcon className="size-3.5 text-white shrink-0" />}
                {dir.iconType === "security" && <ShieldCheckIcon className="size-3.5 text-white shrink-0" />}
                {dir.iconType === "defense" && <HelpCircleIcon className="size-3.5 text-white shrink-0" />}
                <span>{dir.title}</span>
              </div>

              <p className="text-xs font-sans text-neutral-400 leading-relaxed">
                {dir.description}
              </p>

              <ul className="space-y-1 pt-1 border-t border-[#262626] text-xs font-sans text-neutral-300">
                {dir.highlights.map((h, hIdx) => (
                  <li key={hIdx} className="flex items-start gap-1.5">
                    <CheckIcon className="size-3 text-white shrink-0 mt-0.5" />
                    <span>{h}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default EventInstructions;

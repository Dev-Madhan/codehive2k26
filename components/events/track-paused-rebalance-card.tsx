"use client";

import * as React from "react";
import Link from "next/link";
import {
  ArrowRightIcon,
  ShieldCheckIcon,
  SparklesIcon,
  TicketIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  BusIcon,
  AlertTriangleIcon,
} from "lucide-react";

interface TrackPausedRebalanceCardProps {
  currentEventName: string;
  currentEventSlug: string;
}

export function TrackPausedRebalanceCard({
  currentEventName,
  currentEventSlug,
}: TrackPausedRebalanceCardProps) {
  const isTechForge = currentEventSlug.includes("techforge");

  // Sister track data for smart redirection
  const sisterTrack = isTechForge
    ? {
        name: "AGENT VIBE",
        slug: "agentvibe-2026",
        tag: "FLAGSHIP AI TRACK // 4 ROUNDS",
        description:
          "Design, build, and deploy intelligent AI agents and autonomous workflows across 4 progressive rounds.",
        highlights: [
          "Identical ₹20,000 Cash Prize Pool",
          "Same Dates: 23 & 24 Oct 2026",
          "Free Bus Transport (AC & Non-AC)",
          "Free Food & Registration Passes",
        ],
      }
    : {
        name: "TECH FORGE",
        slug: "techforge-2026",
        tag: "FLAGSHIP CODING TRACK // 4 ROUNDS",
        description:
          "Solve real-world challenges through coding, system architecture, and algorithmic execution across 4 progressive rounds.",
        highlights: [
          "Identical ₹20,000 Cash Prize Pool",
          "Same Dates: 23 & 24 Oct 2026",
          "Free Bus Transport (AC & Non-AC)",
          "Free Food & Registration Passes",
        ],
      };

  return (
    <div className="space-y-6 font-mono">
      {/* Notice Banner */}
      <div className="border border-amber-500/40 bg-amber-500/10 p-3.5 sm:p-4 space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-bold text-amber-400 bg-amber-500/20 border border-amber-500/40 px-2 py-0.5 uppercase tracking-wider inline-flex items-center gap-1.5">
            <AlertTriangleIcon className="size-3 text-amber-400" />
            SLOTS PAUSED
          </span>
        </div>
        <h3 className="text-sm sm:text-base font-black uppercase text-white tracking-tight">
          Slots Paused for {currentEventName}
        </h3>
        <p className="text-xs text-neutral-300 leading-relaxed font-sans">
          Registrations are temporarily paused to manage track capacity. Existing confirmed teams are safe.
        </p>
      </div>

      {/* Smart Rebalance & Redirection Showcase */}
      <div className="border border-[#262626] bg-[#0F0F0F] p-4 sm:p-6 space-y-5">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#222222] pb-3">
          <div className="flex items-center gap-2">
            <span className="size-2 rounded-full bg-emerald-400 animate-pulse" />
            <span className="text-xs font-bold text-white uppercase tracking-wider">
              Recommended Alternative Track:
            </span>
          </div>
          <span className="text-[10px] uppercase font-bold text-emerald-400 border border-emerald-500/40 bg-emerald-500/10 px-2 py-0.5 self-start sm:self-auto">
            SLOTS NOW OPEN // 100% FREE ENTRY
          </span>
        </div>

        <div className="space-y-2">
          <div className="flex items-baseline gap-2 flex-wrap">
            <h4 className="text-xl sm:text-2xl font-black uppercase text-white tracking-tight">
              {sisterTrack.name}
            </h4>
            <span className="text-[11px] text-neutral-400 uppercase tracking-wider">
              [ {sisterTrack.tag} ]
            </span>
          </div>
          <p className="text-xs sm:text-sm text-neutral-400 font-sans leading-relaxed">
            {sisterTrack.description}
          </p>
        </div>

        {/* Highlight Perks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
          {sisterTrack.highlights.map((item, idx) => (
            <div
              key={idx}
              className="flex items-center gap-2 p-2.5 bg-[#080808] border border-[#1F1F1F] text-neutral-300"
            >
              <SparklesIcon className="size-3.5 text-emerald-400 shrink-0" />
              <span className="text-[11px] font-sans">{item}</span>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="pt-3 sm:pt-4 flex flex-col sm:flex-row items-stretch sm:items-center gap-3 w-full">
          <Link
            href={`/events/${sisterTrack.slug}#register`}
            className="group/cta w-full sm:flex-1 py-3.5 sm:py-4 px-4 sm:px-6 min-h-[48px] sm:min-h-[50px] bg-white hover:bg-neutral-200 text-black font-mono text-xs sm:text-sm uppercase font-bold tracking-wider border border-white flex items-center justify-center gap-2 sm:gap-2.5 transition-all duration-150 active:scale-[0.98] text-center cursor-pointer shadow-md select-none whitespace-nowrap"
          >
            <span>Register Now</span>
            <ArrowRightIcon className="size-4 shrink-0 group-hover/cta:translate-x-1 transition-transform" />
          </Link>

          <Link
            href="/events"
            className="group/all w-full sm:w-auto py-3.5 sm:py-4 px-4 sm:px-6 min-h-[48px] sm:min-h-[50px] bg-[#141414] hover:bg-[#1E1E1E] text-neutral-300 hover:text-white font-mono text-xs sm:text-sm uppercase font-bold tracking-wider border border-[#333333] hover:border-neutral-500 flex items-center justify-center gap-2 transition-all duration-150 active:scale-[0.98] text-center cursor-pointer select-none whitespace-nowrap"
          >
            <span>Browse All Tracks</span>
            <ArrowRightIcon className="size-3.5 shrink-0 text-neutral-500 group-hover/all:text-neutral-300 group-hover/all:translate-x-0.5 transition-all" />
          </Link>
        </div>
      </div>
    </div>
  );
}

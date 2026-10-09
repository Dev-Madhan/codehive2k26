import Link from "next/link";
import { TerminalIcon, ArrowLeftIcon, CalendarIcon, CompassIcon } from "lucide-react";

export default function NotFound() {
  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 py-12 selection:bg-white selection:text-black">
      {/* Terminal Container */}
      <div className="w-full max-w-lg border border-[#262626] bg-[#0A0A0A] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Top Terminal Bar */}
        <div className="flex items-center justify-between border-b border-[#262626] pb-4 font-mono text-xs text-[#737373]">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-[#333333]" />
            <span className="size-2.5 rounded-full bg-[#333333]" />
            <span className="size-2.5 rounded-full bg-[#333333]" />
            <span className="text-[#A3A3A3] ml-2 font-bold uppercase tracking-wider">
              SYS_DIAGNOSTIC // 404
            </span>
          </div>
          <span className="text-[10px] text-neutral-500 uppercase">CODEHIVE 2K26</span>
        </div>

        {/* 404 Header */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 text-[11px] font-mono font-bold tracking-widest uppercase bg-[#171717] border border-[#262626] text-white">
            <TerminalIcon className="size-3.5 text-white" />
            <span>ERR_TARGET_NOT_FOUND</span>
          </div>
          <h1 className="font-mono text-4xl sm:text-5xl font-black tracking-tight text-white uppercase">
            404 // NULL
          </h1>
          <p className="text-sm font-sans text-[#A3A3A3] leading-relaxed">
            The requested terminal node, pass record, or symposium route does not exist or has been relocated within the network grid.
          </p>
        </div>

        {/* Telemetry Block */}
        <div className="border border-[#262626] bg-[#0F0F0F] p-3.5 font-mono text-xs space-y-1.5 text-neutral-400">
          <div className="flex justify-between">
            <span className="text-[#737373]">STATUS:</span>
            <span className="text-white font-bold">[ 404 UNRESOLVED ]</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#737373]">NETWORK:</span>
            <span className="text-neutral-300">CODEHIVE-NODE-01</span>
          </div>
          <div className="flex justify-between">
            <span className="text-[#737373]">GATEWAY:</span>
            <span className="text-neutral-300">SECURE_EDGE_ROUTER</span>
          </div>
        </div>

        {/* Navigation Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 font-mono text-xs font-bold uppercase tracking-wider bg-white hover:bg-neutral-200 text-black transition-colors border border-white cursor-pointer select-none"
          >
            <ArrowLeftIcon className="size-3.5 text-black" />
            <span>&lt; Return Home</span>
          </Link>
          <Link
            href="/events"
            className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 font-mono text-xs font-bold uppercase tracking-wider bg-[#171717] hover:bg-[#202020] text-white hover:border-white transition-colors border border-[#262626] cursor-pointer select-none"
          >
            <CalendarIcon className="size-3.5 text-white" />
            <span>Explore Events &gt;</span>
          </Link>
        </div>

        {/* Terminal Footer */}
        <p className="text-[10px] font-mono text-[#525252] text-center uppercase tracking-widest pt-2">
          CodeHive 2K26 2.0 &bull; Vel Tech Multi Tech
        </p>
      </div>
    </main>
  );
}

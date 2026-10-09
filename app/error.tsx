"use client";

import { useEffect } from "react";
import Link from "next/link";
import { AlertTriangleIcon, RefreshCwIcon, HomeIcon } from "lucide-react";

export default function ErrorBoundary({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[CodeHive Runtime Crash Caught]:", error);
  }, [error]);

  return (
    <main className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 py-12 selection:bg-white selection:text-black">
      <div className="w-full max-w-lg border border-[#262626] bg-[#0A0A0A] p-6 sm:p-8 space-y-6 shadow-2xl relative overflow-hidden">
        {/* Terminal Header */}
        <div className="flex items-center justify-between border-b border-[#262626] pb-4 font-mono text-xs text-[#737373]">
          <div className="flex items-center gap-2">
            <span className="size-2.5 rounded-full bg-red-500 animate-pulse" />
            <span className="text-[#A3A3A3] ml-2 font-bold uppercase tracking-wider">
              SYS_CRASH_RECOVERY
            </span>
          </div>
          <span className="text-[10px] text-neutral-500 uppercase">CODEHIVE 2K26</span>
        </div>

        {/* Error Info */}
        <div className="space-y-3">
          <div className="inline-flex items-center gap-2 px-2.5 py-1 text-[11px] font-mono font-bold tracking-widest uppercase bg-[#171717] border border-red-500/40 text-red-400">
            <AlertTriangleIcon className="size-3.5 text-red-400" />
            <span>UNCAUGHT_RUNTIME_EXCEPTION</span>
          </div>
          <h1 className="font-mono text-3xl sm:text-4xl font-extrabold tracking-tight text-white uppercase">
            EXECUTION FAILED
          </h1>
          <p className="text-sm font-sans text-[#A3A3A3] leading-relaxed">
            An unexpected error interrupted application execution. The cyber security barrier prevented further state degradation.
          </p>
        </div>

        {/* Diagnostic Telemetry Block */}
        <div className="border border-[#262626] bg-[#0F0F0F] p-3.5 font-mono text-xs space-y-1.5 text-neutral-400">
          <div className="flex justify-between">
            <span className="text-[#737373]">ERROR TYPE:</span>
            <span className="text-white font-bold truncate max-w-[240px]">
              {error.name || "Error"}
            </span>
          </div>
          {error.digest && (
            <div className="flex justify-between">
              <span className="text-[#737373]">TRACE DIGEST:</span>
              <span className="text-neutral-300 font-mono text-[11px]">{error.digest}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span className="text-[#737373]">TIMESTAMP:</span>
            <span className="text-neutral-300 font-mono text-[11px]">
              {new Date().toISOString()}
            </span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3 pt-2">
          <button
            onClick={() => reset()}
            className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 font-mono text-xs font-bold uppercase tracking-wider bg-white hover:bg-neutral-200 text-black transition-colors border border-white cursor-pointer select-none"
          >
            <RefreshCwIcon className="size-3.5 text-black" />
            <span>Re-Execute Component</span>
          </button>
          <Link
            href="/"
            className="flex-1 inline-flex items-center justify-center gap-2 h-10 px-4 font-mono text-xs font-bold uppercase tracking-wider bg-[#171717] hover:bg-[#202020] text-white hover:border-white transition-colors border border-[#262626] cursor-pointer select-none"
          >
            <HomeIcon className="size-3.5 text-white" />
            <span>Return to Safety</span>
          </Link>
        </div>

        <p className="text-[10px] font-mono text-[#525252] text-center uppercase tracking-widest pt-2">
          If issues persist, contact operations desk &bull; codehive2k26@veltechmultitech.org
        </p>
      </div>
    </main>
  );
}

import Link from "next/link";
import { Header } from "@/components/header";
import { ArrowRightIcon, TerminalIcon } from "lucide-react";

export default function Home() {
  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Background Subtle Dark Blue Atmosphere */}
      <div className="pointer-events-none absolute -top-40 left-1/2 -translate-x-1/2 h-[550px] w-[800px] rounded-full bg-blue-950/25 blur-[160px]" />
      <div className="pointer-events-none absolute top-1/3 -right-20 h-[350px] w-[350px] rounded-full bg-blue-600/10 blur-[130px]" />

      <Header />

      <main className="flex-1 flex flex-col items-center justify-center p-6 text-center z-10">
        <div className="max-w-3xl space-y-6">
          {/* Highlighted Tag (Reference Image 2 layout) */}
          <div className="inline-flex items-center gap-2 px-3 py-1 border border-blue-500/40 bg-blue-600/15 font-mono text-xs text-blue-400">
            <TerminalIcon className="size-3.5 text-blue-400" />
            <span className="font-semibold">&gt; codehive_2k26: registrations_active</span>
          </div>

          <h1 className="text-4xl sm:text-6xl md:text-7xl font-bold tracking-tight text-white leading-[1.1] font-sans">
            Build, collaborate &amp; ship{" "}
            <span className="bg-gradient-to-r from-blue-300 via-blue-400 to-blue-600 bg-clip-text text-transparent">
              faster
            </span>
          </h1>

          <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-sans">
            The next-generation symposium and hackathon platform. High-performance events, team registrations, and instant QR verification.
          </p>

          {/* High-Contrast Action Buttons (Reference Image 1 & 2 layout) */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4">
            <Link
              href="/events"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider font-bold rounded-none bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 transition-colors shadow-md shadow-blue-900/30"
            >
              [ Explore Events ]
              <ArrowRightIcon className="size-3.5" />
            </Link>
            <Link
              href="/auth"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider font-semibold rounded-none bg-[#060D1A] hover:bg-[#0B162C] text-white border border-[#152A54] hover:border-blue-500/50 transition-colors"
            >
              [ Sign In ]
            </Link>
          </div>

          {/* High-Tech Terminal Status Strip (Reference Image 1 layout) */}
          <div className="mt-12 pt-6 border-t border-[#152A54]/80 grid grid-cols-2 sm:grid-cols-3 gap-4 max-w-lg mx-auto text-left">
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-slate-500">PLATFORM</span>
              <p className="text-xs font-mono font-semibold text-white">CODEHIVE 2K26</p>
            </div>
            <div className="space-y-0.5">
              <span className="text-[10px] font-mono uppercase text-slate-500">STATUS</span>
              <p className="text-xs font-mono font-semibold text-blue-400">ONLINE // OPEN</p>
            </div>
            <div className="space-y-0.5 col-span-2 sm:col-span-1">
              <span className="text-[10px] font-mono uppercase text-slate-500">CHECK-IN</span>
              <p className="text-xs font-mono font-semibold text-white">DIGITAL PASS</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}

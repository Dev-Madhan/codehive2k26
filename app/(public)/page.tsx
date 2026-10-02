import { Header } from "@/components/header";
import { AsciiBackground } from "@/components/ui/ascii-background";
import { HeroActions } from "@/components/hero-actions";
import { AboutSection } from "@/components/home/about-section";
import { EventsSection } from "@/components/home/events-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { PrizesSection } from "@/components/home/prizes-section";
import { SponsorsSection } from "@/components/home/sponsors-section";
import { FaqSection } from "@/components/home/faq-section";
import { Footer } from "@/components/home/footer";
import { getEvents } from "@/actions/event";
import {
  TrophyIcon,
  ClockIcon,
  UsersIcon,
  QrCodeIcon,
} from "lucide-react";

export default async function Home() {
  const result = await getEvents();
  const events = result.success ? result.data : [];

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white selection:bg-blue-600 selection:text-white font-sans overflow-x-hidden">
      {/* Top Sticky Navigation */}
      <Header />

      {/* ═══════════════════════════════════════════════════════════
          HERO — Interactive ASCII Matrix
      ═══════════════════════════════════════════════════════════ */}
      <div className="relative flex-1 flex flex-col">
        <AsciiBackground density="medium" speed={1.0}>
          <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-12 pb-24 text-center z-10 my-auto">
            <div className="max-w-5xl mx-auto space-y-8">

              {/* Live Hackathon Announcement Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border border-blue-500/50 bg-[#060D1A]/85 backdrop-blur-xl shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:border-blue-400 transition-all pointer-events-auto">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 bg-blue-500" />
                </span>
                <span className="font-mono text-[11px] sm:text-xs font-semibold tracking-wider text-blue-400">
                  FLAGSHIP EVENT // 24-HOUR NATIONAL HACKATHON
                </span>
                <span className="hidden sm:inline-block text-blue-600">|</span>
                <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-slate-400">
                  <span className="text-emerald-400 font-bold">■</span> REGISTRATIONS ACTIVE
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-2">
                <h1 className="font-mono text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.02] uppercase">
                  CODEHIVE 2K26 <br />
                  <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(59,130,246,0.6)]">
                    24-HOUR HACKATHON
                  </span>
                </h1>
              </div>

              {/* Description */}
              <p className="text-sm sm:text-base text-slate-300 max-w-xl mx-auto leading-relaxed font-sans">
                South India&apos;s premier national hackathon. Join 500+ elite builders
                and compete for the{" "}
                <span className="text-white font-mono font-semibold whitespace-nowrap">₹50,000+ prize pool</span>.
              </p>

              {/* CTA Buttons */}
              <div className="pt-2">
                <HeroActions />
              </div>

              {/* Stats Telemetry Grid */}
              <div className="pt-6 max-w-4xl mx-auto pointer-events-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-left">

                  <div className="relative group p-4 border border-[#152A54]/80 bg-[#060D1A]/70 backdrop-blur-md hover:border-blue-500/60 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]">
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-400/80" />
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                      <TrophyIcon className="size-4" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">PRIZE POOL</span>
                    </div>
                    <p className="text-base sm:text-lg font-mono font-bold text-white tracking-tight">₹50,000+ CASH</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-1">Cash Prizes &amp; Goodies</p>
                  </div>

                  <div className="relative group p-4 border border-[#152A54]/80 bg-[#060D1A]/70 backdrop-blur-md hover:border-blue-500/60 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]">
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-400/80" />
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                      <ClockIcon className="size-4" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">DURATION</span>
                    </div>
                    <p className="text-base sm:text-lg font-mono font-bold text-blue-400 tracking-tight">24-HOUR SPRINT</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-1">4 Evaluation Rounds</p>
                  </div>

                  <div className="relative group p-4 border border-[#152A54]/80 bg-[#060D1A]/70 backdrop-blur-md hover:border-blue-500/60 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]">
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-400/80" />
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                      <UsersIcon className="size-4" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">TEAM SIZE</span>
                    </div>
                    <p className="text-base sm:text-lg font-mono font-bold text-white tracking-tight">1–3 BUILDERS</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-1">Solo or Team Entry</p>
                  </div>

                  <div className="relative group p-4 border border-[#152A54]/80 bg-[#060D1A]/70 backdrop-blur-md hover:border-emerald-500/60 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-emerald-400/80" />
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                      <QrCodeIcon className="size-4" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">CHECK-IN</span>
                    </div>
                    <p className="text-base sm:text-lg font-mono font-bold text-emerald-400 tracking-tight">DIGITAL QR PASS</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-1">Instant Onsite Verification</p>
                  </div>

                </div>
              </div>

            </div>
          </main>
        </AsciiBackground>
      </div>

      {/* ═══════════════════════════════════════════════════════════
          LANDING PAGE SECTIONS
      ═══════════════════════════════════════════════════════════ */}
      <AboutSection />
      <EventsSection initialEvents={events} />
      <HowItWorksSection />
      <PrizesSection />
      <SponsorsSection />
      <FaqSection />
      <Footer />
    </div>
  );
}

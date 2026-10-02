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
          <main className="flex-1 flex flex-col items-center justify-center px-4 sm:px-6 lg:px-8 pt-8 pb-20 text-center z-10 my-auto">
            <div className="max-w-5xl mx-auto space-y-6">

              {/* Institutional Branding Banner */}
              <div className="space-y-1.5 pointer-events-auto">
                <div className="inline-flex flex-wrap items-center justify-center gap-1.5 sm:gap-2 px-3 py-1 border border-blue-500/30 bg-[#060D1A]/90 backdrop-blur-md">
                  <span className="font-mono text-[10px] sm:text-[11px] font-bold tracking-wider text-slate-300 uppercase">
                    Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College
                  </span>
                  <span className="text-blue-500 text-xs hidden sm:inline">•</span>
                  <span className="font-mono text-[10px] text-blue-400 font-semibold uppercase">
                    Autonomous • NBA • NAAC &apos;A&apos;
                  </span>
                </div>
                <div className="text-[11px] sm:text-xs font-mono text-slate-400 tracking-wide uppercase">
                  In Association with <span className="text-white font-semibold">Sri Vensy Technologies Pvt Ltd</span> &amp; <span className="text-white font-semibold">Business Intelligence Club</span>
                </div>
                <div className="text-[11px] sm:text-xs font-mono font-bold text-sky-400 tracking-wider uppercase">
                  Department of Computer Science and Business Systems
                </div>
              </div>

              {/* Live Hackathon Announcement Badge */}
              <div className="inline-flex items-center gap-2.5 px-3.5 py-1.5 border border-blue-500/50 bg-[#060D1A]/85 backdrop-blur-xl shadow-[0_0_20px_rgba(37,99,235,0.2)] hover:border-blue-400 transition-all pointer-events-auto">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full bg-blue-400 opacity-75" />
                  <span className="relative inline-flex h-2 w-2 bg-blue-500" />
                </span>
                <span className="font-mono text-[11px] sm:text-xs font-bold tracking-wider text-blue-400 uppercase">
                  NATIONAL LEVEL HACKATHON // 23 &amp; 24 OCTOBER 2026
                </span>
                <span className="hidden sm:inline-block text-blue-600">|</span>
                <span className="hidden sm:inline-flex items-center gap-1 font-mono text-[11px] text-emerald-400 font-bold uppercase">
                  ■ ENTRY FREE
                </span>
              </div>

              {/* Headline */}
              <div className="space-y-3">
                <h1 className="font-mono text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black tracking-tight text-white leading-[1.02] uppercase">
                  CODEHIVE 2K26{" "}
                  <span className="bg-gradient-to-r from-blue-400 via-sky-300 to-indigo-400 bg-clip-text text-transparent drop-shadow-[0_0_45px_rgba(59,130,246,0.6)]">
                    2.0
                  </span>
                </h1>
                <p className="font-mono text-sm sm:text-lg md:text-xl font-bold tracking-widest text-sky-400 uppercase">
                  IDEAS × CODE × IMPACT
                </p>
              </div>

              {/* Description */}
              <p className="text-xs sm:text-sm md:text-base text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans">
                A 2-day national hackathon featuring <span className="text-white font-semibold">TECH FORGE</span> and <span className="text-white font-semibold">AGENT VIBE</span>. Compete for the{" "}
                <span className="text-white font-mono font-bold whitespace-nowrap">₹20,000 Prize Pool</span> on{" "}
                <span className="text-sky-300 font-mono font-semibold">23 &amp; 24 October 2026</span> at{" "}
                <span className="text-slate-200 font-sans">Palani Murugan Hall of Fame</span>.
              </p>

              {/* CTA Buttons */}
              <div className="pt-1">
                <HeroActions />
              </div>

              {/* Stats Telemetry Grid */}
              <div className="pt-4 max-w-4xl mx-auto pointer-events-auto">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-left">

                  <div className="relative group p-4 border border-[#152A54]/80 bg-[#060D1A]/70 backdrop-blur-md hover:border-blue-500/60 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]">
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-400/80" />
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                      <TrophyIcon className="size-4" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">PRIZE POOL</span>
                    </div>
                    <p className="text-base sm:text-lg font-mono font-bold text-white tracking-tight">₹20,000 TOTAL</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-1">₹5K / ₹3K / ₹2K Per Track</p>
                  </div>

                  <div className="relative group p-4 border border-[#152A54]/80 bg-[#060D1A]/70 backdrop-blur-md hover:border-blue-500/60 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]">
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-400/80" />
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                      <ClockIcon className="size-4" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">SCHEDULE</span>
                    </div>
                    <p className="text-base sm:text-lg font-mono font-bold text-blue-400 tracking-tight">23 &amp; 24 OCT</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-1">8:30 AM – 3:30 PM Daily</p>
                  </div>

                  <div className="relative group p-4 border border-[#152A54]/80 bg-[#060D1A]/70 backdrop-blur-md hover:border-blue-500/60 transition-all hover:shadow-[0_0_20px_rgba(37,99,235,0.25)]">
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-r border-blue-400/80" />
                    <div className="flex items-center gap-2 text-blue-400 mb-1">
                      <UsersIcon className="size-4" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">REGISTRATION</span>
                    </div>
                    <p className="text-base sm:text-lg font-mono font-bold text-emerald-400 tracking-tight">100% FREE</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-1">Certificates For All</p>
                  </div>

                  <div className="relative group p-4 border border-[#152A54]/80 bg-[#060D1A]/70 backdrop-blur-md hover:border-emerald-500/60 transition-all hover:shadow-[0_0_20px_rgba(16,185,129,0.2)]">
                    <div className="absolute top-0 right-0 w-2 h-2 border-t border-emerald-400/80" />
                    <div className="flex items-center gap-2 text-emerald-400 mb-1">
                      <QrCodeIcon className="size-4" />
                      <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">VENUE</span>
                    </div>
                    <p className="text-base sm:text-lg font-mono font-bold text-white tracking-tight truncate">PALANI MURUGAN</p>
                    <p className="text-[11px] font-mono text-slate-500 mt-1 truncate">Hall of Fame, Vel Tech</p>
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

import { Header } from "@/components/header";
import { HeroAsciiTunnel } from "@/components/ui/hero-ascii-tunnel";
import { HeroActions } from "@/components/hero-actions";
import { AboutSection } from "@/components/home/about-section";
import { EventsSection } from "@/components/home/events-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { PrizesSection } from "@/components/home/prizes-section";
import { SponsorsSection } from "@/components/home/sponsors-section";
import { FaqSection } from "@/components/home/faq-section";
import { Footer } from "@/components/home/footer";
import { LocationSection } from "@/components/home/location-section";
import { getEvents } from "@/actions/event";

export default async function Home() {
  const result = await getEvents();
  const events = result.success ? result.data : [];

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white selection:bg-white selection:text-black font-sans overflow-x-hidden">
      {/* Top Sticky Navigation */}
      <Header />

      {/* ═══════════════════════════════════════════════════════════
          HERO — Dynamic ASCII Perspective Tunnel (Centered & Static)
      ═══════════════════════════════════════════════════════════ */}
      <HeroAsciiTunnel
        key="hero-ascii-stable"
        className="min-h-[calc(100vh-3.5rem)] flex items-center justify-center"
        contentClassName="max-w-5xl sm:max-w-6xl w-full px-4 text-center flex flex-col items-center justify-center"
      >
        {/* Live Hackathon Status Pill */}
        <div className="inline-flex items-center gap-2.5 px-3 py-1 border border-[#333333] bg-black/85 backdrop-blur-md">
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full bg-white opacity-75" />
            <span className="relative inline-flex h-2 w-2 bg-white" />
          </span>
          <span className="font-mono text-[11px] sm:text-xs font-bold tracking-wider text-white uppercase">
            23 &amp; 24 OCT 2026 // ENTRY FREE
          </span>
        </div>

        {/* Essential Hackathon Title & Tagline */}
        <div className="w-full space-y-3 text-center flex flex-col items-center justify-center">
          <h1 className="font-mono text-3xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight text-white leading-none uppercase whitespace-nowrap text-center mx-auto">
            CODEHIVE 2K26{" "}
            <span className="text-white drop-shadow-[0_0_35px_rgba(255,255,255,0.35)]">
              2.0
            </span>
          </h1>
          <p className="font-mono text-xs sm:text-sm md:text-base font-bold tracking-widest text-[#A3A3A3] uppercase text-center mx-auto">
            <span className="block sm:inline">IDEAS × CODE × IMPACT</span>
            <span className="hidden sm:inline mx-1.5">•</span>
            <span className="block sm:inline mt-1 sm:mt-0">₹20,000 PRIZE POOL</span>
          </p>
        </div>

        {/* Primary Call-to-Actions */}
        <div className="pt-2 flex justify-center items-center w-full">
          <HeroActions />
        </div>
      </HeroAsciiTunnel>

      {/* ═══════════════════════════════════════════════════════════
          LANDING PAGE SECTIONS
      ═══════════════════════════════════════════════════════════ */}
      <AboutSection />
      <EventsSection initialEvents={events} />
      <HowItWorksSection />
      <PrizesSection />
      <SponsorsSection />
      <FaqSection />
      <LocationSection />
      <Footer />
    </div>
  );
}

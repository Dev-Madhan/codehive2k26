import { Header } from "@/components/header";
import { HeroAsciiTunnel } from "@/components/ui/hero-ascii-tunnel";
import { HeroIntroWrapper } from "@/components/home/hero-intro-wrapper";
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
        <HeroIntroWrapper />
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

import { Header } from "@/components/header";
import { Hero5 } from "@/components/hero-5";
import { LogosSection } from "@/components/logos-section";
import { AboutSection } from "@/components/home/about-section";
import { EventsSection } from "@/components/home/events-section";
import { HowItWorksSection } from "@/components/home/how-it-works-section";
import { PrizesSection } from "@/components/home/prizes-section";
import { SponsorsSection } from "@/components/home/sponsors-section";
import { FaqSection } from "@/components/home/faq-section";
import { Footer } from "@/components/home/footer";
import { getEvents } from "@/actions/event";

export default async function Home() {
  const result = await getEvents();
  const events = result.success ? result.data : [];

  return (
    <div className="relative min-h-screen flex flex-col bg-background text-foreground selection:bg-blue-600 selection:text-foreground font-sans overflow-x-hidden">
      {/* Top Floating Navigation */}
      <Header spacer={false} />

      {/* ═══════════════════════════════════════════════════════════
          HERO 5 — @efferd/hero-5
      ═══════════════════════════════════════════════════════════ */}
      <main className="relative grow">
        <Hero5 />
        <LogosSection />
      </main>

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

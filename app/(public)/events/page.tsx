import { Header } from "@/components/header";
import { EventCard } from "@/components/events/event-card";
import { getEvents } from "@/actions/event";
import { cn } from "@/lib/utils";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EventsPage() {
  const result = await getEvents();
  const rawEvents = result.success ? result.data : [];

  // Sort so TECH FORGE is first, then AGENT VIBE
  const events = [...rawEvents].sort((a, b) => {
    if (a.slug?.includes("techforge")) return -1;
    if (b.slug?.includes("techforge")) return 1;
    return 0;
  });

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-16 space-y-10">
        {/* Terminal Header & Status Strip */}
        <div className="border-b border-[#262626] pb-8 flex flex-col md:flex-row md:items-end justify-between gap-6">
          <div className="space-y-3 max-w-3xl">
            <div className="flex items-center gap-2">
              <div className="h-px w-6 bg-white" />
              <span className="font-mono text-[11px] uppercase tracking-widest text-[#737373]">
                // DIRECTORY // EVENTS &amp; TRACKS
              </span>
            </div>
            
            <h1 className="font-mono text-3xl sm:text-5xl font-black uppercase tracking-tight text-white leading-tight">
              SELECT YOUR TRACK<span className="inline-block animate-pulse text-white">_</span>
            </h1>

            <p className="text-neutral-400 text-xs sm:text-sm font-sans leading-relaxed">
              Explore our two flagship hackathon tracks: TECH FORGE and AGENT VIBE. Free registration, 4 exciting rounds, and ₹20,000 in cash prizes.
            </p>
          </div>

          {/* Quick Telemetry Pills */}
          <div className="flex flex-wrap items-center gap-2 text-xs font-mono shrink-0">
            <div className="border border-[#262626] bg-[#0A0A0A] px-3 py-1.5">
              <span className="text-[#737373] mr-2">TRACKS:</span>
              <span className="font-bold text-white">{events.length || 2} ACTIVE</span>
            </div>
            <div className="border border-[#262626] bg-[#0A0A0A] px-3 py-1.5">
              <span className="text-[#737373] mr-2">ENTRY:</span>
              <span className="font-bold text-white">100% FREE</span>
            </div>
            <div className="border border-[#262626] bg-[#0A0A0A] px-3 py-1.5">
              <span className="text-[#737373] mr-2">PRIZES:</span>
              <span className="font-bold text-white">₹20,000</span>
            </div>
          </div>
        </div>

        {/* Events Grid */}
        {events.length === 0 ? (
          <div className="border border-[#262626] bg-[#0A0A0A] p-12 text-center space-y-3 font-mono">
            <h3 className="text-base font-bold text-white">[ NO ACTIVE TRACKS RECORDED ]</h3>
            <p className="text-xs text-neutral-400">
              Registrations are preparing to open. Please check back shortly.
            </p>
          </div>
        ) : (
          <div
            className={cn(
              "grid gap-6 lg:gap-8 items-stretch",
              events.length <= 2
                ? "grid-cols-1 lg:grid-cols-2"
                : "grid-cols-1 md:grid-cols-2 lg:grid-cols-3"
            )}
          >
            {events.map((event) => (
              <EventCard key={event.id} event={event as any} />
            ))}
          </div>
        )}
      </main>
    </div>
  );
}

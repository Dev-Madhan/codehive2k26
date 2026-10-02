import { Header } from "@/components/header";
import { EventCard } from "@/components/events/event-card";
import { getEvents } from "@/actions/event";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function EventsPage() {
  const result = await getEvents();
  const events = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 space-y-8">
        {/* Terminal Header & Status Strip (Reference Image 1 layout) */}
        <div className="border-b border-[#152A54] pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
          <div className="space-y-1.5">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 font-mono text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30">
              &gt; registry / events
            </div>
            <h1 className="text-3xl sm:text-4xl font-bold tracking-tight font-sans text-white">
              Events &amp; Challenges
            </h1>
            <p className="text-slate-300 text-xs sm:text-sm font-sans max-w-2xl">
              Explore and register for TECH FORGE and AGENT VIBE at CodeHive 2K26 2.0. Entry is 100% Free with Certificates for all participants.
            </p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono">
            <div className="border border-[#152A54] bg-[#060D1A] px-3 py-1.5">
              <span className="text-slate-500 uppercase mr-2">TOTAL:</span>
              <span className="font-bold text-blue-400">{events.length} EVENTS</span>
            </div>
            <div className="border border-[#152A54] bg-[#060D1A] px-3 py-1.5">
              <span className="text-slate-500 uppercase mr-2">STATUS:</span>
              <span className="font-bold text-white">ACTIVE</span>
            </div>
          </div>
        </div>

        {events.length === 0 ? (
          <div className="rounded-none border border-[#152A54] bg-[#060D1A] p-12 text-center space-y-3">
            <h3 className="text-base font-mono font-bold text-white">No active events recorded</h3>
            <p className="text-xs font-mono text-slate-400">
              Check back soon! Event registrations will open shortly.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {events.map((event) => (
              <EventCard key={event.id} event={event as any} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

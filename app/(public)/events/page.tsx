import { Header } from "@/components/header";
import { EventCard } from "@/components/events/event-card";
import { getEvents } from "@/actions/event";

export default async function EventsPage() {
  const result = await getEvents();
  const events = result.success ? result.data : [];

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="max-w-6xl mx-auto px-4 py-12 space-y-8">
        <div className="space-y-2">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">Events & Competitions</h1>
          <p className="text-muted text-base max-w-2xl">
            Explore and register for technical symposiums, hackathons, workshops, and challenges at CodeHive 2K26.
          </p>
        </div>

        {events.length === 0 ? (
          <div className="rounded-xl border border-border bg-surface p-12 text-center space-y-3">
            <h3 className="text-lg font-semibold text-foreground">No events found</h3>
            <p className="text-sm text-muted">
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

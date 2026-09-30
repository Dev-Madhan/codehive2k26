import { Header } from "@/components/header";
import { getEventBySlug } from "@/actions/event";
import { RegistrationForm } from "@/components/registration/registration-form";
import { formatDate } from "@/utils/formatters";
import { notFound } from "next/navigation";
import { CalendarIcon, MapPinIcon, UsersIcon } from "lucide-react";

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EventDetailPage({ params }: Props) {
  const { slug } = await params;
  const result = await getEventBySlug(slug);

  if (!result.success) {
    notFound();
  }

  const event = result.data as any;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="max-w-5xl mx-auto px-4 py-12 space-y-10">
        <div className="space-y-4">
          <div className="inline-flex text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/20 text-cyan border border-primary/30">
            {event.category?.name || "Event"}
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-foreground">
            {event.name}
          </h1>
          <p className="text-base sm:text-lg text-muted max-w-3xl leading-relaxed">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-6 pt-4 text-sm text-muted-dark border-t border-border">
            <div className="flex items-center gap-2">
              <CalendarIcon className="size-4 text-cyan" />
              <span>{formatDate(event.startAt)}</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPinIcon className="size-4 text-mint" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-2">
              <UsersIcon className="size-4 text-primary" />
              <span>Capacity: {event.capacity} seats</span>
            </div>
          </div>
        </div>

        <div className="pt-6">
          <h2 className="text-2xl font-bold mb-4">Register for this Event</h2>
          <RegistrationForm eventId={event.id} eventName={event.name} />
        </div>
      </div>
    </div>
  );
}

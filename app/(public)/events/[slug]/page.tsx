import Link from "next/link";
import { Header } from "@/components/header";
import { getEventBySlug } from "@/actions/event";
import { RegistrationForm } from "@/components/registration/registration-form";
import { EventInstructions } from "@/components/events/event-instructions";
import { formatDate } from "@/utils/formatters";
import { notFound } from "next/navigation";
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowLeftIcon } from "lucide-react";

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
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-5xl mx-auto px-3 sm:px-6 py-6 sm:py-10 space-y-5 sm:space-y-8">
        {/* Navigation & Back Button */}
        <div className="flex items-center justify-between border-b border-[#152A54] pb-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-slate-300 bg-[#060D1A] border border-[#152A54] hover:text-blue-400 hover:border-blue-500/60 hover:bg-[#081224] transition-all duration-150"
          >
            <ArrowLeftIcon className="size-3.5 text-blue-400" />
            <span>Back to Events</span>
          </Link>
        </div>

        {/* Event Header Banner */}
        <div className="space-y-4 border border-[#152A54] bg-[#060D1A] p-4 sm:p-8">
          <div className="inline-flex text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-none bg-blue-600/15 text-blue-400 border border-blue-500/30">
            {event.category?.name || "Event"}
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight font-sans text-white">
            {event.name}
          </h1>
          <p className="text-xs sm:text-sm font-sans text-slate-300 max-w-3xl leading-relaxed">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-3.5 sm:gap-6 pt-4 text-xs text-slate-300 border-t border-[#152A54]">
            <div className="flex items-center gap-2 font-mono">
              <CalendarIcon className="size-4 text-blue-400 shrink-0" />
              <span>{formatDate(event.startAt)}</span>
            </div>
            <div className="flex items-center gap-2 font-sans">
              <MapPinIcon className="size-4 text-blue-400 shrink-0" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <UsersIcon className="size-4 text-blue-400 shrink-0" />
              <span>Capacity: {event.capacity} seats</span>
            </div>
          </div>
        </div>

        {/* Event Instructions Section (Modular, Slug-Based) */}
        <EventInstructions slug={slug} eventName={event.name} />

        {/* Registration Section */}
        <div className="border border-[#152A54] bg-[#060D1A] p-4 sm:p-8">
          <div className="border-b border-[#152A54] pb-4 mb-6">
            <h2 className="text-base sm:text-lg font-sans font-bold text-white uppercase tracking-wider">
              Event Registration Portal
            </h2>
            <p className="text-xs font-sans text-slate-300 mt-1">
              Complete your identity verification and secure your seat.
            </p>
          </div>
          <RegistrationForm
            eventId={event.id}
            eventName={event.name}
            minTeamSize={event.minTeamSize}
            maxTeamSize={event.maxTeamSize}
          />
        </div>
      </div>
    </div>
  );
}


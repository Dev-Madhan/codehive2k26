import Link from "next/link";
import { Header } from "@/components/header";
import { getEventBySlug } from "@/actions/event";
import { RegistrationForm } from "@/components/registration/registration-form";
import { EventInstructions } from "@/components/events/event-instructions";
import { formatDate } from "@/utils/formatters";
import { notFound } from "next/navigation";
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowLeftIcon } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

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
        <div className="flex items-center justify-between border-b border-[#262626] pb-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-3.5 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 bg-[#0F0F0F] border border-[#262626] hover:text-white hover:border-[#404040] hover:bg-[#161616] transition-all duration-150"
          >
            <ArrowLeftIcon className="size-3.5 text-white" />
            <span>Back to Events</span>
          </Link>
        </div>

        {/* Event Header Banner */}
        <div className="space-y-4 border border-[#262626] bg-[#0F0F0F] p-4 sm:p-8">
          <div className="inline-flex text-[11px] font-mono font-bold uppercase tracking-wider px-2.5 py-0.5 rounded-none bg-[#161616] text-white border border-[#262626]">
            {event.category?.name || "Event"}
          </div>
          <h1 className="text-2xl sm:text-4xl font-bold tracking-tight font-sans text-white">
            {event.name}
          </h1>
          <p className="text-xs sm:text-sm font-sans text-neutral-400 max-w-3xl leading-relaxed">
            {event.description}
          </p>

          <div className="flex flex-wrap gap-3.5 sm:gap-6 pt-4 text-xs text-neutral-300 border-t border-[#262626]">
            <div className="flex items-center gap-2 font-mono">
              <CalendarIcon className="size-4 text-white shrink-0" />
              <span>{formatDate(event.startAt)}</span>
            </div>
            <div className="flex items-center gap-2 font-sans">
              <MapPinIcon className="size-4 text-white shrink-0" />
              <span>{event.venue}</span>
            </div>
            <div className="flex items-center gap-2 font-mono">
              <UsersIcon className="size-4 text-white shrink-0" />
              <span>Entries: Unlimited</span>
            </div>
          </div>
        </div>

        {/* Event Instructions Section (Modular, Slug-Based) */}
        <EventInstructions slug={slug} eventName={event.name} />

        {/* Registration Section */}
        <div className="border border-[#262626] bg-[#0F0F0F] p-4 sm:p-8">
          <div className="border-b border-[#262626] pb-4 mb-6">
            <h2 className="text-base sm:text-lg font-sans font-bold text-white uppercase tracking-wider">
              Event Registration Portal
            </h2>
            <p className="text-xs font-sans text-neutral-400 mt-1">
              Complete your identity verification and generate your event pass.
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


import Link from "next/link";
import { Header } from "@/components/header";
import { getEventBySlug } from "@/actions/event";
import { EventInstructions } from "@/components/events/event-instructions";
import { EventGateLiveBadge } from "@/components/events/event-gate-live-badge";
import { EventRegistrationPortalLive } from "@/components/events/event-registration-portal-live";
import { formatDate } from "@/utils/formatters";
import { notFound } from "next/navigation";
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowLeftIcon, TicketIcon } from "lucide-react";

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
  const isRegistrationOpen =
    event.registrationOpen !== false &&
    event.status !== "REGISTRATION_CLOSED" &&
    new Date() <= new Date(event.registrationDeadline);

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />
      
      <main className="max-w-5xl mx-auto px-3 sm:px-6 py-4 sm:py-10 space-y-4 sm:space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-[#262626] pb-3 sm:pb-4 gap-2">
          <Link
            href="/events"
            className="inline-flex items-center gap-1.5 sm:gap-2 px-2.5 sm:px-3 py-1.5 text-[11px] sm:text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 bg-[#0A0A0A] border border-[#262626] hover:text-white hover:border-[#404040] hover:bg-[#141414] transition-all duration-150"
          >
            <ArrowLeftIcon className="size-3.5 text-white shrink-0" />
            <span className="hidden sm:inline">[ Back to Events ]</span>
            <span className="sm:hidden">[ Events ]</span>
          </Link>

          <EventGateLiveBadge initialIsOpen={isRegistrationOpen} eventSlug={slug} />
        </div>

        {/* Event Header Banner */}
        <div className="relative border border-[#262626] bg-[#0A0A0A] p-3.5 sm:p-7 md:p-8">
          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-t border-r border-[#333333] pointer-events-none !m-0" />
          <div className="absolute bottom-0 left-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-b border-l border-[#333333] pointer-events-none !m-0" />

          <div className="space-y-3.5 sm:space-y-6">
            <div className="space-y-1.5 sm:space-y-3">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex font-mono text-[9px] sm:text-[11px] uppercase tracking-wider px-2 py-0.5 bg-[#141414] text-neutral-300 border border-[#262626]">
                  [ {event.category?.name || "TRACK"} ]
                </span>
                <span className="inline-flex font-mono text-[9px] sm:text-[11px] uppercase tracking-wider px-2 py-0.5 bg-[#141414] text-neutral-300 border border-[#262626] items-center gap-1">
                  <MapPinIcon className="size-3 text-neutral-400" />
                  <span className="sm:hidden" title="Vel Tech Multi Tech (VTMT)">VTMT</span>
                  <span className="hidden sm:inline">Vel Tech Multi Tech</span>
                </span>
              </div>
              
              <h1 className="text-xl sm:text-4xl md:text-5xl font-mono font-black uppercase tracking-tight text-white leading-tight break-words">
                {event.name}
              </h1>

              <p className="text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed font-sans line-clamp-2 sm:line-clamp-none">
                {event.description}
              </p>
            </div>

            {/* Mobile Compact HUD Quick Specs */}
            <div className="sm:hidden flex flex-wrap items-center gap-1.5 pt-2.5 border-t border-[#262626] text-[10px] font-mono">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#141414] border border-[#262626] text-white">
                <CalendarIcon className="size-3 text-neutral-400" />
                <span>{formatDate(event.startAt)}</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#141414] border border-[#262626] text-white">
                <UsersIcon className="size-3 text-neutral-400" />
                <span>
                  {event.minTeamSize === event.maxTeamSize
                    ? `Team of ${event.minTeamSize}`
                    : `${event.minTeamSize}-${event.maxTeamSize} Builders`}
                </span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 font-bold">
                <TicketIcon className="size-3 text-emerald-400" />
                <span>100% FREE</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-[#141414] border border-[#262626] text-neutral-300">
                <MapPinIcon className="size-3 text-neutral-400" />
                <span title="Vel Tech Multi Tech (VTMT)">VTMT</span>
              </span>
            </div>

            {/* Desktop Quick Specs Grid */}
            <div className="hidden sm:grid sm:grid-cols-4 gap-2 pt-3 sm:pt-4 border-t border-[#262626] text-xs font-mono">
              <div className="bg-[#121212] border border-[#1f1f1f] p-2.5 sm:p-3 space-y-1">
                <span className="text-[9px] sm:text-[10px] text-[#737373] uppercase tracking-wider block font-mono">
                  // DATE
                </span>
                <span className="font-bold text-white text-[11px] sm:text-xs flex items-center gap-1.5 min-w-0">
                  <CalendarIcon className="size-3 text-neutral-400 shrink-0" />
                  <span className="truncate">{formatDate(event.startAt)}</span>
                </span>
              </div>

              <div className="bg-[#121212] border border-[#1f1f1f] p-2.5 sm:p-3 space-y-1">
                <span className="text-[9px] sm:text-[10px] text-[#737373] uppercase tracking-wider block font-mono">
                  // TEAM SIZE
                </span>
                <span className="font-bold text-white text-[11px] sm:text-xs flex items-center gap-1.5 min-w-0">
                  <UsersIcon className="size-3 text-neutral-400 shrink-0" />
                  <span className="truncate">
                    {event.minTeamSize === event.maxTeamSize
                      ? `Team of ${event.minTeamSize}`
                      : `${event.minTeamSize}-${event.maxTeamSize} Builders`}
                  </span>
                </span>
              </div>

              <div className="bg-[#121212] border border-[#1f1f1f] p-2.5 sm:p-3 space-y-1">
                <span className="text-[9px] sm:text-[10px] text-[#737373] uppercase tracking-wider block font-mono">
                  // ADMISSION
                </span>
                <span className="font-bold text-emerald-400 text-[11px] sm:text-xs flex items-center gap-1.5 min-w-0">
                  <TicketIcon className="size-3 text-emerald-400 shrink-0" />
                  <span>100% FREE</span>
                </span>
              </div>

              <div className="bg-[#121212] border border-[#1f1f1f] p-2.5 sm:p-3 space-y-1">
                <span className="text-[9px] sm:text-[10px] text-[#737373] uppercase tracking-wider block font-mono">
                  // VENUE
                </span>
                <span
                  className="font-bold text-white text-[10px] sm:text-xs flex items-center gap-1.5 min-w-0"
                  title={
                    event.venue && !event.venue.includes("Vel Tech")
                      ? `${event.venue} • Vel Tech Multi Tech`
                      : (event.venue || "Vel Tech Multi Tech")
                  }
                >
                  <MapPinIcon className="size-3 text-neutral-400 shrink-0" />
                  <span className="truncate">
                    {event.venue && !event.venue.includes("Vel Tech")
                      ? `${event.venue} • Vel Tech Multi Tech`
                      : (event.venue || "Vel Tech Multi Tech")}
                  </span>
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Event Instructions Section (Modular, Slug-Based) */}
        <EventInstructions slug={slug} eventName={event.name} />

        {/* Registration Section */}
        <div id="register" className="relative border border-[#262626] bg-[#0A0A0A] p-3.5 sm:p-7 md:p-8 scroll-mt-14 sm:scroll-mt-20">
          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-t border-r border-[#333333] pointer-events-none !m-0" />
          <div className="absolute bottom-0 left-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-b border-l border-[#333333] pointer-events-none !m-0" />

          <EventRegistrationPortalLive
            initialIsOpen={isRegistrationOpen}
            eventId={event.id}
            eventName={event.name}
            eventSlug={slug}
            minTeamSize={event.minTeamSize}
            maxTeamSize={event.maxTeamSize}
          />
        </div>
      </main>
    </div>
  );
}


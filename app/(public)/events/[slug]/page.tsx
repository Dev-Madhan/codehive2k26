import Link from "next/link";
import { Header } from "@/components/header";
import { getEventBySlug } from "@/actions/event";
import { RegistrationForm } from "@/components/registration/registration-form";
import { EventInstructions } from "@/components/events/event-instructions";
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

  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Header />
      
      <main className="max-w-5xl mx-auto px-4 sm:px-6 py-8 sm:py-12 space-y-8">
        {/* Navigation Bar */}
        <div className="flex items-center justify-between border-b border-[#262626] pb-4">
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-3 py-1.5 text-xs font-mono font-bold uppercase tracking-wider text-neutral-300 bg-[#0A0A0A] border border-[#262626] hover:text-white hover:border-[#404040] hover:bg-[#141414] transition-all duration-150"
          >
            <ArrowLeftIcon className="size-3.5 text-white" />
            <span>[ Back to Events ]</span>
          </Link>

          <div className="flex items-center gap-2 font-mono text-[11px] text-emerald-400 font-bold">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>OPEN // FREE ENTRY</span>
          </div>
        </div>

        {/* Event Header Banner */}
        <div className="relative border border-[#262626] bg-[#0A0A0A] p-6 sm:p-8 space-y-6">
          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#333333]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#333333]" />

          <div className="space-y-3">
            <div className="inline-flex font-mono text-[11px] uppercase tracking-wider px-2 py-0.5 bg-[#141414] text-neutral-300 border border-[#262626]">
              [ {event.category?.name || "TRACK"} ]
            </div>
            
            <h1 className="text-3xl sm:text-5xl font-mono font-black uppercase tracking-tight text-white leading-tight">
              {event.name}
            </h1>

            <p className="text-xs sm:text-sm text-neutral-400 max-w-3xl leading-relaxed font-sans">
              {event.description}
            </p>
          </div>

          {/* Quick Specs Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-4 border-t border-[#262626] text-xs font-mono">
            <div className="bg-[#121212] border border-[#1f1f1f] p-3 space-y-1">
              <span className="text-[10px] text-[#737373] uppercase tracking-wider block">
                // DATE
              </span>
              <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                <CalendarIcon className="size-3 text-neutral-400 shrink-0" />
                {formatDate(event.startAt)}
              </span>
            </div>

            <div className="bg-[#121212] border border-[#1f1f1f] p-3 space-y-1">
              <span className="text-[10px] text-[#737373] uppercase tracking-wider block">
                // TEAM SIZE
              </span>
              <span className="font-bold text-white text-[11px] flex items-center gap-1.5">
                <UsersIcon className="size-3 text-neutral-400 shrink-0" />
                {event.minTeamSize === event.maxTeamSize
                  ? `Team of ${event.minTeamSize}`
                  : `${event.minTeamSize}-${event.maxTeamSize} Builders`}
              </span>
            </div>

            <div className="bg-[#121212] border border-[#1f1f1f] p-3 space-y-1">
              <span className="text-[10px] text-[#737373] uppercase tracking-wider block">
                // ADMISSION
              </span>
              <span className="font-bold text-emerald-400 text-[11px] flex items-center gap-1.5">
                <TicketIcon className="size-3 text-emerald-400 shrink-0" />
                100% FREE
              </span>
            </div>

            <div className="bg-[#121212] border border-[#1f1f1f] p-3 space-y-1">
              <span className="text-[10px] text-[#737373] uppercase tracking-wider block">
                // VENUE
              </span>
              <span className="font-bold text-white text-[11px] flex items-center gap-1.5 truncate" title={event.venue}>
                <MapPinIcon className="size-3 text-neutral-400 shrink-0" />
                {event.venue}
              </span>
            </div>
          </div>
        </div>

        {/* Event Instructions Section (Modular, Slug-Based) */}
        <EventInstructions slug={slug} eventName={event.name} />

        {/* Registration Section */}
        <div className="relative border border-[#262626] bg-[#0A0A0A] p-6 sm:p-8 space-y-6">
          {/* Corner accents */}
          <div className="absolute top-0 right-0 w-3 h-3 border-t border-r border-[#333333]" />
          <div className="absolute bottom-0 left-0 w-3 h-3 border-b border-l border-[#333333]" />

          <div className="border-b border-[#262626] pb-4">
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#737373]">
              // STEP 02
            </span>
            <h2 className="text-xl sm:text-2xl font-mono font-black text-white uppercase tracking-tight mt-1">
              REGISTRATION PORTAL
            </h2>
            <p className="text-xs text-neutral-400 font-sans mt-1">
              Register your team members and secure your team event pass.
            </p>
          </div>
          
          <RegistrationForm
            eventId={event.id}
            eventName={event.name}
            minTeamSize={event.minTeamSize}
            maxTeamSize={event.maxTeamSize}
          />
        </div>
      </main>
    </div>
  );
}


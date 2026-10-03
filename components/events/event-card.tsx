import Link from "next/link";
import { Event } from "@prisma/client";
import { formatDate } from "@/utils/formatters";
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowRightIcon } from "lucide-react";

interface EventCardProps {
  event: Event & {
    category?: { name: string } | null;
    _count?: { registrations: number };
  };
}

export function EventCard({ event }: EventCardProps) {
  return (
    <div className="group relative rounded-none border border-[#152A54] bg-[#060D1A] hover:bg-[#081224] p-6 transition-all duration-200 hover:border-blue-500/70 hover:shadow-lg hover:shadow-blue-950/40 flex flex-col justify-between">
      <div className="space-y-4">
        {/* Category & Status Bar */}
        <div className="flex items-center justify-between">
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-none bg-blue-600/15 text-blue-400 border border-blue-500/30">
            [ {event.category?.name || "General"} ]
          </span>
          <span className="font-mono text-[11px] font-semibold uppercase tracking-wider px-2.5 py-0.5 rounded-none border bg-blue-600/20 text-blue-300 border-blue-500/40">
            [ OPEN ]
          </span>
        </div>

        {/* Title & Description */}
        <div>
          <h3 className="text-lg font-sans font-bold text-white group-hover:text-blue-400 transition-colors tracking-tight">
            {event.name}
          </h3>
          <p className="mt-2 text-xs font-sans text-slate-300 line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        {/* Event Metadata (Reference Image 1 style) */}
        <div className="space-y-2 text-xs text-slate-400 pt-3 border-t border-[#152A54]">
          <div className="flex items-center gap-2 font-mono">
            <CalendarIcon className="size-3.5 text-blue-400 shrink-0" />
            <span>{formatDate(event.startAt)}</span>
          </div>
          <div className="flex items-center gap-2 font-sans text-slate-300">
            <MapPinIcon className="size-3.5 text-blue-400 shrink-0" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2 font-mono">
            <UsersIcon className="size-3.5 text-blue-400 shrink-0" />
            <span>Entries: Unlimited</span>
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="pt-6">
        <Link
          href={`/events/${event.slug}`}
          className="w-full inline-flex items-center justify-center gap-2 h-10 font-mono text-xs uppercase tracking-wider font-bold rounded-none bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 transition-colors shadow-sm"
        >
          [ View Event Details ]
          <ArrowRightIcon className="size-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default EventCard;

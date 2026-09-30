import Link from "next/link";
import { Event } from "@prisma/client";
import { formatDate } from "@/utils/formatters";
import { CalendarIcon, MapPinIcon, UsersIcon, ArrowRightIcon } from "lucide-react";
import { Button } from "@/components/ui/button";

interface EventCardProps {
  event: Event & {
    category?: { name: string } | null;
    _count?: { registrations: number };
  };
}

export function EventCard({ event }: EventCardProps) {
  const registered = event._count?.registrations ?? 0;
  const isFull = registered >= event.capacity;

  return (
    <div className="group relative rounded-xl border border-border bg-surface p-6 transition-all duration-300 hover:border-cyan/50 hover:shadow-lg hover:shadow-cyan/5 flex flex-col justify-between">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-primary/20 text-cyan border border-primary/30">
            {event.category?.name || "General"}
          </span>
          <span
            className={`text-xs px-2.5 py-1 rounded-full border ${
              isFull
                ? "bg-error/10 text-error border-error/30"
                : "bg-success/10 text-success border-success/30"
            }`}
          >
            {isFull ? "Event Full" : "Open"}
          </span>
        </div>

        <div>
          <h3 className="text-xl font-bold text-foreground group-hover:text-cyan transition-colors">
            {event.name}
          </h3>
          <p className="mt-2 text-sm text-muted line-clamp-2 leading-relaxed">
            {event.description}
          </p>
        </div>

        <div className="space-y-2 text-xs text-muted-dark pt-2 border-t border-border/50">
          <div className="flex items-center gap-2">
            <CalendarIcon className="size-3.5 text-cyan" />
            <span>{formatDate(event.startAt)}</span>
          </div>
          <div className="flex items-center gap-2">
            <MapPinIcon className="size-3.5 text-mint" />
            <span>{event.venue}</span>
          </div>
          <div className="flex items-center gap-2">
            <UsersIcon className="size-3.5 text-primary" />
            <span>
              {registered} / {event.capacity} Registered
            </span>
          </div>
        </div>
      </div>

      <div className="pt-6">
        <Button
          className="w-full gap-2 border-2 border-primary bg-primary hover:bg-primary-hover text-white shadow-none"
          render={<Link href={`/events/${event.slug}`} />}
          nativeButton={false}
        >
          View Details
          <ArrowRightIcon className="size-4" />
        </Button>
      </div>
    </div>
  );
}

export default EventCard;

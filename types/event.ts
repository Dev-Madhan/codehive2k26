import { Event, EventCategory, EventStatus } from "@prisma/client";

export type { Event, EventCategory, EventStatus };

export interface EventWithCategory extends Event {
  category: EventCategory | null;
  _count?: {
    registrations: number;
  };
}

export interface EventListItem {
  id: string;
  name: string;
  slug: string;
  description: string;
  venue: string;
  startAt: Date;
  endAt: Date;
  capacity: number;
  registeredCount: number;
  isFull: boolean;
  registrationOpen: boolean;
  registrationDeadline: Date;
  status: EventStatus;
  posterUrl?: string | null;
  categoryName?: string;
  isTeamEvent: boolean;
}

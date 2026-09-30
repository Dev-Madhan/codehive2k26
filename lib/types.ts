export type EventCategory = 
  | 'All'
  | 'Hackathon & Coding'
  | 'AI & Robotics'
  | 'Web3 & Security'
  | 'Design & Creative'
  | 'Gaming & Non-Tech'
  | 'Workshops';

export interface EventItem {
  id: string;
  name: string;
  slug: string;
  category: EventCategory;
  tagline: string;
  description: string;
  venue: string;
  startAt: string;
  endAt: string;
  date: string;
  capacity: number;
  registeredCount: number;
  teamSize: string;
  prizePool: string;
  entryFee: string;
  coordinators: { name: string; phone: string }[];
  rules: string[];
  tags: string[];
  bannerUrl?: string;
  isFlagship?: boolean;
}

export type RegistrationStatus = 'CONFIRMED' | 'PENDING' | 'CHECKED_IN' | 'CANCELLED';

export interface Participant {
  name: string;
  email: string;
  phone: string;
  college: string;
  department: string;
  year: string;
  avatarUrl?: string;
}

export interface Registration {
  id: string;
  registrationNumber: string; // Format: CH26-XXXXXX
  participant: Participant;
  eventId: string;
  eventName: string;
  teamName?: string;
  teamMembers?: string[];
  registeredAt: string;
  status: RegistrationStatus;
  checkedInAt?: string;
  checkedInBy?: string;
  qrPayload: string;
}

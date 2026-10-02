import { Registration, RegistrationStatus, PaymentStatus } from "@prisma/client";

export type { Registration, RegistrationStatus, PaymentStatus };

export interface RegistrationDetails {
  id: string;
  registrationNumber: string;
  status: RegistrationStatus;
  paymentStatus: PaymentStatus;
  checkedIn: boolean;
  qrToken: string;
  qrDataUrl?: string;
  transportOptIn?: boolean;
  samePickupForTeam?: boolean;
  pickupRoute?: string | null;
  pickupStop?: string | null;
  pickupLandmark?: string | null;
  passengersCount?: number;
  team?: {
    name: string;
    members: Array<{
      id: string;
      name: string;
      phone: string;
      transportOptIn?: boolean;
      pickupRoute?: string | null;
      pickupStop?: string | null;
      pickupLandmark?: string | null;
    }>;
  } | null;
  createdAt: Date;
  event: {
    id: string;
    name: string;
    slug: string;
    venue: string;
    startAt: Date;
    endAt: Date;
  };
  participant: {
    id: string;
    name: string;
    email: string;
    phone: string;
    college: string;
    department: string;
    year: string;
  };
}

export interface CheckInResult {
  registrationNumber: string;
  participantName: string;
  eventName: string;
  checkedInAt: Date;
  alreadyCheckedIn?: boolean;
  teamName?: string | null;
  college?: string;
  department?: string;
  teamMembers?: string[];
}

export interface RegistrationSuccessPayload {
  registrationNumber: string;
  qrToken: string;
  qrDataUrl: string;
  eventName: string;
  eventSlug: string;
  venue: string;
  date: string;
  teamName?: string | null;
  leaderName: string;
  leaderEmail: string;
  leaderPhone: string;
  college: string;
  department: string;
  year: string;
  transportOptIn: boolean;
  samePickupForTeam: boolean;
  pickupRoute?: string | null;
  pickupStop?: string | null;
  pickupLandmark?: string | null;
  passengersCount: number;
  teamMembers: Array<{
    name: string;
    phone: string;
    transportOptIn?: boolean;
    pickupRoute?: string | null;
    pickupStop?: string | null;
    pickupLandmark?: string | null;
  }>;
  confirmedAt: string;
}

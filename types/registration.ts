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
}

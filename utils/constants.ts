export const APP_NAME = "CodeHive 2K26";
export const APP_DESCRIPTION = "The premier college symposium & hackathon platform.";

export const EVENT_STATUS_LABELS = {
  DRAFT: "Draft",
  PUBLISHED: "Upcoming",
  REGISTRATION_OPEN: "Registration Open",
  REGISTRATION_CLOSED: "Registration Closed",
  EVENT_COMPLETED: "Completed",
} as const;

export const REGISTRATION_STATUS_BADGES = {
  PENDING: "bg-warning/10 text-warning border-warning/30",
  CONFIRMED: "bg-success/10 text-success border-success/30",
  CANCELLED: "bg-error/10 text-error border-error/30",
  ATTENDED: "bg-white/10 text-white border-white/40",
} as const;

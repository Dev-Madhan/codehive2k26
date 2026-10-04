export interface EventCommunity {
  name: string;
  whatsappInviteUrl: string;
}

const EVENT_COMMUNITIES: Record<string, EventCommunity> = {
  "agentvibe-2026": {
    name: "AgentVibe",
    whatsappInviteUrl: "https://chat.whatsapp.com/Fc4sQ0GA47E1Iu0P8ClWtP",
  },
  "techforge-2026": {
    name: "Tech Forge",
    whatsappInviteUrl: "https://chat.whatsapp.com/JatQzvg3aFw6m1E4lxGIKs",
  },
};

export function getEventCommunity(eventSlug: string): EventCommunity | null {
  return EVENT_COMMUNITIES[eventSlug] ?? null;
}

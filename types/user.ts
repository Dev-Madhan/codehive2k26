import { Role, User, Participant } from "@prisma/client";

export type { Role, User, Participant };

export interface UserProfile extends User {
  participant?: Participant | null;
}

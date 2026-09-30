import { z } from "zod";

export const registrationSchema = z.object({
  eventId: z.string().min(1, "Event is required"),
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Invalid email address"),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit Indian mobile number"),
  college: z.string().min(2, "College name is required").max(150),
  department: z.string().min(2, "Department is required").max(100),
  year: z.string().min(1, "Academic year is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  // Team details if applicable
  isTeam: z.boolean().default(false),
  teamName: z.string().min(2).max(50).optional(),
  teamMemberEmails: z.array(z.string().email()).optional(),
});

export type RegistrationInput = z.infer<typeof registrationSchema>;

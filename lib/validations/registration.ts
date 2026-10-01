import { z } from "zod";

const indianPhoneRegex = /^[6-9]\d{9}$/;

// Team member sub-schema (for additional members beyond the leader)
const teamMemberSchema = z.object({
  name: z.string().min(2, "Member name must be at least 2 characters").max(100),
  phone: z
    .string()
    .regex(indianPhoneRegex, "Must be a valid 10-digit Indian mobile number"),
});

export const registrationSchema = z
  .object({
    eventId: z.string().min(1, "Event is required"),
    // Team configuration
    teamSize: z.enum(["1", "2", "3"]),
    teamName: z.string().min(2, "Team name must be at least 2 characters").max(50).optional(),
    // Leader details
    name: z.string().min(2, "Name must be at least 2 characters").max(100),
    email: z.string().email("Invalid email address"),
    phone: z
      .string()
      .regex(indianPhoneRegex, "Phone number must be a valid 10-digit Indian mobile number"),
    college: z.string().min(2, "College name is required").max(150),
    department: z.string().min(2, "Department is required").max(100),
    year: z.enum(["1st Year", "2nd Year", "3rd Year", "4th Year", "Postgraduate"]),
    imageUrl: z.string().url().optional().or(z.literal("")),
    // OTP verification token (cryptographic proof that leader's email is verified)
    emailVerificationToken: z.string().min(1, "Email verification is required"),
    // Additional team members (excluding leader)
    members: z.array(teamMemberSchema).optional().default([]),
  })
  .refine(
    (data) => {
      const expectedMembers = parseInt(data.teamSize) - 1;
      return data.members.length === expectedMembers;
    },
    {
      message: "Number of team members must match selected team size",
      path: ["members"],
    }
  );

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

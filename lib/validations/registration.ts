import { z } from "zod";

const indianPhoneRegex = /^[6-9]\d{9}$/;

// Team member sub-schema (for additional members beyond the leader)
const teamMemberSchema = z.object({
  name: z.string().min(2, "Member name must be at least 2 characters").max(100),
  phone: z
    .string()
    .regex(indianPhoneRegex, "Must be a valid 10-digit Indian mobile number"),
  collegeIdUrl: z.string().url("Invalid College ID URL").optional().or(z.literal("")),
  // Individual member transport preferences (if individual pickup mode is chosen)
  transportOptIn: z.boolean().optional().default(false),
  pickupRoute: z.string().optional(),
  pickupStop: z.string().optional(),
  pickupLandmark: z.string().optional(),
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
    imageUrl: z.string().url("College ID document (PDF) is required"),
    // OTP verification token (cryptographic proof that leader's email is verified)
    emailVerificationToken: z.string().min(1, "Email verification is required"),
    // Additional team members (excluding leader)
    members: z.array(teamMemberSchema).optional().default([]),
    // Vel Tech Campus Transportation
    transportOptIn: z.boolean().default(false),
    samePickupForTeam: z.boolean().default(true),
    pickupRoute: z.string().optional(),
    pickupStop: z.string().optional(),
    pickupLandmark: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // 1. Verify expected members count
    const expectedMembers = parseInt(data.teamSize) - 1;
    if (data.members.length !== expectedMembers) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Number of team members must match selected team size",
        path: ["members"],
      });
    }

    // 2. Vel Tech Transport validation
    if (data.transportOptIn) {
      // If team size is 1 or team boards together
      if (data.samePickupForTeam || parseInt(data.teamSize) === 1) {
        if (!data.pickupRoute || data.pickupRoute.trim().length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select your Vel Tech bus route corridor",
            path: ["pickupRoute"],
          });
        }
        if (!data.pickupStop || data.pickupStop.trim().length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select your designated boarding stop",
            path: ["pickupStop"],
          });
        }
        if (!data.pickupLandmark || data.pickupLandmark.trim().length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please provide a recognizable landmark or boarding reference point (min 3 chars)",
            path: ["pickupLandmark"],
          });
        }
      } else {
        // Individual pickups mode: validate leader's pickup
        if (!data.pickupRoute || data.pickupRoute.trim().length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select the team leader's Vel Tech bus route",
            path: ["pickupRoute"],
          });
        }
        if (!data.pickupStop || data.pickupStop.trim().length < 2) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please select the team leader's boarding stop",
            path: ["pickupStop"],
          });
        }
        if (!data.pickupLandmark || data.pickupLandmark.trim().length < 3) {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            message: "Please provide the team leader's boarding landmark",
            path: ["pickupLandmark"],
          });
        }

        // Validate each member's pickup details if individual mode
        data.members.forEach((member, idx) => {
          if (member.transportOptIn) {
            if (!member.pickupRoute || member.pickupRoute.trim().length < 2) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Please select Member ${idx + 2}'s Vel Tech bus route`,
                path: ["members", idx, "pickupRoute"],
              });
            }
            if (!member.pickupStop || member.pickupStop.trim().length < 2) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Please select Member ${idx + 2}'s boarding stop`,
                path: ["members", idx, "pickupStop"],
              });
            }
            if (!member.pickupLandmark || member.pickupLandmark.trim().length < 3) {
              ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: `Please provide Member ${idx + 2}'s boarding landmark`,
                path: ["members", idx, "pickupLandmark"],
              });
            }
          }
        });
      }
    }
  });

export type RegistrationInput = z.infer<typeof registrationSchema>;
export type TeamMemberInput = z.infer<typeof teamMemberSchema>;

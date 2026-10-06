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
    // Team configuration - Strictly team of 3 builders
    teamSize: z.enum(["3"], {
      message: "Event registration requires a team of exactly 3 members. Solo and dual entries are not permitted.",
    }),
    teamName: z
      .string()
      .min(2, "Team name must be at least 2 characters")
      .max(50, "Team name cannot exceed 50 characters"),
    // Leader details (Member 01)
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
    // Exactly 2 additional team members (Leader + 2 Members = 3 total builders)
    members: z
      .array(teamMemberSchema)
      .length(2, "Exactly 2 additional team members are required (3 members total including leader)."),
    // Vel Tech Campus Transportation
    transportOptIn: z.boolean().default(false),
    samePickupForTeam: z.boolean().default(true),
    pickupRoute: z.string().optional(),
    pickupStop: z.string().optional(),
    pickupLandmark: z.string().optional(),
  })
  .superRefine((data, ctx) => {
    // 1. Verify that all 3 members have unique phone numbers
    const allPhones = [data.phone, ...data.members.map((m) => m.phone)];
    const uniquePhones = new Set(allPhones);
    if (uniquePhones.size !== 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "All 3 team members (Leader, Member 02, and Member 03) must have distinct mobile numbers.",
        path: ["members"],
      });
    }

    // 2. Verify that all 3 members have distinct names
    const allNames = [
      data.name.trim().toLowerCase(),
      ...data.members.map((m) => m.name.trim().toLowerCase()),
    ];
    const uniqueNames = new Set(allNames);
    if (uniqueNames.size !== 3) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Team member names cannot be identical.",
        path: ["members"],
      });
    }

    // 3. Vel Tech Transport validation
    if (data.transportOptIn) {
      // If team boards together
      if (data.samePickupForTeam) {
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

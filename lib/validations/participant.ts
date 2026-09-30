import { z } from "zod";

export const participantProfileSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(100),
  phone: z
    .string()
    .regex(/^[6-9]\d{9}$/, "Phone number must be a valid 10-digit mobile number"),
  college: z.string().min(2, "College name is required").max(150),
  department: z.string().min(2, "Department is required").max(100),
  year: z.string().min(1, "Year of study is required"),
  imageUrl: z.string().url().optional().or(z.literal("")),
  cloudinaryPublicId: z.string().optional(),
});

export type ParticipantProfileInput = z.infer<typeof participantProfileSchema>;

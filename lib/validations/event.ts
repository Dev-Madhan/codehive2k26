import { z } from "zod";

export const eventSchema = z.object({
  name: z.string().min(3, "Event name must be at least 3 characters").max(100),
  slug: z
    .string()
    .min(3)
    .max(100)
    .regex(/^[a-z0-9-]+$/, "Slug must only contain lowercase alphanumeric characters and hyphens"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  venue: z.string().min(2, "Venue is required"),
  startAt: z.coerce.date(),
  endAt: z.coerce.date(),
  capacity: z.coerce.number().int().default(99999),
  registrationDeadline: z.coerce.date(),
  registrationOpen: z.boolean().default(true),
  categoryId: z.string().optional(),
  posterUrl: z.string().url("Must be a valid URL").optional().or(z.literal("")),
  isTeamEvent: z.boolean().default(false),
  minTeamSize: z.coerce.number().int().min(1).default(1),
  maxTeamSize: z.coerce.number().int().min(1).default(1),
}).refine((data) => data.endAt > data.startAt, {
  message: "End date must be after start date",
  path: ["endAt"],
}).refine((data) => data.registrationDeadline <= data.startAt, {
  message: "Registration deadline must be before or equal to event start date",
  path: ["registrationDeadline"],
});

export type EventInput = z.infer<typeof eventSchema>;

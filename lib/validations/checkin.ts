import { z } from "zod";

export const checkInSchema = z.object({
  qrToken: z.string().min(5, "Valid QR token is required"),
  deviceInfo: z.string().optional(),
  inspectOnly: z.boolean().optional(),
});

export type CheckInInput = z.infer<typeof checkInSchema>;

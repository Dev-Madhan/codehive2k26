import { z } from "zod";

/**
 * Tech Forge Team Leader Recipient Schema
 * Enforces strict validation of all recipient fields.
 */
export const recipientSchema = z.object({
  teamId: z.string().min(1, "Team ID is required"),
  teamName: z.string().min(1, "Team Name is required"),
  leaderName: z.string().min(1, "Team Leader Name is required"),
  leaderEmail: z
    .string()
    .min(1, "Team Leader Email Address is required")
    .email("Invalid email address format")
    .transform((val) => val.trim().toLowerCase()),
  sendingStatus: z
    .enum(["PENDING", "ACCEPTED", "FAILED", "EXCLUDED"])
    .default("PENDING")
    .refine((val) => val !== "EXCLUDED", {
      message: "Recipient is marked as EXCLUDED and cannot enter sending queue",
    }),
  errorDetails: z.string().default("").refine((val) => val === "", {
    message: "Record has errorDetails attached and requires operator resolution",
  }),
  registrationNumber: z.string().optional(),
  phone: z.string().optional(),
  college: z.string().optional(),
  department: z.string().optional(),
  membersCount: z.number().optional(),
}).refine(
  (data) => !data.leaderEmail.includes("unresolved") && !data.leaderName.includes("UNRESOLVED"),
  {
    message: "Record has unresolved leader information",
    path: ["leaderEmail"],
  }
);

export type ValidatedRecipient = z.infer<typeof recipientSchema>;

export interface ValidationReport {
  isValid: boolean;
  totalRecords: number;
  expectedCount: number;
  validCount: number;
  errorCount: number;
  duplicateEmails: string[];
  errors: Array<{
    index: number;
    teamName?: string;
    email?: string;
    issues: string[];
  }>;
}

/**
 * Validate an array of recipient records against strict campaign constraints:
 * 1. Exactly 67 approved team leaders
 * 2. Zero missing or malformed email addresses
 * 3. Zero duplicate email addresses
 * 4. Zero incomplete team/leader records
 */
export function validateRecipients(records: unknown[], expectedCount: number = 67): ValidationReport {
  const report: ValidationReport = {
    isValid: true,
    totalRecords: records.length,
    expectedCount,
    validCount: 0,
    errorCount: 0,
    duplicateEmails: [],
    errors: [],
  };

  if (records.length !== expectedCount) {
    report.isValid = false;
    report.errors.push({
      index: -1,
      issues: [
        `Record count mismatch: Expected exactly ${expectedCount} approved team leaders, but found ${records.length}.`,
      ],
    });
  }

  const seenEmails = new Map<string, number>();

  records.forEach((raw, idx) => {
    const parseResult = recipientSchema.safeParse(raw);
    if (!parseResult.success) {
      report.isValid = false;
      report.errorCount++;
      const fieldErrors = parseResult.error.flatten().fieldErrors;
      const issues: string[] = [];
      for (const [field, errs] of Object.entries(fieldErrors)) {
        issues.push(`${field}: ${errs?.join(", ")}`);
      }
      report.errors.push({
        index: idx + 1,
        teamName: (raw as any)?.teamName || "UNKNOWN",
        email: (raw as any)?.leaderEmail || "UNKNOWN",
        issues,
      });
    } else {
      report.validCount++;
      const email = parseResult.data.leaderEmail;
      seenEmails.set(email, (seenEmails.get(email) || 0) + 1);
    }
  });

  // Detect duplicate email addresses
  for (const [email, count] of seenEmails.entries()) {
    if (count > 1) {
      report.isValid = false;
      report.duplicateEmails.push(`${email} (appears ${count} times)`);
    }
  }

  if (report.duplicateEmails.length > 0) {
    report.errors.push({
      index: -1,
      issues: [`Duplicate team leader emails detected: ${report.duplicateEmails.join(", ")}`],
    });
  }

  return report;
}

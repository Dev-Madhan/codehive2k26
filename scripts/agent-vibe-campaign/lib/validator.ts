import { z } from "zod";

/**
 * Recipient schema according to Section 6 of requirements
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
  assignedSlotId: z
    .string()
    .nullable()
    .refine(
      (val) => val === null || val === "UNASSIGNED" || /^Slot\s*[1-6]$/i.test(val) || /^[1-6]$/.test(val),
      {
        message: "Assigned Slot ID must be between Slot 1 and Slot 6 or UNASSIGNED/null",
      }
    ),
  emailStatus: z.enum(["PENDING", "SENT", "FAILED", "EXCLUDED"]).default("PENDING"),
  errorDetails: z.string().default(""),
  registrationNumber: z.string().optional(),
  college: z.string().optional(),
});

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

export function validateRecipients(records: unknown[], expectedCount: number = 62): ValidationReport {
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

  // Check for duplicate emails
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

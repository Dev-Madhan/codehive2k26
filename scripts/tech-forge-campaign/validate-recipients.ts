import * as fs from "fs";
import * as path from "path";
import { validateRecipients } from "./lib/validator";

function runValidation() {
  console.log("================================================================================");
  console.log("  TECH FORGE PRE-ELIMINATION CAMPAIGN — RECIPIENT DATASET AUDITOR");
  console.log("================================================================================\n");

  const dataPath = path.join(__dirname, "data", "recipients.json");

  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Data file not found at ${dataPath}. Please run 'export-recipients.ts' first.`);
    process.exit(1);
  }

  const raw = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  console.log(`📂 Inspecting ${raw.length} records from ${dataPath}...\n`);

  const report = validateRecipients(raw, 67);

  console.log("--------------------------------------------------------------------------------");
  console.log("AUDIT METRICS");
  console.log("--------------------------------------------------------------------------------");
  console.log(`• Total Records Loaded:       ${report.totalRecords}`);
  console.log(`• Target Approved Cohort:     ${report.expectedCount} Team Leaders`);
  console.log(`• Validated Clean Records:    ${report.validCount}`);
  console.log(`• Problematic Records:        ${report.errorCount}`);
  console.log(`• Duplicate Email Addresses:  ${report.duplicateEmails.length}`);
  console.log("--------------------------------------------------------------------------------\n");

  if (report.isValid) {
    console.log("🎉 AUDIT PASSED: Recipient dataset strictly satisfies all 67 approved team leader criteria.");
    console.log("   Ready for pre-flight testing and delivery pipeline.");
    process.exit(0);
  } else {
    console.error("🛑 AUDIT FAILED: Recipient dataset violates safety requirements.\n");
    console.error("ACTIONABLE DEFECT REPORT:");
    for (const err of report.errors) {
      if (err.index === -1) {
        console.error(`  [COHORT LEVEL] ${err.issues.join(", ")}`);
      } else {
        console.error(`  [RECORD #${err.index}] Team: "${err.teamName}" | Email: "${err.email}"`);
        for (const issue of err.issues) {
          console.error(`    ↳ ${issue}`);
        }
      }
    }

    console.error("\nREMEDIATION GUIDE FOR OPERATOR:");
    console.error("1. Open scripts/tech-forge-campaign/data/recipients.json (or recipients.csv).");
    console.error("2. Supply the valid Team Leader Name and Email Address for any incomplete records.");
    console.error("3. Ensure the list contains exactly 67 distinct, authorized team leader email addresses.");
    console.error("4. Re-run 'npx tsx scripts/tech-forge-campaign/validate-recipients.ts' to verify.");
    process.exit(1);
  }
}

runValidation();

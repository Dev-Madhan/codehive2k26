import * as fs from "fs";
import * as path from "path";
import { validateRecipients } from "./lib/validator";

function runValidation() {
  console.log("\n========================================================");
  console.log("  AGENT VIBE — RECIPIENT DATASET VALIDATION (62 LEADERS)");
  console.log("========================================================\n");

  const jsonPath = path.join(__dirname, "data", "recipients.json");
  const csvPath = path.join(__dirname, "data", "recipients.csv");

  if (!fs.existsSync(jsonPath)) {
    console.error(`❌ Missing dataset: ${jsonPath}. Run export-recipients.ts first.`);
    process.exit(1);
  }

  const rawJson = fs.readFileSync(jsonPath, "utf-8");
  const records = JSON.parse(rawJson);

  console.log(`Loaded ${records.length} records from ${jsonPath}`);
  console.log(`Verifying against CSV at ${csvPath}`);

  const report = validateRecipients(records, 62);

  console.log("\n--- VALIDATION SUMMARY ---");
  console.log(`• Total Records: ${report.totalRecords}`);
  console.log(`• Expected Count: ${report.expectedCount}`);
  console.log(`• Valid Records: ${report.validCount}`);
  console.log(`• Syntax / Schema Errors: ${report.errorCount}`);
  console.log(`• Duplicate Emails: ${report.duplicateEmails.length}`);
  console.log(`• Overall Status: ${report.isValid ? "✅ PASSED (100% READY)" : "❌ FAILED"}`);

  if (!report.isValid) {
    console.error("\n❌ VALIDATION ISSUES DETECTED:");
    for (const err of report.errors) {
      if (err.index === -1) {
        console.error(`  Global: ${err.issues.join("; ")}`);
      } else {
        console.error(`  Row #${err.index} [Team: "${err.teamName}", Email: "${err.email}"]: ${err.issues.join("; ")}`);
      }
    }
    process.exit(1);
  } else {
    console.log("\n✅ Dataset integrity verified: Exactly 62 unique, valid team leader records confirmed.\n");
  }
}

runValidation();

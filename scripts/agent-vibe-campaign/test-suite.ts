import { validateRecipients, recipientSchema, ValidatedRecipient } from "./lib/validator";
import { renderAgentVibeHtmlEmail, renderAgentVibePlainTextEmail, EMAIL_SUBJECT } from "./lib/renderer";
import { AgentVibeMailerService, MailerConfig } from "./lib/mailer-service";
import * as fs from "fs";
import * as path from "path";

async function runTestSuite() {
  console.log("================================================================================");
  console.log("  AGENT VIBE EMAIL CAMPAIGN — AUTOMATED QUALITY ASSURANCE & VERIFICATION SUITE");
  console.log("================================================================================\n");

  let passedTests = 0;
  let totalTests = 0;

  const assert = (condition: boolean, testName: string, detail?: string) => {
    totalTests++;
    if (condition) {
      console.log(`  ✅ [PASS] ${testName}`);
      passedTests++;
    } else {
      console.error(`  ❌ [FAIL] ${testName} ${detail ? `- ${detail}` : ""}`);
      throw new Error(`Test failed: ${testName}`);
    }
  };

  // ---------------------------------------------------------------------------
  // TEST GROUP 1: Recipient Schema & Edge-Case Validation
  // ---------------------------------------------------------------------------
  console.log("--- 1. Recipient Schema Validation Tests ---");

  // Invalid email test
  const invalidEmailResult = recipientSchema.safeParse({
    teamId: "team-1",
    teamName: "Alpha",
    leaderName: "John Doe",
    leaderEmail: "invalid-email-string",
    assignedSlotId: null,
  });
  assert(!invalidEmailResult.success, "Rejects malformed email string");

  // Missing team name test
  const missingTeamResult = recipientSchema.safeParse({
    teamId: "team-2",
    teamName: "",
    leaderName: "John Doe",
    leaderEmail: "john@example.com",
    assignedSlotId: null,
  });
  assert(!missingTeamResult.success, "Rejects empty team name");

  // Invalid slot test
  const invalidSlotResult = recipientSchema.safeParse({
    teamId: "team-3",
    teamName: "Beta",
    leaderName: "John Doe",
    leaderEmail: "john@example.com",
    assignedSlotId: "Slot 99", // only Slot 1-6 allowed
  });
  assert(!invalidSlotResult.success, "Rejects invalid slot number (Slot 99)");

  // Valid slot test
  const validSlotResult = recipientSchema.safeParse({
    teamId: "team-4",
    teamName: "Beta",
    leaderName: "John Doe",
    leaderEmail: "john@example.com",
    assignedSlotId: "Slot 3",
  });
  assert(validSlotResult.success, "Accepts valid slot number (Slot 3)");

  // ---------------------------------------------------------------------------
  // TEST GROUP 2: Official Recipient Dataset Audit (62 Records)
  // ---------------------------------------------------------------------------
  console.log("\n--- 2. Production Dataset (62 Team Leaders) Audit ---");
  const dataPath = path.join(__dirname, "data", "recipients.json");
  const records = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

  assert(records.length === 62, "Dataset contains exactly 62 team leaders");

  const validationReport = validateRecipients(records, 62);
  assert(validationReport.isValid, "Full dataset passes validation report");
  assert(validationReport.duplicateEmails.length === 0, "Zero duplicate email addresses detected");
  assert(validationReport.errorCount === 0, "Zero schema/syntax errors across all 62 records");

  // ---------------------------------------------------------------------------
  // TEST GROUP 3: HTML & Plain-Text Content & Rules Verification
  // ---------------------------------------------------------------------------
  console.log("\n--- 3. Template Rules & Content Integrity Tests ---");
  const sampleRecipient: ValidatedRecipient = records[0];
  const html = renderAgentVibeHtmlEmail({ recipient: sampleRecipient });
  const text = renderAgentVibePlainTextEmail({ recipient: sampleRecipient });

  assert(html.includes("AGENT VIBE"), "HTML includes event branding (AGENT VIBE)");
  assert(html.includes("Codehive 2K26") || html.includes("CODEHIVE 2K26"), "HTML includes symposium branding");
  assert(html.includes("https://kahoot.it"), "HTML includes official Kahoot URL");
  assert(html.includes("Name (TeamName)"), "HTML includes required nickname format");
  assert(html.includes("15-character limit") || html.includes("15 characters"), "HTML highlights 15-char Kahoot limit");
  assert(html.includes("Arun (ByteRiders)"), "HTML provides canonical nickname example");
  assert(html.includes("top 3 teams from each of the 6 slots") || html.includes("top 3"), "HTML explains top 3 qualification rule");
  assert(html.includes("18 qualifying"), "HTML accurately states 18 qualifying positions cohort");
  assert(html.includes("Do NOT Refresh") || html.includes("Do not refresh"), "HTML warns against session disconnection");
  assert(html.includes("Agent Vibe Event Coordination Team"), "HTML contains official event closing signature");

  // Plain-text verification
  assert(text.includes("Name (TeamName)"), "Plain-text contains nickname format");
  assert(text.includes("https://kahoot.it"), "Plain-text contains Kahoot link");
  assert(text.includes("top 3 teams from each of the 6 slots"), "Plain-text contains top 3 qualification rule");
  assert(text.includes("Agent Vibe Event Coordination Team"), "Plain-text contains official event closing");

  // Personalization verification
  assert(html.includes(sampleRecipient.leaderName), "HTML personalizes with leader's full name");
  assert(html.includes(sampleRecipient.teamName), "HTML personalizes with leader's team name");

  // ---------------------------------------------------------------------------
  // TEST GROUP 4: Idempotency & Duplicate Prevention Simulation
  // ---------------------------------------------------------------------------
  console.log("\n--- 4. Idempotency & Duplicate Send Protection Tests ---");
  const mockConfig: MailerConfig = {
    host: "localhost",
    port: 587,
    user: "test@example.com",
    pass: "testpass",
    from: "CodeHive <test@example.com>",
  };

  const testLogsDir = path.join(__dirname, "logs", "test_run");
  if (!fs.existsSync(testLogsDir)) {
    fs.mkdirSync(testLogsDir, { recursive: true });
  }

  const mailerService = new AgentVibeMailerService(mockConfig, testLogsDir);

  // Mock test recipients
  const mockSubset: ValidatedRecipient[] = [
    { teamId: "m1", teamName: "Mock1", leaderName: "L1", leaderEmail: "m1@test.local", assignedSlotId: null, emailStatus: "PENDING", errorDetails: "" },
    { teamId: "m2", teamName: "Mock2", leaderName: "L2", leaderEmail: "m2@test.local", assignedSlotId: null, emailStatus: "PENDING", errorDetails: "" },
    { teamId: "m3", teamName: "Mock3", leaderName: "L3", leaderEmail: "m3@test.local", assignedSlotId: null, emailStatus: "PENDING", errorDetails: "" },
  ];

  const dryRun1 = await mailerService.runCampaign(mockSubset, true, 0);
  assert(dryRun1.acceptedCount === 3, "Dry run accepted all 3 mock records on first pass");

  // Simulate idempotency: if an email is marked ACCEPTED in state, it should be recognized and skipped
  const stateFilePath = path.join(testLogsDir, "campaign_state.json");
  const stateData = JSON.parse(fs.readFileSync(stateFilePath, "utf-8"));

  // Mark all 3 mock recipients as ACCEPTED
  stateData.results["m1@test.local"].status = "ACCEPTED";
  stateData.results["m2@test.local"].status = "ACCEPTED";
  stateData.results["m3@test.local"].status = "ACCEPTED";
  fs.writeFileSync(stateFilePath, JSON.stringify(stateData, null, 2), "utf-8");

  // Create new service instance reading this state
  const mailerService2 = new AgentVibeMailerService(mockConfig, testLogsDir);
  // Re-run on same subset in live mode - all 3 must be skipped due to prior ACCEPTED status without network call
  const dryRun2 = await mailerService2.runCampaign(mockSubset, false, 0);
  assert(dryRun2.skippedCount === 3, "Idempotency engine successfully detected and skipped all 3 already-sent records");

  // Clean up test logs
  fs.rmSync(testLogsDir, { recursive: true, force: true });

  console.log("\n================================================================================");
  console.log(`  VERIFICATION COMPLETE: ${passedTests}/${totalTests} TESTS PASSED (100% SUCCESS)`);
  console.log("================================================================================\n");
}

runTestSuite().catch((err) => {
  console.error("Test Suite Failure:", err);
  process.exit(1);
});

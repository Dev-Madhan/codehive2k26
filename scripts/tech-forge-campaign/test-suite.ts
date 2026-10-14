import { validateRecipients, recipientSchema, ValidatedRecipient } from "./lib/validator";
import {
  renderTechForgeHtmlEmail,
  renderTechForgePlainTextEmail,
  OFFICIAL_HACKERRANK_URL,
  EMAIL_SUBJECT,
} from "./lib/renderer";
import { TechForgeMailerService, MailerConfig } from "./lib/mailer-service";
import * as fs from "fs";
import * as path from "path";

async function runTestSuite() {
  console.log("================================================================================");
  console.log("  TECH FORGE EMAIL CAMPAIGN — AUTOMATED QUALITY ASSURANCE & VERIFICATION SUITE");
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
  console.log("--- 1. Recipient Schema & Edge-Case Validation Tests ---");

  // Invalid email
  const invalidEmailResult = recipientSchema.safeParse({
    teamId: "team-1",
    teamName: "Alpha Coders",
    leaderName: "Kousi M",
    leaderEmail: "invalid-email-string",
  });
  assert(!invalidEmailResult.success, "Rejects malformed email string");

  // Empty team name
  const missingTeamResult = recipientSchema.safeParse({
    teamId: "team-2",
    teamName: "",
    leaderName: "Kousi M",
    leaderEmail: "kousi@example.com",
  });
  assert(!missingTeamResult.success, "Rejects empty team name");

  // Missing leader name
  const missingLeaderResult = recipientSchema.safeParse({
    teamId: "team-3",
    teamName: "Beta Devs",
    leaderName: "",
    leaderEmail: "kousi@example.com",
  });
  assert(!missingLeaderResult.success, "Rejects empty leader name");

  // Valid record
  const validRecordResult = recipientSchema.safeParse({
    teamId: "team-4",
    teamName: "Gamma Devs",
    leaderName: "Sabarish K",
    leaderEmail: "sabarish@example.com",
    registrationNumber: "CH26-E7M969",
    college: "Vel Tech",
  });
  assert(validRecordResult.success, "Accepts fully compliant team leader record");

  // ---------------------------------------------------------------------------
  // TEST GROUP 2: Official Template Rules & Content Integrity
  // ---------------------------------------------------------------------------
  console.log("\n--- 2. Template Rules & Content Integrity Tests ---");
  const sampleRecipient: ValidatedRecipient = {
    teamId: "team-tf-01",
    teamName: "ByteForge Innovators",
    leaderName: "Kousi M",
    leaderEmail: "kowshykm@gmail.com",
    sendingStatus: "PENDING",
    errorDetails: "",
    registrationNumber: "CH26-NN7TB4",
    college: "Vel Tech",
    department: "CSE",
    membersCount: 3,
  };

  const html = renderTechForgeHtmlEmail({ recipient: sampleRecipient });
  const text = renderTechForgePlainTextEmail({ recipient: sampleRecipient });

  // Exact URL assertion (CRITICAL REQUIREMENT)
  assert(
    html.includes(OFFICIAL_HACKERRANK_URL),
    "HTML includes the EXACT official HackerRank test URL",
    OFFICIAL_HACKERRANK_URL
  );
  assert(
    text.includes(OFFICIAL_HACKERRANK_URL),
    "Plain-text includes the EXACT official HackerRank test URL",
    OFFICIAL_HACKERRANK_URL
  );
  assert(
    OFFICIAL_HACKERRANK_URL === "https://www.hackerrank.com/tech-forge-codehive2k26",
    "Official HackerRank constant strictly equals https://www.hackerrank.com/tech-forge-codehive2k26"
  );

  // Subject line assertion
  assert(
    EMAIL_SUBJECT === "Action Required: Tech Forge Pre-Elimination Round – Team Leader Instructions",
    "Subject line matches approved specification exactly"
  );

  // Event branding
  assert(html.includes("TECH FORGE"), "HTML includes TECH FORGE branding");
  assert(html.includes("CODEHIVE 2K26") || html.includes("Codehive 2K26"), "HTML includes Codehive 2K26");

  // Schedule & Timezone
  assert(
    html.includes("15 October 2026, 12:00 AM IST") && html.includes("16 October 2026, 12:00 AM IST"),
    "HTML specifies event access window with IST timezone"
  );
  assert(
    text.includes("15 October 2026, 12:00 AM IST") && text.includes("16 October 2026, 12:00 AM IST"),
    "Plain-text specifies event access window with IST timezone"
  );

  // Challenge Format & Time Limit
  assert(html.includes("1 Coding Problem") || html.includes("One coding question"), "HTML states 1 Coding Problem");
  assert(html.includes("1 Hour (60 Mins)") || html.includes("1 Hour (60 Minutes)"), "HTML states 1-Hour time limit");

  // Window vs. Attempt distinction
  assert(
    html.includes("EVENT WINDOW VS. CODING ATTEMPT TIMER") || html.includes("24 Hours"),
    "HTML clearly highlights 24-hour window vs 1-hour attempt timer"
  );
  assert(
    text.includes("EVENT WINDOW VS. CODING ATTEMPT TIMER") || text.includes("24 Hours"),
    "Plain-text clearly highlights 24-hour window vs 1-hour attempt timer"
  );

  // One participant per team rule
  assert(
    html.includes("1 Participant Only") || html.includes("one participant to represent"),
    "HTML clearly emphasizes one participant per team rule"
  );
  assert(
    text.includes("Designate One Representative") || text.includes("1 Selected Participant"),
    "Plain-text clearly emphasizes one participant per team rule"
  );

  // Evaluation criteria
  assert(html.includes("Correctness & Test Cases"), "HTML includes Evaluation Criterion #1 (Correctness)");
  assert(html.includes("Algorithmic Efficiency"), "HTML includes Evaluation Criterion #2 (Efficiency)");
  assert(html.includes("Problem-Solving Approach"), "HTML includes Evaluation Criterion #3 (Problem-Solving)");
  assert(html.includes("Code Quality"), "HTML includes Evaluation Criterion #4 (Code Quality)");

  // Authorized closing signature
  assert(html.includes("Madhan Kumar"), "HTML signature includes Madhan Kumar");
  assert(html.includes("Technical Team Coordinator"), "HTML signature includes Technical Team Coordinator");
  assert(html.includes("Tech Forge | Codehive 2K26"), "HTML signature includes Tech Forge | Codehive 2K26");

  // ---------------------------------------------------------------------------
  // TEST GROUP 3: Previews and File Artifacts
  // ---------------------------------------------------------------------------
  console.log("\n--- 3. Previews and Generated Artifacts Check ---");
  const previewHtmlPath = path.join(__dirname, "templates", "preview_sample.html");
  const previewTxtPath = path.join(__dirname, "templates", "preview_sample.txt");

  assert(fs.existsSync(previewHtmlPath), "Preview HTML artifact exists on disk");
  assert(fs.existsSync(previewTxtPath), "Preview Plain-Text artifact exists on disk");

  const diskHtml = fs.readFileSync(previewHtmlPath, "utf-8");
  assert(diskHtml.includes(OFFICIAL_HACKERRANK_URL), "Preview HTML contains the exact HackerRank URL");

  // ---------------------------------------------------------------------------
  // TEST GROUP 4: Mailer Service Idempotency & Safety Check
  // ---------------------------------------------------------------------------
  console.log("\n--- 4. Mailer Service Dry-Run & Idempotency Simulation ---");
  const dummyConfig: MailerConfig = {
    host: "smtp.example.com",
    port: 587,
    user: "test@example.com",
    pass: "dummy-pass",
    from: "Tech Forge <test@example.com>",
  };

  const testLogDir = path.join(__dirname, "logs", "test_scratch");
  if (!fs.existsSync(testLogDir)) {
    fs.mkdirSync(testLogDir, { recursive: true });
  }

  const mailer = new TechForgeMailerService(dummyConfig, testLogDir);

  // Run dry run with mock recipient
  const dryRunState = await mailer.runCampaign([sampleRecipient], true, 0);
  assert(dryRunState.acceptedCount === 1, "Dry-run correctly validates and counts recipient");
  assert(dryRunState.results[sampleRecipient.leaderEmail].status === "DRY_RUN_PASSED", "Dry-run sets DRY_RUN_PASSED status");

  // Clean up scratch dir
  fs.rmSync(testLogDir, { recursive: true, force: true });
  assert(!fs.existsSync(testLogDir), "Test log directory cleaned up successfully");

  // ---------------------------------------------------------------------------
  // SUMMARY
  // ---------------------------------------------------------------------------
  console.log("\n================================================================================");
  console.log(`  QA VERIFICATION COMPLETE: ${passedTests} / ${totalTests} TESTS PASSED (100%)`);
  console.log("================================================================================\n");
}

runTestSuite().catch((err) => {
  console.error("❌ QA Test Suite execution failed:", err);
  process.exit(1);
});

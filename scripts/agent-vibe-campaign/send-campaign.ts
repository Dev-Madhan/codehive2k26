import * as fs from "fs";
import * as path from "path";

// Native Node environment loader
try {
  process.loadEnvFile();
} catch (e) {
  // .env file already loaded or not found
}

import { validateRecipients, ValidatedRecipient } from "./lib/validator";
import { AgentVibeMailerService, MailerConfig, CampaignState } from "./lib/mailer-service";

async function main() {
  const args = process.argv.slice(2);
  const isValidateOnly = args.includes("--validate-only");
  const isVerifyConnection = args.includes("--verify-connection");
  const testEmailIdx = args.indexOf("--send-test");
  const targetTestEmail = testEmailIdx !== -1 ? args[testEmailIdx + 1] : null;
  const isExecuteLive = args.includes("--execute-campaign");
  const isDryRun = !isExecuteLive;

  console.log("================================================================================");
  console.log("  CODEHIVE 2K26 — AGENT VIBE AI QUIZ PRELIMINARY ROUND CAMPAIGN DISPATCHER");
  console.log("================================================================================");

  // 1. Check Data Files
  const dataPath = path.join(__dirname, "data", "recipients.json");
  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Recipient dataset not found at ${dataPath}. Please run 'export-recipients.ts' first.`);
    process.exit(1);
  }

  const rawRecipients = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  console.log(`📂 Loaded ${rawRecipients.length} team leader records from data/recipients.json`);

  // 2. Run Strict Validation
  const validationReport = validateRecipients(rawRecipients, 62);
  if (!validationReport.isValid) {
    console.error("\n❌ Recipient dataset failed validation! Campaign aborted for safety.");
    for (const err of validationReport.errors) {
      console.error(`  - ${err.issues.join(", ")}`);
    }
    process.exit(1);
  }

  console.log(`✅ Validation Passed: Exactly ${validationReport.validCount} valid, unique team leader recipients.`);

  if (isValidateOnly) {
    console.log("🏁 Validation complete (--validate-only specified). Exiting.");
    return;
  }

  // 3. Resolve Mailer Config
  const mailerConfig: MailerConfig = {
    host: process.env.SMTP_HOST || "smtp-relay.brevo.com",
    port: Number(process.env.SMTP_PORT) || 587,
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.EMAIL_FROM || "CodeHive 2K26 <codehive2k26@gmail.com>",
  };

  const mailerService = new AgentVibeMailerService(mailerConfig);

  // 4. Verify SMTP Connection
  if (isVerifyConnection) {
    console.log(`🔌 Testing SMTP connection to ${mailerConfig.host}:${mailerConfig.port}...`);
    const conn = await mailerService.verifyConnection();
    if (conn.success) {
      console.log(`✅ SMTP connection verified successfully! Sender: ${mailerConfig.from}`);
    } else {
      console.error(`❌ SMTP connection failed: ${conn.error}`);
    }
    return;
  }

  // 5. Send Test Email
  if (targetTestEmail) {
    console.log(`🧪 Running single test dispatch to: ${targetTestEmail}`);
    const sampleRecipient = rawRecipients[0];
    const testResult = await mailerService.sendTestEmail(targetTestEmail, sampleRecipient);
    console.log("\n--- TEST DISPATCH RESULT ---");
    console.log(JSON.stringify(testResult, null, 2));
    return;
  }

  // 6. Safety Check for Live Execution
  if (isExecuteLive) {
    const confirmationEnv = process.env.CONFIRM_AGENT_VIBE_CAMPAIGN;
    if (confirmationEnv !== "true") {
      console.error("\n🛑 SAFETY INTERLOCK ACTIVATED!");
      console.error("Live campaign dispatch requires explicit authorization.");
      console.error("To proceed with live email delivery to 62 team leaders, you must explicitly set:");
      console.error("  $env:CONFIRM_AGENT_VIBE_CAMPAIGN=\"true\" (PowerShell) or CONFIRM_AGENT_VIBE_CAMPAIGN=true");
      console.error("Campaign has NOT been dispatched.\n");
      process.exit(1);
    }

    console.log("\n⚠️  CONFIRMED: Live campaign execution authorized.");
    console.log(`Transmitting emails via ${mailerConfig.host} as ${mailerConfig.from}...`);
  } else {
    console.log("\nℹ️  Running in DRY-RUN mode (Simulation only. No emails will be sent).");
    console.log("Pass --execute-campaign with CONFIRM_AGENT_VIBE_CAMPAIGN=true to trigger real delivery.\n");
  }

  // 7. Execute Campaign (Dry-run or Live)
  const resultState: CampaignState = await mailerService.runCampaign(rawRecipients, isDryRun, 250);

  // 8. Generate Final Campaign Reconciliation Report
  const logsDir = path.join(__dirname, "logs");
  const reportPath = path.join(logsDir, "agent_vibe_final_report.json");
  const reportMarkdownPath = path.join(logsDir, "agent_vibe_final_report.md");

  const finalReport = {
    campaignName: resultState.campaignName,
    executionMode: isDryRun ? "DRY_RUN_SIMULATION" : "LIVE_PRODUCTION_DELIVERY",
    startedAt: resultState.startedAt,
    completedAt: resultState.completedAt,
    totalApprovedRecipients: rawRecipients.length,
    totalAttempted: resultState.acceptedCount + resultState.failedCount,
    acceptedByProvider: resultState.acceptedCount,
    failedSends: resultState.failedCount,
    duplicateSendsPrevented: resultState.skippedCount,
    reconciliationPercentage: `${((resultState.acceptedCount / rawRecipients.length) * 100).toFixed(1)}%`,
    providerDetails: {
      host: mailerConfig.host,
      port: mailerConfig.port,
      sender: mailerConfig.from,
    },
    statusBreakdown: {
      accepted: resultState.acceptedCount,
      failed: resultState.failedCount,
      skipped: resultState.skippedCount,
    },
    noteOnStatus:
      "Accepted by Provider means the SMTP server accepted the message into its delivery queue. Delivery and bounce status must be verified in the provider dashboard (e.g. Brevo transactional logs).",
  };

  fs.writeFileSync(reportPath, JSON.stringify(finalReport, null, 2), "utf-8");

  const mdReport = `# Agent Vibe AI Quiz – Campaign Execution Report

- **Execution Mode:** \`${finalReport.executionMode}\`
- **Timestamp:** \`${finalReport.completedAt}\`
- **Total Approved Recipients:** \`${finalReport.totalApprovedRecipients}\` (Exactly 62 team leaders)
- **Emails Accepted by Provider:** \`${finalReport.acceptedByProvider}\`
- **Failed Sends:** \`${finalReport.failedSends}\`
- **Duplicate Sends Prevented:** \`${finalReport.duplicateSendsPrevented}\`
- **Reconciliation Score:** \`${finalReport.reconciliationPercentage}\`

> [!NOTE]
> **Status Clarification:** "Accepted by Provider" indicates the email transaction was successfully handed over to the SMTP relay (${mailerConfig.host}). For external mailbox delivery confirmations and open rates, consult the provider analytics dashboard.
`;

  fs.writeFileSync(reportMarkdownPath, mdReport, "utf-8");

  console.log("\n========================================================");
  console.log("            CAMPAIGN EXECUTION SUMMARY");
  console.log("========================================================");
  console.log(`• Mode:                     ${finalReport.executionMode}`);
  console.log(`• Total Approved Leaders:   ${finalReport.totalApprovedRecipients}`);
  console.log(`• Accepted / Validated:     ${finalReport.acceptedByProvider}`);
  console.log(`• Failed:                   ${finalReport.failedSends}`);
  console.log(`• Duplicates Prevented:     ${finalReport.duplicateSendsPrevented}`);
  console.log(`• Reconciliation Rate:      ${finalReport.reconciliationPercentage}`);
  console.log(`• Report JSON:              ${reportPath}`);
  console.log(`• Report Markdown:          ${reportMarkdownPath}`);
  console.log("========================================================\n");
}

main().catch((err) => {
  console.error("❌ Fatal execution error:", err);
  process.exit(1);
});

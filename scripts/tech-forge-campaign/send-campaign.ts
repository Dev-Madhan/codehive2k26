import * as fs from "fs";
import * as path from "path";

// Native Node environment loader
try {
  process.loadEnvFile();
} catch (e) {
  // .env file already loaded or not found
}

import { validateRecipients, ValidatedRecipient } from "./lib/validator";
import { TechForgeMailerService, MailerConfig, CampaignState } from "./lib/mailer-service";

async function main() {
  const args = process.argv.slice(2);
  const isValidateOnly = args.includes("--validate-only");
  const isVerifyConnection = args.includes("--verify-connection");
  const testEmailIdx = args.indexOf("--send-test");
  const targetTestEmail = testEmailIdx !== -1 ? args[testEmailIdx + 1] : null;
  const isExecuteLive = args.includes("--execute-campaign");
  const isDryRun = !isExecuteLive;

  console.log("================================================================================");
  console.log("  CODEHIVE 2K26 — TECH FORGE PRE-ELIMINATION CAMPAIGN DISPATCHER");
  console.log("================================================================================\n");

  // 1. Resolve Mailer Configuration
  // Note: For smtp-relay.brevo.com, port 465 (Direct SSL) provides instant handshake and high reliability
  const configuredPort = Number(process.env.SMTP_PORT);
  const host = process.env.SMTP_HOST || "smtp-relay.brevo.com";
  const port = configuredPort || 587; // Use env port (587/STARTTLS confirmed working)

  const mailerConfig: MailerConfig = {
    host,
    port,
    user: process.env.SMTP_USER || "",
    pass: process.env.SMTP_PASS || "",
    from: process.env.EMAIL_FROM || "CodeHive 2K26 <codehive2k26@gmail.com>",
  };

  const mailerService = new TechForgeMailerService(mailerConfig);

  // 2. Immediate Diagnostic Handshake (--verify-connection)
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

  // 3. Isolated Test Send (--send-test <email>)
  if (targetTestEmail) {
    console.log(`🧪 Preparing isolated TEST dispatch to: ${targetTestEmail}`);
    
    // Attempt to load personalized recipient from data/recipients.json if present
    const dataPath = path.join(__dirname, "data", "recipients.json");
    let sampleRecipient: ValidatedRecipient = {
      teamId: "tf-sample-01",
      teamName: "Code Craft",
      leaderName: "Madhan Kumar",
      leaderEmail: targetTestEmail.trim().toLowerCase(),
      sendingStatus: "PENDING",
      errorDetails: "",
      registrationNumber: "CH26-TF001",
      college: "VTMT",
      department: "CSBS",
      membersCount: 3,
    };

    if (fs.existsSync(dataPath)) {
      try {
        const records: any[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
        const matched = records.find(
          (r) => r.leaderEmail?.toLowerCase() === targetTestEmail.toLowerCase()
        );
        if (matched && matched.leaderName) {
          sampleRecipient = {
            ...sampleRecipient,
            ...matched,
            leaderEmail: targetTestEmail.trim().toLowerCase(),
          };
          console.log(`📋 Matched registered team record for leader: "${sampleRecipient.leaderName}" (Team: "${sampleRecipient.teamName}")`);
        }
      } catch (err) {
        // Fall back to canonical sample
      }
    }

    const testResult = await mailerService.sendTestEmail(targetTestEmail, sampleRecipient);
    console.log("\n--- TEST DISPATCH RESULT ---");
    console.log(JSON.stringify(testResult, null, 2));
    
    if (testResult.status === "ACCEPTED") {
      console.log(`\n🎉 Success! Test email delivered to SMTP relay for: ${targetTestEmail}`);
    } else {
      console.error(`\n❌ Failed to dispatch test email: ${testResult.error}`);
    }
    return;
  }

  // 4. Check Recipient Dataset
  const dataPath = path.join(__dirname, "data", "recipients.json");
  if (!fs.existsSync(dataPath)) {
    console.error(`❌ Recipient dataset not found at ${dataPath}. Please run 'export-recipients.ts' first.`);
    process.exit(1);
  }

  const rawAll: any[] = JSON.parse(fs.readFileSync(dataPath, "utf-8"));
  console.log(`📂 Loaded ${rawAll.length} total team records from data/recipients.json`);

  // Filter out EXCLUDED records (orphaned/ghost DB entries) before validation
  const excluded = rawAll.filter((r: any) => r.sendingStatus === "EXCLUDED");
  const rawRecipients: any[] = rawAll.filter((r: any) => r.sendingStatus !== "EXCLUDED");

  if (excluded.length > 0) {
    console.log(`\n⚠️  Skipping ${excluded.length} EXCLUDED record(s) (orphaned DB entries — no valid leader profile):`);
    for (const ex of excluded) {
      console.log(`   - Team: "${ex.teamName}" | Error: ${ex.errorDetails?.slice(0, 80)}`);
    }
    console.log(`📋 Proceeding with ${rawRecipients.length} sendable recipient(s).\n`);
  }

  // 5. Run Strict Validation Gatekeeper (against actual sendable count)
  const expectedCount = rawRecipients.length;
  const validationReport = validateRecipients(rawRecipients, expectedCount);
  if (!validationReport.isValid) {
    console.error("\n❌ Recipient dataset failed validation! Campaign aborted for safety.");
    for (const err of validationReport.errors) {
      if (err.index === -1) {
        console.error(`  - ${err.issues.join(", ")}`);
      } else {
        console.error(`  - Record #${err.index} (${err.teamName}): ${err.issues.join(", ")}`);
      }
    }

    console.error("\nREMEDIATION:");
    console.error("Resolve incomplete records in scripts/tech-forge-campaign/data/recipients.json before launching.");
    process.exit(1);
  }

  console.log(`✅ Validation Passed: Exactly ${validationReport.validCount} valid, unique team leader recipients.`);

  if (isValidateOnly) {
    console.log("🏁 Validation complete (--validate-only specified). Exiting.");
    return;
  }

  // 6. Safety Check for Live Execution
  if (isExecuteLive) {
    const confirmationEnv = process.env.CONFIRM_TECH_FORGE_CAMPAIGN;
    if (confirmationEnv !== "true") {
      console.error("\n🛑 SAFETY INTERLOCK ACTIVATED!");
      console.error("Live campaign dispatch requires explicit operator authorization.");
      console.error("To proceed with live email delivery to 67 team leaders, you must set:");
      console.error("  $env:CONFIRM_TECH_FORGE_CAMPAIGN=\"true\" (PowerShell) or CONFIRM_TECH_FORGE_CAMPAIGN=true");
      console.error("Campaign has NOT been dispatched.\n");
      process.exit(1);
    }

    console.log("\n⚠️  CONFIRMED: Live campaign execution authorized.");
    console.log(`Transmitting emails via ${mailerConfig.host} as ${mailerConfig.from}...`);
  } else {
    console.log("\nℹ️  Running in DRY-RUN mode (Simulation only. No real emails will be sent).");
    console.log("Pass --execute-campaign with CONFIRM_TECH_FORGE_CAMPAIGN=true to trigger real delivery.\n");
  }

  // 7. Execute Campaign (Dry-run or Live)
  const resultState: CampaignState = await mailerService.runCampaign(rawRecipients, isDryRun, 250);

  // 8. Generate Final Campaign Reconciliation Report
  const logsDir = path.join(__dirname, "logs");
  const reportPath = path.join(logsDir, "tech_forge_final_report.json");
  const reportMarkdownPath = path.join(logsDir, "tech_forge_final_report.md");

  const finalReport = {
    campaignName: resultState.campaignName,
    executionMode: isDryRun ? "DRY_RUN_SIMULATION" : "LIVE_PRODUCTION_DELIVERY",
    startedAt: resultState.startedAt,
    completedAt: resultState.completedAt,
    totalApprovedRecipients: rawAll.length,
    excludedOrphaned: excluded.length,
    totalSendable: rawRecipients.length,
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
      "Accepted by Provider means the SMTP server accepted the message into its delivery queue. Delivery and bounce status must be verified in the provider dashboard (e.g., Brevo transactional logs).",
  };

  fs.writeFileSync(reportPath, JSON.stringify(finalReport, null, 2), "utf-8");

  const mdReport = `# Tech Forge Pre-Elimination Round – Campaign Execution Report

- **Campaign Name:** \`${finalReport.campaignName}\`
- **Execution Mode:** \`${finalReport.executionMode}\`
- **Completed At:** \`${finalReport.completedAt}\`
- **Total Approved Recipients:** \`${finalReport.totalApprovedRecipients}\` (Target: 67 team leaders)
- **Emails Accepted by Provider:** \`${finalReport.acceptedByProvider}\`
- **Failed Sends:** \`${finalReport.failedSends}\`
- **Duplicate Sends Prevented:** \`${finalReport.duplicateSendsPrevented}\`
- **Reconciliation Rate:** \`${finalReport.reconciliationPercentage}\`

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

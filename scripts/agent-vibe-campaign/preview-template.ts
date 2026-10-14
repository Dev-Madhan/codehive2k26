import * as fs from "fs";
import * as path from "path";
import { renderAgentVibeHtmlEmail, renderAgentVibePlainTextEmail, EMAIL_SUBJECT } from "./lib/renderer";
import { ValidatedRecipient } from "./lib/validator";

function generatePreview() {
  console.log("Generating Agent Vibe Email Previews...");

  const jsonPath = path.join(__dirname, "data", "recipients.json");
  const records: ValidatedRecipient[] = JSON.parse(fs.readFileSync(jsonPath, "utf-8"));
  const sampleRecipient = records[0] || {
    teamId: "sample-team-001",
    teamName: "ByteRiders",
    leaderName: "Arun Kumar",
    leaderEmail: "arun.sample@gmail.com",
    assignedSlotId: "Slot 2",
    emailStatus: "PENDING",
    errorDetails: "",
    registrationNumber: "CH26-AV1001",
    college: "Vel Tech Multi Tech",
  };

  const html = renderAgentVibeHtmlEmail({ recipient: sampleRecipient });
  const text = renderAgentVibePlainTextEmail({ recipient: sampleRecipient });

  const templatesDir = path.join(__dirname, "templates");
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }

  const htmlPath = path.join(templatesDir, "preview_sample.html");
  const textPath = path.join(templatesDir, "preview_sample.txt");

  fs.writeFileSync(htmlPath, html, "utf-8");
  fs.writeFileSync(textPath, text, "utf-8");

  console.log(`✅ Subject Line: "${EMAIL_SUBJECT}"`);
  console.log(`✅ HTML preview written to: ${htmlPath}`);
  console.log(`✅ Plain-text preview written to: ${textPath}`);
}

generatePreview();

import * as fs from "fs";
import * as path from "path";
import {
  renderTechForgeHtmlEmail,
  renderTechForgePlainTextEmail,
  OFFICIAL_HACKERRANK_URL,
} from "./lib/renderer";
import { ValidatedRecipient } from "./lib/validator";

function generatePreviews() {
  console.log("🎨 Rendering Tech Forge Pre-Elimination Email Template Previews...");

  // Use a canonical sample recipient
  const sampleRecipient: ValidatedRecipient = {
    teamId: "tf-sample-team-01",
    teamName: "ByteForge Innovators",
    leaderName: "Kousi M",
    leaderEmail: "kowshykm@gmail.com",
    sendingStatus: "PENDING",
    errorDetails: "",
    registrationNumber: "CH26-NN7TB4",
    college: "Vel Tech High Tech",
    department: "Computer Science & Engineering",
    membersCount: 3,
  };

  const html = renderTechForgeHtmlEmail({ recipient: sampleRecipient });
  const text = renderTechForgePlainTextEmail({ recipient: sampleRecipient });

  // Verification checks on rendered templates
  if (!html.includes(OFFICIAL_HACKERRANK_URL)) {
    throw new Error(`CRITICAL: Rendered HTML does not contain official URL ${OFFICIAL_HACKERRANK_URL}`);
  }
  if (!text.includes(OFFICIAL_HACKERRANK_URL)) {
    throw new Error(`CRITICAL: Rendered Plain-Text does not contain official URL ${OFFICIAL_HACKERRANK_URL}`);
  }

  const templatesDir = path.join(__dirname, "templates");
  if (!fs.existsSync(templatesDir)) {
    fs.mkdirSync(templatesDir, { recursive: true });
  }

  const htmlPath = path.join(templatesDir, "preview_sample.html");
  const textPath = path.join(templatesDir, "preview_sample.txt");

  fs.writeFileSync(htmlPath, html, "utf-8");
  fs.writeFileSync(textPath, text, "utf-8");

  console.log(`✅ HTML preview generated:       ${htmlPath} (${Buffer.byteLength(html, "utf-8")} bytes)`);
  console.log(`✅ Plain-Text preview generated: ${textPath} (${Buffer.byteLength(text, "utf-8")} bytes)`);
  console.log(`🔗 Verified HackerRank URL:      ${OFFICIAL_HACKERRANK_URL}`);
  console.log(`⏱️ Verified Event Window:        15 October 2026, 12:00 AM IST – 16 October 2026, 12:00 AM IST`);
  console.log(`⏳ Verified Duration:            1 Hour (60 Minutes)`);
  console.log(`👤 Verified Sign-off:            Madhan Kumar, Technical Team Coordinator`);
}

generatePreviews();

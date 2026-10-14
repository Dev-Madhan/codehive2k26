import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

export interface TeamLeaderRecord {
  teamId: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  assignedSlotId: string | null;
  emailStatus: "PENDING" | "SENT" | "FAILED" | "EXCLUDED";
  errorDetails: string;
  registrationNumber?: string;
  phone?: string;
  college?: string;
  department?: string;
  membersCount?: number;
}

async function exportAgentVibeRecipients() {
  console.log("🔍 Fetching AGENT VIBE event and registered teams from Neon DB...");

  const event = await prisma.event.findFirst({
    where: { slug: "agentvibe-2026" },
    include: {
      teams: {
        include: {
          members: true,
          registrations: {
            include: { participant: true },
          },
        },
        orderBy: { createdAt: "asc" },
      },
    },
  });

  if (!event) {
    throw new Error("AGENT VIBE event (agentvibe-2026) not found in database!");
  }

  console.log(`✅ Event Located: ${event.name} (Total teams in DB: ${event.teams.length})`);

  const records: TeamLeaderRecord[] = [];

  for (const team of event.teams) {
    let leader = null;
    let regNumber = "N/A";

    if (team.registrations.length > 0 && team.registrations[0].participant) {
      leader = team.registrations[0].participant;
      regNumber = team.registrations[0].registrationNumber;
    } else {
      leader = await prisma.participant.findUnique({
        where: { id: team.leaderId },
      });
    }

    if (!leader) {
      console.warn(`⚠️ Warning: Team ${team.name} (${team.id}) has no participant record for leaderId ${team.leaderId}`);
      continue;
    }

    records.push({
      teamId: team.id,
      teamName: team.name.trim(),
      leaderName: leader.name.trim(),
      leaderEmail: leader.email.trim().toLowerCase(),
      assignedSlotId: null, // As per specifications: Slot assignments must not be invented
      emailStatus: "PENDING",
      errorDetails: "",
      registrationNumber: regNumber,
      phone: leader.phone || "",
      college: leader.college || "",
      department: leader.department || "",
      membersCount: team.members.length,
    });
  }

  const outputDir = path.join(__dirname, "data");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // 1. Export JSON
  const jsonPath = path.join(outputDir, "recipients.json");
  fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2), "utf-8");
  console.log(`📁 Exported JSON: ${jsonPath} (${records.length} records)`);

  // 2. Export CSV according to required schema:
  // "Team ID, Team name, Team leader name, Team leader email address, Assigned slot ID, if available, Email status, Error details"
  const csvHeaders = [
    "Team ID",
    "Team Name",
    "Team Leader Name",
    "Team Leader Email Address",
    "Assigned Slot ID",
    "Email Status",
    "Error Details",
    "Registration Number",
    "College",
  ];

  const escapeCsv = (val: string | null | undefined) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = records.map((r) => [
    escapeCsv(r.teamId),
    escapeCsv(r.teamName),
    escapeCsv(r.leaderName),
    escapeCsv(r.leaderEmail),
    escapeCsv(r.assignedSlotId || "UNASSIGNED"),
    escapeCsv(r.emailStatus),
    escapeCsv(r.errorDetails),
    escapeCsv(r.registrationNumber),
    escapeCsv(r.college),
  ].join(","));

  const csvContent = [csvHeaders.join(","), ...csvRows].join("\r\n");
  const csvPath = path.join(outputDir, "recipients.csv");
  fs.writeFileSync(csvPath, csvContent, "utf-8");
  console.log(`📁 Exported CSV: ${csvPath} (${records.length} rows)`);

  console.log(`\n🎉 Successfully exported all ${records.length} registered team leaders!`);
}

exportAgentVibeRecipients()
  .catch((err) => {
    console.error("❌ Export error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

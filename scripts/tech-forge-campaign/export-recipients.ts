import { PrismaClient } from "@prisma/client";
import * as fs from "fs";
import * as path from "path";

const prisma = new PrismaClient();

export interface TeamLeaderExportRecord {
  teamId: string;
  teamName: string;
  leaderName: string;
  leaderEmail: string;
  sendingStatus: "PENDING" | "ACCEPTED" | "FAILED" | "EXCLUDED";
  errorDetails: string;
  registrationNumber?: string;
  phone?: string;
  college?: string;
  department?: string;
  membersCount?: number;
}

async function exportTechForgeRecipients() {
  console.log("🔍 Querying Tech Forge event and registered teams from Neon DB...");

  const event = await prisma.event.findFirst({
    where: { slug: "techforge-2026" },
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
    throw new Error("Tech Forge event (slug: 'techforge-2026') not found in database!");
  }

  console.log(`✅ Event Located: ${event.name} (Total teams in DB: ${event.teams.length})`);

  const records: TeamLeaderExportRecord[] = [];
  const incompleteTeams: Array<{ id: string; name: string; reason: string }> = [];

  for (let i = 0; i < event.teams.length; i++) {
    const team = event.teams[i];
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
      // Check if leader can be resolved via user ID
      const user = await prisma.user.findUnique({ where: { id: team.leaderId } });
      if (user) {
        leader = await prisma.participant.findUnique({ where: { userId: user.id } });
      }
    }

    if (!leader) {
      incompleteTeams.push({
        id: team.id,
        name: team.name,
        reason: `No participant profile found for leaderId: ${team.leaderId}`,
      });

      // Include in export with EXCLUDED status so operator has full visibility
      records.push({
        teamId: team.id,
        teamName: team.name.trim(),
        leaderName: "UNRESOLVED_LEADER",
        leaderEmail: "missing-leader@unresolved.codehive.local",
        sendingStatus: "EXCLUDED",
        errorDetails: `Orphaned leaderId (${team.leaderId}) in database. Requires manual resolution.`,
        registrationNumber: regNumber,
        phone: "",
        college: "",
        department: "",
        membersCount: team.members.length,
      });
      continue;
    }

    records.push({
      teamId: team.id,
      teamName: team.name.trim(),
      leaderName: leader.name.trim(),
      leaderEmail: leader.email.trim().toLowerCase(),
      sendingStatus: "PENDING",
      errorDetails: "",
      registrationNumber: regNumber !== "N/A" ? regNumber : undefined,
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

  // 2. Export CSV according to required schema
  const csvHeaders = [
    "Team ID",
    "Team Name",
    "Team Leader Name",
    "Team Leader Email Address",
    "Sending Status",
    "Error Details",
    "Registration Number",
    "Phone",
    "College",
    "Department",
    "Members Count",
  ];

  const escapeCsv = (val: string | number | null | undefined) => {
    if (val === null || val === undefined) return '""';
    const str = String(val).replace(/"/g, '""');
    return `"${str}"`;
  };

  const csvRows = records.map((r) =>
    [
      escapeCsv(r.teamId),
      escapeCsv(r.teamName),
      escapeCsv(r.leaderName),
      escapeCsv(r.leaderEmail),
      escapeCsv(r.sendingStatus),
      escapeCsv(r.errorDetails),
      escapeCsv(r.registrationNumber || "N/A"),
      escapeCsv(r.phone),
      escapeCsv(r.college),
      escapeCsv(r.department),
      escapeCsv(r.membersCount),
    ].join(",")
  );

  const csvContent = [csvHeaders.join(","), ...csvRows].join("\r\n");
  const csvPath = path.join(outputDir, "recipients.csv");
  fs.writeFileSync(csvPath, csvContent, "utf-8");
  console.log(`📁 Exported CSV:  ${csvPath} (${records.length} rows)`);

  console.log(`\n================ EXPORT AUDIT SUMMARY ================`);
  console.log(`Total Teams Found:             ${records.length}`);
  console.log(`Teams with Valid Leaders:       ${records.length - incompleteTeams.length}`);
  console.log(`Incomplete / Orphaned Teams:   ${incompleteTeams.length}`);

  if (incompleteTeams.length > 0) {
    console.warn(`\n⚠️  ACTION REQUIRED FOR 67-RECIPIENT APPROVAL:`);
    for (const t of incompleteTeams) {
      console.warn(`   - Team: "${t.name}" (ID: ${t.id}) — ${t.reason}`);
    }
    console.warn(
      `   Note: To satisfy the 67 approved team leaders rule, resolve the incomplete record in data/recipients.csv / recipients.json or DB before live send.`
    );
  } else {
    console.log(`🎉 All ${records.length} teams have valid leaders ready for validation!`);
  }
}

exportTechForgeRecipients()
  .catch((err) => {
    console.error("❌ Export error:", err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());

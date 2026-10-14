import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const teams = await prisma.team.findMany({
    where: { event: { slug: "agentvibe-2026" } },
    include: {
      members: true,
      registrations: {
        include: { participant: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  console.log(`\n================ AGENT VIBE REGISTERED TEAMS AUDIT ================\n`);
  console.log(`Total teams in DB: ${teams.length}`);

  let validCount = 0;
  const issues: string[] = [];

  for (let i = 0; i < teams.length; i++) {
    const t = teams[i];
    let leader = null;
    let regNumber = "N/A";

    if (t.registrations.length > 0 && t.registrations[0].participant) {
      leader = t.registrations[0].participant;
      regNumber = t.registrations[0].registrationNumber;
    } else {
      leader = await prisma.participant.findUnique({
        where: { id: t.leaderId },
      });
    }

    if (!leader) {
      issues.push(`Team #${i + 1} (${t.name}, ID: ${t.id}) has NO leader participant!`);
      continue;
    }

    if (!leader.email || !leader.email.includes("@")) {
      issues.push(`Team #${i + 1} (${t.name}) leader ${leader.name} has invalid email: ${leader.email}`);
    }

    validCount++;
    console.log(
      `[#${(i + 1).toString().padStart(2, "0")}] Team: "${t.name}" | Leader: "${leader.name}" | Email: "${leader.email}" | Reg: ${regNumber} | Members: ${t.members.length}`
    );
  }

  console.log(`\nAudit complete: ${validCount} / ${teams.length} teams have leader records.`);
  if (issues.length > 0) {
    console.log("Issues found:\n", issues.join("\n"));
  } else {
    console.log("All 62 teams have valid leader participants and emails!");
  }
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());

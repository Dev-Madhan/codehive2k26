import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding CodeHive 2K26 database...");

  // Seed Event Categories
  const technicalCategory = await prisma.eventCategory.upsert({
    where: { slug: "technical" },
    update: {},
    create: {
      name: "Technical",
      slug: "technical",
      description: "Coding, Hackathons, Web Development, and AI challenges.",
    },
  });

  const nonTechnicalCategory = await prisma.eventCategory.upsert({
    where: { slug: "non-technical" },
    update: {},
    create: {
      name: "Non-Technical",
      slug: "non-technical",
      description: "Gaming, Quiz, Design, and Creative competitions.",
    },
  });

  // Seed TECHFORGE Event (from Events.md)
  const techforge = await prisma.event.upsert({
    where: { slug: "techforge-2026" },
    update: {
      name: "TECHFORGE",
      minTeamSize: 1,
      maxTeamSize: 3,
      description:
        "The flagship 2-day progressive technical challenge of CodeHive 2K26. Teams design, develop, and defend an enterprise-grade software solution across multiple rounds, testing core system architecture, practical engineering, and adaptability under pressure.",
    },
    create: {
      name: "TECHFORGE",
      slug: "techforge-2026",
      description:
        "The flagship 2-day progressive technical challenge of CodeHive 2K26. Teams design, develop, and defend an enterprise-grade software solution across multiple rounds, testing core system architecture, practical engineering, and adaptability under pressure.",
      venue: "Main Auditorium & Computing Center",
      startAt: new Date("2026-10-15T10:00:00Z"),
      endAt: new Date("2026-10-16T15:30:00Z"),
      capacity: 120,
      registrationOpen: true,
      registrationDeadline: new Date("2026-10-14T23:59:59Z"),
      status: "PUBLISHED",
      categoryId: technicalCategory.id,
      isTeamEvent: true,
      minTeamSize: 1,
      maxTeamSize: 3,
    },
  });

  // Seed AGENTVIBE Event (from Agentvibe.md)
  const agentvibe = await prisma.event.upsert({
    where: { slug: "agentvibe-2026" },
    update: {
      name: "AGENTVIBE",
      minTeamSize: 1,
      maxTeamSize: 3,
      description:
        "The premier AI agent engineering challenge of CodeHive 2K26. Teams design, build, and deploy an autonomous productivity agent that understands context, connects data, and executes real-world actions safely.",
    },
    create: {
      name: "AGENTVIBE",
      slug: "agentvibe-2026",
      description:
        "The premier AI agent engineering challenge of CodeHive 2K26. Teams design, build, and deploy an autonomous productivity agent that understands context, connects data, and executes real-world actions safely.",
      venue: "AI Innovation Lab & Tech Center",
      startAt: new Date("2026-10-15T10:30:00Z"),
      endAt: new Date("2026-10-16T15:30:00Z"),
      capacity: 100,
      registrationOpen: true,
      registrationDeadline: new Date("2026-10-14T23:59:59Z"),
      status: "PUBLISHED",
      categoryId: technicalCategory.id,
      isTeamEvent: true,
      minTeamSize: 1,
      maxTeamSize: 3,
    },
  });

  console.log("✅ Seed completed:", {
    categories: [technicalCategory.name, nonTechnicalCategory.name],
    events: [techforge.name, agentvibe.name],
  });
}

main()
  .catch((e) => {
    console.error("❌ Seeding error:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

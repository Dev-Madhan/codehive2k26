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

  // Seed TECH FORGE Event (from official poster)
  const techforge = await prisma.event.upsert({
    where: { slug: "techforge-2026" },
    update: {
      name: "TECH FORGE",
      minTeamSize: 1,
      maxTeamSize: 3,
      venue: "Palani Murugan Hall of Fame, Vel Tech Multi Tech, Avadi",
      startAt: new Date("2026-10-23T08:30:00Z"),
      endAt: new Date("2026-10-24T15:30:00Z"),
      registrationDeadline: new Date("2026-10-22T23:59:59Z"),
      description:
        "TECHFORGE is a 2-day technical challenge where you Analyze, Build, Adapt & Defend. Solve a real-world problem, develop your solution, and face a surprise technical challenge that will test your coding, problem-solving, and innovation skills.",
    },
    create: {
      name: "TECH FORGE",
      slug: "techforge-2026",
      description:
        "TECHFORGE is a 2-day technical challenge where you Analyze, Build, Adapt & Defend. Solve a real-world problem, develop your solution, and face a surprise technical challenge that will test your coding, problem-solving, and innovation skills.",
      venue: "Palani Murugan Hall of Fame, Vel Tech Multi Tech, Avadi",
      startAt: new Date("2026-10-23T08:30:00Z"),
      endAt: new Date("2026-10-24T15:30:00Z"),
      capacity: 120,
      registrationOpen: true,
      registrationDeadline: new Date("2026-10-22T23:59:59Z"),
      status: "PUBLISHED",
      categoryId: technicalCategory.id,
      isTeamEvent: true,
      minTeamSize: 1,
      maxTeamSize: 3,
    },
  });

  // Seed AGENT VIBE Event (from official poster)
  const agentvibe = await prisma.event.upsert({
    where: { slug: "agentvibe-2026" },
    update: {
      name: "AGENT VIBE",
      minTeamSize: 1,
      maxTeamSize: 3,
      venue: "Palani Murugan Hall of Fame, Vel Tech Multi Tech, Avadi",
      startAt: new Date("2026-10-23T08:30:00Z"),
      endAt: new Date("2026-10-24T15:30:00Z"),
      registrationDeadline: new Date("2026-10-22T23:59:59Z"),
      description:
        "AGENT VIBE is a 2-day AI challenge where you Imagine, Build, Adapt & Deploy. Design and develop intelligent AI agents to solve real-world problems, then tackle surprise challenges that will test your creativity, AI skills, and ability to innovate using LLMs, APIs, and modern AI tools.",
    },
    create: {
      name: "AGENT VIBE",
      slug: "agentvibe-2026",
      description:
        "AGENT VIBE is a 2-day AI challenge where you Imagine, Build, Adapt & Deploy. Design and develop intelligent AI agents to solve real-world problems, then tackle surprise challenges that will test your creativity, AI skills, and ability to innovate using LLMs, APIs, and modern AI tools.",
      venue: "Palani Murugan Hall of Fame, Vel Tech Multi Tech, Avadi",
      startAt: new Date("2026-10-23T08:30:00Z"),
      endAt: new Date("2026-10-24T15:30:00Z"),
      capacity: 100,
      registrationOpen: true,
      registrationDeadline: new Date("2026-10-22T23:59:59Z"),
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

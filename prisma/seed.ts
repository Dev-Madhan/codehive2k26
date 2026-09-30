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

  // Seed Sample Event
  const hackathon = await prisma.event.upsert({
    where: { slug: "codehive-hackathon-2026" },
    update: {},
    create: {
      name: "CodeHive Grand Hackathon",
      slug: "codehive-hackathon-2026",
      description:
        "The flagship 24-hour hackathon of CodeHive 2K26. Build innovative solutions for real-world problems.",
      venue: "Main Auditorium, Tech Campus",
      startAt: new Date("2026-10-15T09:00:00Z"),
      endAt: new Date("2026-10-16T09:00:00Z"),
      capacity: 100,
      registrationOpen: true,
      registrationDeadline: new Date("2026-10-12T23:59:59Z"),
      status: "PUBLISHED",
      categoryId: technicalCategory.id,
      isTeamEvent: true,
      minTeamSize: 2,
      maxTeamSize: 4,
    },
  });

  console.log("✅ Seed completed:", {
    categories: [technicalCategory.name, nonTechnicalCategory.name],
    sampleEvent: hackathon.name,
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

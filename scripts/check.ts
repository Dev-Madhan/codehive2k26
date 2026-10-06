import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main() {
  const registrations = await prisma.registration.findMany({
    take: 2,
    include: {
      participant: true,
      event: true,
      team: {
        include: {
          members: true,
        },
      },
    },
  });

  console.log(JSON.stringify(registrations, null, 2));
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });

import { PrismaClient } from '@prisma/client';
import { sendEventPostponedEmail } from '../lib/mailer';

const prisma = new PrismaClient();

async function main() {
  const participants = await prisma.participant.findMany({
    where: {
      name: { in: ['SUSHMITHA T', 'Naga Sai Pradhyumna Poola'] }
    },
    include: {
      registrations: {
        include: {
          event: true,
          team: {
            include: {
              members: true
            }
          }
        }
      }
    }
  });

  for (const participant of participants) {
    for (const registration of participant.registrations) {
      console.log(`Sending email for ${participant.name} to ${participant.email}...`);
      
      const formattedDate = registration.event.startAt.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
        year: "numeric"
      });
      
      await sendEventPostponedEmail({
        to: participant.email,
        participantName: participant.name,
        eventName: registration.event.name,
        registrationNumber: registration.registrationNumber,
        venue: registration.event.venue,
        date: formattedDate,
        teamName: registration.team?.name,
        college: participant.college,
        department: participant.department,
        members: registration.team?.members.map((m: any) => ({
          name: m.name,
          phone: m.phone,
          transportOptIn: m.transportOptIn,
          pickupRoute: m.pickupRoute,
          pickupStop: m.pickupStop,
          pickupLandmark: m.pickupLandmark
        })) || [],
        transportOptIn: registration.transportOptIn,
        samePickupForTeam: registration.samePickupForTeam,
        pickupRoute: registration.pickupRoute,
        pickupStop: registration.pickupStop,
        pickupLandmark: registration.pickupLandmark,
        passengersCount: registration.passengersCount,
      });
      console.log(`Email sent to ${participant.email}!`);
    }
  }
}

main().catch(e => console.error(e)).finally(() => prisma.$disconnect());

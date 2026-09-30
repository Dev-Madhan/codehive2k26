import { Header } from "@/components/header";
import prisma from "@/lib/prisma";
import { generateQrDataUrl } from "@/lib/qr";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/formatters";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RegistrationViewPage({ params }: Props) {
  const { id } = await params;

  const registration = await prisma.registration.findFirst({
    where: {
      OR: [{ id }, { registrationNumber: id }, { qrToken: id }],
    },
    include: {
      event: true,
      participant: true,
    },
  });

  if (!registration) {
    notFound();
  }

  const qrDataUrl = await generateQrDataUrl(registration.qrToken);

  return (
    <div className="min-h-screen bg-background text-foreground">
      <Header />
      <div className="max-w-md mx-auto px-4 py-12">
        <div className="rounded-xl border border-border bg-surface p-6 shadow-xl space-y-6 text-center">
          <div>
            <span className="text-xs uppercase tracking-wider text-cyan font-bold">
              CodeHive 2K26 Pass
            </span>
            <h1 className="text-2xl font-bold mt-1">{registration.event.name}</h1>
          </div>

          <div className="flex justify-center p-4 bg-white rounded-lg">
            <img src={qrDataUrl} alt="Check-in QR" className="size-48" />
          </div>

          <div className="space-y-1">
            <p className="text-xs text-muted">Registration ID</p>
            <p className="font-mono font-bold text-lg text-cyan">{registration.registrationNumber}</p>
          </div>

          <div className="text-left text-xs space-y-2 border-t border-border pt-4">
            <div className="flex justify-between">
              <span className="text-muted">Participant:</span>
              <span className="font-semibold">{registration.participant.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">College:</span>
              <span className="font-semibold">{registration.participant.college}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Date:</span>
              <span className="font-semibold">{formatDate(registration.event.startAt)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Venue:</span>
              <span className="font-semibold">{registration.event.venue}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted">Status:</span>
              <span className="font-semibold text-success">{registration.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

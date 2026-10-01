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
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-md mx-auto px-4 py-12">
        {/* Terminal Pass Container (Reference Image 1 & 2 layout) */}
        <div className="rounded-none border border-[#152A54] bg-[#060D1A] p-6 shadow-2xl space-y-6 text-center">
          {/* Top Status Header */}
          <div className="border-b border-[#152A54] pb-4">
            <span className="font-mono text-[11px] uppercase tracking-wider text-blue-400 font-bold bg-blue-600/15 border border-blue-500/30 px-2.5 py-0.5 inline-block">
              &gt; CodeHive 2K26 // Verified Pass
            </span>
            <h1 className="text-xl font-mono font-bold mt-2 text-white">
              {registration.event.name}
            </h1>
          </div>

          {/* QR Code Inset Box */}
          <div className="flex justify-center p-4 bg-white rounded-none border-2 border-[#152A54]">
            <img src={qrDataUrl} alt="Check-in QR" className="size-48" />
          </div>

          {/* ID Strip */}
          <div className="border border-[#152A54] bg-[#03060E] p-3 space-y-0.5">
            <span className="text-[10px] font-mono uppercase text-slate-500">
              REGISTRATION ID
            </span>
            <p className="font-mono font-bold text-base text-blue-400 tracking-wider">
              {registration.registrationNumber}
            </p>
          </div>

          {/* Metadata Table */}
          <div className="text-left font-mono text-xs space-y-2 border-t border-[#152A54] pt-4">
            <div className="flex justify-between border-b border-[#152A54]/50 pb-1.5">
              <span className="text-slate-400 uppercase text-[11px]">Participant:</span>
              <span className="font-semibold text-white">{registration.participant.name}</span>
            </div>
            <div className="flex justify-between border-b border-[#152A54]/50 pb-1.5">
              <span className="text-slate-400 uppercase text-[11px]">College:</span>
              <span className="font-semibold text-white truncate max-w-[200px]">{registration.participant.college}</span>
            </div>
            <div className="flex justify-between border-b border-[#152A54]/50 pb-1.5">
              <span className="text-slate-400 uppercase text-[11px]">Date:</span>
              <span className="font-semibold text-white">{formatDate(registration.event.startAt)}</span>
            </div>
            <div className="flex justify-between border-b border-[#152A54]/50 pb-1.5">
              <span className="text-slate-400 uppercase text-[11px]">Venue:</span>
              <span className="font-semibold text-white">{registration.event.venue}</span>
            </div>
            <div className="flex justify-between pt-0.5">
              <span className="text-slate-400 uppercase text-[11px]">Status:</span>
              <span className="font-bold text-blue-400">[ {registration.status} ]</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

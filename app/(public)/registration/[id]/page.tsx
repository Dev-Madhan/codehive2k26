import { Header } from "@/components/header";
import prisma from "@/lib/prisma";
import { generateQrDataUrl } from "@/lib/qr";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/formatters";
import Link from "next/link";
import { ShieldCheckIcon, CheckCircle2Icon, UsersIcon, CalendarIcon, MapPinIcon, BuildingIcon, BusIcon } from "lucide-react";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

export default async function RegistrationViewPage({ params }: Props) {
  const { id } = await params;

  // Search by registration ID, registrationNumber (e.g. CH26-XXXXXX), or qrToken
  const registration = await prisma.registration.findFirst({
    where: {
      OR: [{ id }, { registrationNumber: id }, { qrToken: id }],
    },
    include: {
      event: true,
      participant: true,
      checkIn: true,
      team: {
        include: {
          members: true,
        },
      },
    },
  });

  if (!registration) {
    notFound();
  }

  // The QR code encodes the live URL for real-time verification
  const livePassUrl = `https://codehive2k26.vercel.app/registration/${registration.registrationNumber}`;
  const qrDataUrl = await generateQrDataUrl(livePassUrl);

  const isCheckedIn = Boolean(registration.checkedIn || registration.checkIn);
  const isTeam = Boolean(registration.team && registration.team.members.length > 0);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Header />
      <main className="max-w-xl mx-auto px-4 py-10 sm:py-16">
        
        {/* Real-Time Digital Entry Pass Card */}
        <div className="relative rounded-none border border-[#262626] bg-[#080808] p-6 sm:p-8 shadow-2xl space-y-6 text-center">
          
          {/* Top Status Header */}
          <div className="border-b border-[#262626] pb-5 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono font-bold tracking-wider uppercase border rounded-none bg-[#161616] border-white/40 text-white">
              <ShieldCheckIcon className="size-3.5 text-white" />
              <span>Official Digital Entry Pass</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase font-mono">
              {registration.event.name}
            </h1>
            <p className="text-xs font-mono text-[#737373] uppercase tracking-widest">
              CodeHive 2K26 &bull; Verified Pass
            </p>
          </div>

          {/* Pass Status Banner */}
          <div className={`p-3.5 border text-center transition-all ${
            isCheckedIn 
              ? "bg-[#161616] border-white text-white"
              : "bg-[#0F0F0F] border-[#404040] text-neutral-300"
          }`}>
            <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
              {isCheckedIn ? (
                <>
                  <CheckCircle2Icon className="size-4 text-white" />
                  <span>[ ATTENDANCE VERIFIED // CHECKED IN ]</span>
                </>
              ) : (
                <>
                  <span className="size-2 rounded-full bg-white animate-pulse" />
                  <span>[ PASS CONFIRMED // READY FOR GATE ENTRY ]</span>
                </>
              )}
            </div>
            {isCheckedIn && registration.checkIn && (
              <p className="text-[11px] font-mono text-[#A3A3A3] mt-1">
                Checked in on: {new Date(registration.checkIn.checkedInAt).toLocaleString("en-IN")}
              </p>
            )}
          </div>

          {/* Scannable Real-Time QR Code */}
          <div className="flex flex-col items-center justify-center p-5 bg-white rounded-none border-2 border-white shadow-md">
            <img 
              src={qrDataUrl} 
              alt={`QR Pass for ${registration.registrationNumber}`} 
              className="size-52 object-contain" 
            />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-black mt-2">
              Scan for Real-Time Gate Authorization
            </span>
          </div>

          {/* Pass Code Highlight Box */}
          <div className="border-2 border-white/80 bg-[#0F0F0F] p-4 text-center space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-[#A3A3A3] font-bold block">
              [ YOUR OFFICIAL PASS CODE ]
            </span>
            <p className="font-mono font-extrabold text-3xl text-white tracking-[0.2em]">
              {registration.registrationNumber}
            </p>
            <p className="text-[11px] text-neutral-400 font-mono">
              Quote this code or present the QR code at the registration desk
            </p>
          </div>

          {/* Metadata Table */}
          <div className="text-left font-mono text-xs space-y-2.5 border-t border-[#262626] pt-5">
            <div className="flex items-center justify-between border-b border-[#262626] pb-2">
              <span className="text-neutral-400 uppercase text-[11px]">Participant:</span>
              <span className="font-semibold text-white">{registration.participant.name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#262626] pb-2">
              <span className="text-neutral-400 uppercase text-[11px]">College:</span>
              <span className="font-semibold text-white truncate max-w-[220px]">{registration.participant.college}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#262626] pb-2">
              <span className="text-neutral-400 uppercase text-[11px]">Department:</span>
              <span className="font-semibold text-white">{registration.participant.department}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#262626] pb-2">
              <span className="text-neutral-400 uppercase text-[11px]">Date &amp; Time:</span>
              <span className="font-semibold text-white">{formatDate(registration.event.startAt)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#262626] pb-2">
              <span className="text-neutral-400 uppercase text-[11px]">Venue:</span>
              <span className="font-semibold text-white">{registration.event.venue}</span>
            </div>
          </div>

          {/* Vel Tech Campus Bus Logistics Pass Detail */}
          {registration.transportOptIn ? (
            <div className="border border-[#262626] bg-[#0F0F0F] p-4 text-left font-mono space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#262626] pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase">
                  <BusIcon className="size-4" />
                  <span>Vel Tech Bus Transit Pass</span>
                </div>
                <span className="text-[10px] font-bold text-white px-2 py-0.5 border border-[#404040] bg-[#161616]">
                  6:00 AM ONWARDS
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-neutral-400 uppercase text-[10px] block">Designated Route Corridor:</span>
                  <strong className="text-white">{registration.pickupRoute || "Vel Tech Campus Network"}</strong>
                </div>
                <div>
                  <span className="text-neutral-400 uppercase text-[10px] block">Boarding Stop &amp; Exact Landmark:</span>
                  <span className="text-white font-semibold">{registration.pickupStop}</span>
                  <span className="text-neutral-400"> &bull; {registration.pickupLandmark}</span>
                </div>
                <p className="text-[10px] text-neutral-400 pt-1 leading-relaxed border-t border-[#262626] mt-1">
                  Advisory: Vel Tech buses operate from 6:00 AM onwards. Report to your boarding landmark by 06:00 AM sharp.
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-[#262626] bg-[#0F0F0F] p-3 text-left font-mono text-xs text-neutral-400">
              <span className="text-[#737373] uppercase text-[10px] block">Transportation:</span>
              <span>Self-Arranged Commute (Direct to Vel Tech Campus)</span>
            </div>
          )}

          {/* Team Roster (if team registration) */}
          {isTeam && registration.team && (
            <div className="border border-[#262626] bg-[#0F0F0F] p-4 text-left font-mono space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-white uppercase border-b border-[#262626] pb-2">
                <UsersIcon className="size-3.5 text-white" />
                <span>Team: {registration.team.name}</span>
              </div>
              <ul className="text-xs text-neutral-300 space-y-1.5 pt-1">
                {registration.team.members.map((member, idx) => (
                  <li key={member.id} className="flex justify-between items-center text-[11px]">
                    <span>
                      <strong className="text-white">[{idx + 1}] {member.name}</strong>
                    </span>
                    <span className="text-[#737373]">{member.phone}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Links & Admin Check-In Shortcut */}
          <div className="border-t border-[#262626] pt-5 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/admin/check-in?code=${registration.registrationNumber}`}
              className="flex-1 inline-flex items-center justify-center h-10 px-4 text-xs font-mono font-bold uppercase tracking-wider bg-white hover:bg-neutral-200 text-black transition-colors border border-white cursor-pointer"
            >
              &gt; Staff Gate Check-In
            </Link>
            <Link
              href="/events"
              className="flex-1 inline-flex items-center justify-center h-10 px-4 text-xs font-mono font-bold uppercase tracking-wider bg-[#161616] hover:bg-[#1F1F1F] text-white hover:border-white transition-colors border border-[#262626] cursor-pointer"
            >
              &gt; Explore More Events
            </Link>
          </div>

          {/* Footer note */}
          <p className="text-[10px] font-mono text-[#737373] uppercase tracking-widest pt-2">
            CodeHive 2K26 &bull; Secure Gate Authorization System
          </p>

        </div>
      </main>
    </div>
  );
}

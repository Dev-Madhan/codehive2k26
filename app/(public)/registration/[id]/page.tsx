import { Header } from "@/components/header";
import prisma from "@/lib/prisma";
import { generateQrDataUrl } from "@/lib/qr";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/formatters";
import Link from "next/link";
import { ShieldCheckIcon, CheckCircle2Icon, UsersIcon, CalendarIcon, MapPinIcon, BuildingIcon, BusIcon } from "lucide-react";

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
    <div className="min-h-screen bg-[#030712] text-slate-100 font-sans selection:bg-blue-600 selection:text-white">
      <Header />
      <main className="max-w-xl mx-auto px-4 py-10 sm:py-16">
        
        {/* Real-Time Digital Entry Pass Card */}
        <div className="relative rounded-none border border-[#1E293B] bg-[#080F1E] p-6 sm:p-8 shadow-2xl shadow-blue-950/20 space-y-6 text-center">
          
          {/* Top Status Header */}
          <div className="border-b border-[#1E293B] pb-5 space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 text-[11px] font-mono font-bold tracking-wider uppercase border rounded-none bg-blue-600/15 border-blue-500/30 text-sky-400">
              <ShieldCheckIcon className="size-3.5 text-emerald-400" />
              <span>Official Digital Entry Pass</span>
            </div>
            <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
              {registration.event.name}
            </h1>
            <p className="text-xs font-mono text-slate-400 uppercase tracking-widest">
              CodeHive 2K26 &bull; Verified Pass
            </p>
          </div>

          {/* Pass Status Banner */}
          <div className={`p-3.5 border text-center transition-all ${
            isCheckedIn 
              ? "bg-emerald-950/30 border-emerald-500/40 text-emerald-300"
              : "bg-blue-950/30 border-blue-500/40 text-sky-300"
          }`}>
            <div className="flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-wider">
              {isCheckedIn ? (
                <>
                  <CheckCircle2Icon className="size-4 text-emerald-400" />
                  <span>[ ATTENDANCE VERIFIED // CHECKED IN ]</span>
                </>
              ) : (
                <>
                  <span className="size-2 rounded-full bg-sky-400 animate-pulse" />
                  <span>[ PASS CONFIRMED // READY FOR GATE ENTRY ]</span>
                </>
              )}
            </div>
            {isCheckedIn && registration.checkIn && (
              <p className="text-[11px] font-mono text-emerald-400/80 mt-1">
                Checked in on: {new Date(registration.checkIn.checkedInAt).toLocaleString("en-IN")}
              </p>
            )}
          </div>

          {/* Scannable Real-Time QR Code */}
          <div className="flex flex-col items-center justify-center p-5 bg-white rounded-none border-2 border-sky-400 shadow-md">
            <img 
              src={qrDataUrl} 
              alt={`QR Pass for ${registration.registrationNumber}`} 
              className="size-52 object-contain" 
            />
            <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-slate-700 mt-2">
              Scan for Real-Time Gate Authorization
            </span>
          </div>

          {/* Pass Code Highlight Box */}
          <div className="border-2 border-blue-600 bg-[#050E24] p-4 text-center space-y-1">
            <span className="text-[11px] font-mono uppercase tracking-widest text-blue-400 font-bold block">
              [ YOUR OFFICIAL PASS CODE ]
            </span>
            <p className="font-mono font-extrabold text-3xl text-sky-400 tracking-[0.2em]">
              {registration.registrationNumber}
            </p>
            <p className="text-[11px] text-slate-400">
              Quote this code or present the QR code at the registration desk
            </p>
          </div>

          {/* Metadata Table */}
          <div className="text-left font-mono text-xs space-y-2.5 border-t border-[#1E293B] pt-5">
            <div className="flex items-center justify-between border-b border-[#1E293B]/70 pb-2">
              <span className="text-slate-400 uppercase text-[11px]">Participant:</span>
              <span className="font-semibold text-white">{registration.participant.name}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#1E293B]/70 pb-2">
              <span className="text-slate-400 uppercase text-[11px]">College:</span>
              <span className="font-semibold text-white truncate max-w-[220px]">{registration.participant.college}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#1E293B]/70 pb-2">
              <span className="text-slate-400 uppercase text-[11px]">Department:</span>
              <span className="font-semibold text-white">{registration.participant.department}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#1E293B]/70 pb-2">
              <span className="text-slate-400 uppercase text-[11px]">Date &amp; Time:</span>
              <span className="font-semibold text-white">{formatDate(registration.event.startAt)}</span>
            </div>
            <div className="flex items-center justify-between border-b border-[#1E293B]/70 pb-2">
              <span className="text-slate-400 uppercase text-[11px]">Venue:</span>
              <span className="font-semibold text-sky-400">{registration.event.venue}</span>
            </div>
          </div>

          {/* Vel Tech Campus Bus Logistics Pass Detail */}
          {registration.transportOptIn ? (
            <div className="border border-sky-500/40 bg-[#040C1E] p-4 text-left font-mono space-y-2.5">
              <div className="flex items-center justify-between border-b border-[#1E293B] pb-2">
                <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase">
                  <BusIcon className="size-4" />
                  <span>Vel Tech Bus Transit Pass</span>
                </div>
                <span className="text-[10px] font-bold text-sky-400 px-2 py-0.5 border border-sky-500/30 bg-sky-500/10">
                  6:00 AM ONWARDS
                </span>
              </div>

              <div className="space-y-1.5 text-xs">
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block">Designated Route Corridor:</span>
                  <strong className="text-white">{registration.pickupRoute || "Vel Tech Campus Network"}</strong>
                </div>
                <div>
                  <span className="text-slate-500 uppercase text-[10px] block">Boarding Stop &amp; Exact Landmark:</span>
                  <span className="text-sky-300 font-semibold">{registration.pickupStop}</span>
                  <span className="text-slate-300"> &bull; {registration.pickupLandmark}</span>
                </div>
                <p className="text-[10px] text-slate-400 pt-1 leading-relaxed border-t border-[#1E293B]/60 mt-1">
                  Advisory: Vel Tech buses operate from 6:00 AM onwards. Report to your boarding landmark by 06:00 AM sharp.
                </p>
              </div>
            </div>
          ) : (
            <div className="border border-[#1E293B] bg-[#040914] p-3 text-left font-mono text-xs text-slate-400">
              <span className="text-slate-500 uppercase text-[10px] block">Transportation:</span>
              <span>Self-Arranged Commute (Direct to Vel Tech Campus)</span>
            </div>
          )}

          {/* Team Roster (if team registration) */}
          {isTeam && registration.team && (
            <div className="border border-[#1E293B] bg-[#040914] p-4 text-left font-mono space-y-2">
              <div className="flex items-center gap-1.5 text-xs font-bold text-sky-400 uppercase border-b border-[#1E293B] pb-2">
                <UsersIcon className="size-3.5" />
                <span>Team: {registration.team.name}</span>
              </div>
              <ul className="text-xs text-slate-300 space-y-1.5 pt-1">
                {registration.team.members.map((member, idx) => (
                  <li key={member.id} className="flex justify-between items-center text-[11px]">
                    <span>
                      <strong className="text-white">[{idx + 1}] {member.name}</strong>
                    </span>
                    <span className="text-slate-500">{member.phone}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Action Links & Admin Check-In Shortcut */}
          <div className="border-t border-[#1E293B] pt-5 flex flex-col sm:flex-row gap-3">
            <Link
              href={`/admin/check-in?code=${registration.registrationNumber}`}
              className="flex-1 inline-flex items-center justify-center h-10 px-4 text-xs font-mono font-bold uppercase tracking-wider bg-blue-600 hover:bg-blue-700 text-white transition-colors border border-blue-500"
            >
              &gt; Staff Gate Check-In
            </Link>
            <Link
              href="/dashboard"
              className="flex-1 inline-flex items-center justify-center h-10 px-4 text-xs font-mono font-bold uppercase tracking-wider bg-[#030712] hover:bg-[#0B1528] text-slate-300 hover:text-white transition-colors border border-[#1E293B]"
            >
              Return to Dashboard
            </Link>
          </div>

          {/* Footer note */}
          <p className="text-[10px] font-mono text-slate-500 uppercase tracking-widest pt-2">
            CodeHive 2K26 &bull; Secure Gate Authorization System
          </p>

        </div>
      </main>
    </div>
  );
}

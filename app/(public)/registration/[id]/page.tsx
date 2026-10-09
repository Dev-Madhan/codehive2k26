import { Header } from "@/components/header";
import prisma from "@/lib/prisma";
import { generateQrDataUrl } from "@/lib/qr";
import { notFound } from "next/navigation";
import { formatDate } from "@/utils/formatters";
import Link from "next/link";
import { ShieldCheckIcon, CheckCircle2Icon, UsersIcon, CalendarIcon, MapPinIcon, BuildingIcon, BusIcon } from "lucide-react";

import { auth } from "@/lib/auth";
import { headers } from "next/headers";

export const dynamic = "force-dynamic";
export const revalidate = 0;

interface Props {
  params: Promise<{ id: string }>;
}

function maskPhoneNumber(phone?: string | null): string {
  if (!phone) return "-";
  const cleaned = phone.trim();
  if (cleaned.length <= 4) return "****";
  return cleaned.slice(0, 2) + "******" + cleaned.slice(-2);
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

  // Determine viewer permissions (Owner or Admin gets unmasked PII)
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const isOwner = session?.user?.id === registration.participant.userId;
  const isAdmin = ((session?.user as { role?: string })?.role || "").toUpperCase() === "ADMIN";
  const canViewFullDetails = isOwner || isAdmin;

  // Dynamic base URL resolution for digital pass QR
  const baseUrl =
    process.env.NEXT_PUBLIC_APP_URL ||
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : "https://codehive2k26.vercel.app");
  const livePassUrl = `${baseUrl.replace(/\/+$/, "")}/registration/${registration.registrationNumber}`;
  const qrDataUrl = await generateQrDataUrl(livePassUrl);

  const isCheckedIn = Boolean(registration.checkedIn || registration.checkIn);
  const isTeam = Boolean(registration.team && registration.team.members.length > 0);

  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-white selection:text-black">
      <Header />
      <main className="max-w-xl mx-auto px-3 sm:px-4 py-6 sm:py-16">
        
        {/* Real-Time Digital Entry Pass Card */}
        <div className="relative rounded-none border border-[#262626] bg-[#080808] p-4 sm:p-7 md:p-8 shadow-2xl space-y-5 sm:space-y-6 text-center">
          
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
                  {registration.passengersCount} SEAT{registration.passengersCount > 1 ? "S" : ""} RESERVED
                </span>
              </div>

              {registration.samePickupForTeam || !registration.team || registration.team.members.length === 0 ? (
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
                    Advisory: Vel Tech buses commence pickup from 05:45 AM onwards. Please report to your boarding stop 10 minutes prior to scheduled pickup time.
                  </p>
                </div>
              ) : (
                <div className="space-y-2 divide-y divide-[#262626] text-xs">
                  <div className="space-y-0.5">
                    <span className="font-bold text-white">Leader ({registration.participant.name}):</span>
                    <p className="text-neutral-300">{registration.pickupRoute} &gt; {registration.pickupStop}</p>
                    <p className="text-[10px] text-[#737373]">Landmark: {registration.pickupLandmark}</p>
                  </div>
                  {registration.team.members.map((member, idx) => (
                    <div key={member.id} className="pt-2 space-y-0.5">
                      <span className="font-bold text-neutral-300">Member {idx + 2} ({member.name}):</span>
                      {member.transportOptIn ? (
                        <>
                          <p className="text-neutral-300">{member.pickupRoute} &gt; {member.pickupStop}</p>
                          <p className="text-[10px] text-[#737373]">Landmark: {member.pickupLandmark}</p>
                        </>
                      ) : (
                        <div className="pt-0.5">
                          <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-white bg-[#161616] border border-[#262626]">
                            🚗 Own Transport (Self-Arranged Commute)
                          </span>
                        </div>
                      )}
                    </div>
                  ))}
                  <p className="text-[10px] text-neutral-400 pt-2 leading-relaxed border-t border-[#262626]">
                    Advisory: Vel Tech buses commence pickup from 05:45 AM onwards. Please report to your boarding stop 10 minutes prior to scheduled pickup time.
                  </p>
                </div>
              )}
            </div>
          ) : (
            <div className="border border-[#262626] bg-[#0F0F0F] p-3 text-left font-mono text-xs text-neutral-400">
              <span className="text-[#737373] uppercase text-[10px] block">Transportation:</span>
              <div className="flex items-center gap-2 mt-1">
                <span className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] font-mono font-bold uppercase text-white bg-[#161616] border border-[#262626]">
                  🚗 Own Transportation (Direct to Campus)
                </span>
              </div>
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
                    <span className="text-[#737373]">
                      {canViewFullDetails ? member.phone : maskPhoneNumber(member.phone)}
                    </span>
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

"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { RegistrationSuccessPayload } from "@/types/registration";
import {
  CheckCircle2Icon,
  CopyIcon,
  CheckIcon,
  PrinterIcon,
  CalendarIcon,
  MapPinIcon,
  UsersIcon,
  UserIcon,
  BuildingIcon,
  ArrowRightIcon,
  ShieldCheckIcon,
  SparklesIcon,
  BusIcon,
} from "lucide-react";

interface DigitalEventPassProps {
  ticket: RegistrationSuccessPayload;
  onRegisterAnother?: () => void;
}

export function DigitalEventPass({
  ticket,
  onRegisterAnother,
}: DigitalEventPassProps) {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = async () => {
    try {
      await navigator.clipboard.writeText(ticket.registrationNumber);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error("Clipboard copy failed", err);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const hasTeam =
    Boolean(ticket.teamName) || (ticket.teamMembers && ticket.teamMembers.length > 0);

  return (
    <div className="space-y-6 font-mono">
      {/* ─────────────────────────────────────────────────
          PRINT STYLES: Isolates the ticket when printing
          ───────────────────────────────────────────────── */}
      <style dangerouslySetInnerHTML={{ __html: `
        @media print {
          body * {
            visibility: hidden !important;
          }
          #codehive-digital-pass,
          #codehive-digital-pass * {
            visibility: visible !important;
          }
          #codehive-digital-pass {
            position: absolute !important;
            left: 0 !important;
            top: 0 !important;
            width: 100% !important;
            margin: 0 !important;
            padding: 20px !important;
            background: #ffffff !important;
            color: #000000 !important;
            border: 2px solid #000000 !important;
            box-shadow: none !important;
          }
          .no-print {
            display: none !important;
          }
        }
      ` }} />

      {/* Main Ticket Container */}
      <div
        id="codehive-digital-pass"
        className="relative overflow-hidden rounded-none border-2 border-white/80 bg-[#080808] shadow-2xl p-4 sm:p-7 md:p-8"
      >
        {/* Subtle Ambient Top Accent */}
        <div className="absolute top-0 right-0 size-48 bg-white/[0.03] rounded-full blur-3xl pointer-events-none" />

        {/* ── Top Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#262626] pb-4 mb-5 sm:mb-6">
          <div className="flex items-center gap-2">
            <span className="text-white font-extrabold text-base">&gt;</span>
            <span className="font-mono font-bold text-white text-sm sm:text-base tracking-tight">
              code<span className="text-white">hive</span>_2k26
            </span>
            <span className="text-[10px] font-mono text-[#737373] uppercase tracking-widest ml-1 border-l border-[#262626] pl-2">
              DIGITAL EVENT PASS
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none border border-white/50 bg-[#161616] text-white text-[10px] font-mono font-bold uppercase tracking-wider">
              <ShieldCheckIcon className="size-3.5 text-white" />
              <span>ENTRY PASS CONFIRMED</span>
            </div>
          </div>
        </div>

        {/* ── Event Title & Core Meta ── */}
        <div className="space-y-3.5 sm:space-y-4 mb-5 sm:mb-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-[#A3A3A3] font-semibold block">
              OFFICIAL PARTICIPATION PASS
            </span>
            <h2 className="text-xl xs:text-2xl sm:text-3xl font-extrabold font-sans text-white tracking-tight uppercase">
              {ticket.eventName}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 sm:gap-3 p-3 sm:p-3.5 rounded-none border border-[#262626] bg-[#0F0F0F] text-xs">
            <div className="flex items-center gap-2.5 text-neutral-300">
              <CalendarIcon className="size-4 text-white shrink-0" />
              <div>
                <span className="text-[10px] text-[#737373] uppercase block font-mono">Date</span>
                <span className="font-semibold text-white">{ticket.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-neutral-300">
              <MapPinIcon className="size-4 text-white shrink-0" />
              <div>
                <span className="text-[10px] text-[#737373] uppercase block font-mono">Venue</span>
                <span className="font-semibold text-white">{ticket.venue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Verification Block: Pass Code & QR Code ── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-3.5 sm:p-5 rounded-none border border-[#262626] bg-[#0F0F0F] mb-5 sm:mb-6">
          {/* Pass Code (3 Columns on Desktop) */}
          <div className="md:col-span-3 flex flex-col justify-between space-y-3 sm:space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1 sm:mb-1.5">
                <SparklesIcon className="size-3.5 text-white" />
                <span className="text-[10px] sm:text-[11px] font-mono text-white font-bold uppercase tracking-widest">
                  GATE PASS VERIFICATION CODE
                </span>
              </div>
              <p className="text-xs text-neutral-400 font-sans leading-relaxed">
                Present this code or show the scannable QR pass at the entrance desk on event day.
              </p>
            </div>

            <div className="p-3 sm:p-3.5 rounded-none border border-[#262626] bg-[#080808] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[9px] uppercase font-mono text-[#737373] block">
                  PASS CODE / TICKET ID
                </span>
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-white tracking-wider break-all">
                  {ticket.registrationNumber}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center justify-center gap-1.5 h-11 sm:h-10 px-4 font-mono text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 active:scale-95 border border-white transition-all cursor-pointer shrink-0 w-full sm:w-auto"
              >
                {copied ? (
                  <>
                    <CheckIcon className="size-3.5 text-black" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="size-3.5 text-black" />
                    <span>COPY CODE</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] font-mono text-[#737373] flex items-center gap-2">
              <CheckCircle2Icon className="size-3.5 text-white" />
              <span>Full pass details dispatched to: {ticket.leaderEmail}</span>
            </div>
          </div>

          {/* Scannable QR Code (2 Columns on Desktop) */}
          <div className="md:col-span-2 flex flex-col items-center justify-center p-3 rounded-none border border-[#262626] bg-[#080808] text-center">
            {ticket.qrDataUrl ? (
              <div className="p-2 bg-white rounded-none border-2 border-white shadow-md">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ticket.qrDataUrl}
                  alt={`QR Code Pass for ${ticket.registrationNumber}`}
                  className="size-36 sm:size-40 object-contain block"
                />
              </div>
            ) : (
              <div className="size-36 flex items-center justify-center border border-dashed border-[#262626] text-[#737373] text-xs">
                QR Unavailable
              </div>
            )}
            <span className="text-[10px] font-mono text-neutral-400 uppercase tracking-widest mt-2 block">
              OFFICIAL SCAN PASS
            </span>
          </div>
        </div>

        {/* ── Attendee & Team Credentials ── */}
        <div className="space-y-3 border-t border-[#262626] pt-5">
          <div className="flex items-center justify-between text-xs text-neutral-400 uppercase">
            <span className="flex items-center gap-1.5 font-bold text-neutral-300">
              <UserIcon className="size-3.5 text-white" />
              Attendee Credentials
            </span>
            {hasTeam && ticket.teamName && (
              <span className="font-mono text-white font-bold">
                TEAM: {ticket.teamName.toUpperCase()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#080808] p-3.5 border border-[#262626]">
            <div>
              <span className="text-[10px] text-[#737373] block uppercase font-mono">
                {hasTeam ? "Team Leader" : "Participant"}
              </span>
              <span className="font-bold text-white font-sans">{ticket.leaderName}</span>
              <span className="text-[11px] text-neutral-400 block font-mono mt-0.5">
                {ticket.leaderPhone}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[#737373] block uppercase font-mono">Institution</span>
              <span className="font-semibold text-white font-sans">{ticket.college}</span>
              <span className="text-[11px] text-neutral-400 block font-sans mt-0.5">
                {ticket.department}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-[#737373] block uppercase font-mono">Year</span>
              <span className="font-semibold text-white font-mono">Year {ticket.year}</span>
            </div>
          </div>

          {/* Team Members Roster (if applicable) */}
          {hasTeam && ticket.teamMembers && ticket.teamMembers.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-neutral-400">
                <UsersIcon className="size-3.5 text-white" />
                <span className="font-bold uppercase text-[11px] tracking-wider text-neutral-300">
                  Registered Team Roster ({ticket.teamMembers.length + 1} Members)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Leader entry */}
                <div className="p-2.5 rounded-none border border-white/40 bg-[#161616] flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-5 items-center justify-center text-[9px] font-bold text-black bg-white">
                      01
                    </span>
                    <span className="font-semibold text-white">{ticket.leaderName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-white uppercase font-bold">
                    Leader
                  </span>
                </div>

                {/* Team members */}
                {ticket.teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-none border border-[#262626] bg-[#080808] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex size-5 items-center justify-center text-[9px] font-bold text-white bg-[#161616] border border-[#262626]">
                        {String(idx + 2).padStart(2, "0")}
                      </span>
                      <span className="font-semibold text-neutral-200">{member.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-[#737373]">
                      {member.phone}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Vel Tech Campus Transportation Details ── */}
        <div className="space-y-2 border-t border-[#262626] pt-5">
          <div className="flex items-center justify-between text-xs text-neutral-400 uppercase">
            <span className="flex items-center gap-1.5 font-bold text-neutral-300">
              <BusIcon className="size-3.5 text-white" />
              Vel Tech Campus Transportation
            </span>
            <span className="font-mono text-white font-bold text-[10px] px-2 py-0.5 border border-[#404040] bg-[#161616]">
              {ticket.transportOptIn ? "CAMPUS BUS TRANSIT" : "SELF-COMMUTE"}
            </span>
          </div>

          {ticket.transportOptIn ? (
            <div className="p-3.5 rounded-none border border-[#262626] bg-[#080808] space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#262626] pb-2">
                <span className="font-mono font-bold text-white uppercase tracking-wider text-[11px]">
                  [ OFFICIAL VEL TECH BUS PASS ]
                </span>
                <span className="text-[10px] font-mono text-[#737373]">
                  {ticket.passengersCount} Seat{ticket.passengersCount > 1 ? "s" : ""} Reserved &bull; Report 10 Mins Prior
                </span>
              </div>

              {ticket.samePickupForTeam || !ticket.teamMembers || ticket.teamMembers.length === 0 ? (
                <div className="space-y-1 text-neutral-300">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-mono text-[#737373] uppercase shrink-0 mt-0.5">Route:</span>
                    <span className="font-bold text-white">{ticket.pickupRoute}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-mono text-[#737373] uppercase shrink-0 mt-0.5">Boarding Stop:</span>
                    <span className="font-semibold text-white">{ticket.pickupStop}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-mono text-[#737373] uppercase shrink-0 mt-0.5">Landmark:</span>
                    <span className="text-neutral-300">{ticket.pickupLandmark}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 divide-y divide-[#262626] pt-1">
                  <div className="text-[11px] space-y-0.5">
                    <span className="font-bold text-white">Leader ({ticket.leaderName}):</span>
                    <p className="text-neutral-300">{ticket.pickupRoute} &gt; {ticket.pickupStop}</p>
                    <p className="text-[10px] font-mono text-[#737373]">Landmark: {ticket.pickupLandmark}</p>
                  </div>
                  {ticket.teamMembers.map((m, idx) => (
                    <div key={idx} className="text-[11px] pt-1.5 space-y-0.5">
                      <span className="font-bold text-neutral-300">Member {idx + 2} ({m.name}):</span>
                      {m.transportOptIn ? (
                        <>
                          <p className="text-neutral-300">{m.pickupRoute} &gt; {m.pickupStop}</p>
                          <p className="text-[10px] font-mono text-[#737373]">Landmark: {m.pickupLandmark}</p>
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
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-none border border-[#262626] bg-[#080808] text-xs text-neutral-400">
              Participant has opted for Self-Arranged Commute directly to Vel Tech campus.
            </div>
          )}
        </div>

        {/* ── Footer Notice ── */}
        <div className="mt-6 pt-4 border-t border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-[#737373]">
          <span>CODEHIVE 2K26 ORGANIZING COMMITTEE &bull; GATE VERIFICATION</span>
          <span>ISSUED: {new Date(ticket.confirmedAt).toLocaleDateString("en-IN")}</span>
        </div>
      </div>

      {/* ── Action Buttons Toolbar (Hidden on Print) ── */}
      <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-3 pt-2">
        <div className="flex flex-col sm:flex-row items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={handlePrint}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-5 font-mono text-xs font-bold uppercase tracking-wider text-black bg-white hover:bg-neutral-200 active:scale-95 border border-white transition-all cursor-pointer shadow-lg"
          >
            <PrinterIcon className="size-3.5" />
            <span>Print / Save Ticket</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCode}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-5 font-mono text-xs font-bold uppercase tracking-wider text-neutral-300 bg-[#161616] hover:bg-[#1F1F1F] hover:text-white border border-[#262626] hover:border-white transition-colors cursor-pointer"
          >
            <CopyIcon className="size-3.5 text-white" />
            <span>{copied ? "Pass Code Copied!" : "Copy Pass Code"}</span>
          </button>
        </div>

        <div className="w-full sm:w-auto text-center sm:text-right pt-1 sm:pt-0">
          {onRegisterAnother ? (
            <button
              type="button"
              onClick={onRegisterAnother}
              className="inline-flex items-center justify-center gap-1.5 text-xs font-mono text-white hover:text-neutral-300 uppercase tracking-wider underline underline-offset-4 cursor-pointer"
            >
              <span>Register for Another Event</span>
              <ArrowRightIcon className="size-3" />
            </button>
          ) : (
            <Link
              href="/events"
              className="inline-flex items-center justify-center gap-1.5 text-xs font-mono text-white hover:text-neutral-300 uppercase tracking-wider underline underline-offset-4"
            >
              <span>Explore More Events</span>
              <ArrowRightIcon className="size-3" />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}

export default DigitalEventPass;

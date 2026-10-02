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
        className="relative overflow-hidden rounded-none border-2 border-blue-500/70 bg-[#040814] shadow-2xl shadow-blue-950/60 p-5 sm:p-8"
      >
        {/* Futuristic Cyber Scanlines / Glow Accent */}
        <div className="absolute top-0 right-0 size-48 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 size-48 bg-emerald-600/10 rounded-full blur-3xl pointer-events-none" />

        {/* ── Top Bar ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#152A54] pb-4 mb-6">
          <div className="flex items-center gap-2">
            <span className="text-blue-500 font-extrabold text-base">&gt;</span>
            <span className="font-mono font-bold text-white text-sm sm:text-base tracking-tight">
              code<span className="text-blue-400">hive</span>_2k26
            </span>
            <span className="text-[10px] font-mono text-slate-500 uppercase tracking-widest ml-1 border-l border-[#152A54] pl-2">
              DIGITAL EVENT PASS
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-none border border-emerald-500/40 bg-emerald-950/30 text-emerald-400 text-[10px] font-mono font-bold uppercase tracking-wider">
              <ShieldCheckIcon className="size-3.5 text-emerald-400" />
              <span>ENTRY PASS CONFIRMED</span>
            </div>
          </div>
        </div>

        {/* ── Event Title & Core Meta ── */}
        <div className="space-y-4 mb-6">
          <div className="space-y-1">
            <span className="text-[10px] uppercase font-mono tracking-widest text-blue-400 font-semibold block">
              OFFICIAL PARTICIPATION PASS
            </span>
            <h2 className="text-2xl sm:text-3xl font-extrabold font-sans text-white tracking-tight uppercase">
              {ticket.eventName}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 p-3.5 rounded-none border border-[#152A54] bg-[#02050E] text-xs">
            <div className="flex items-center gap-2.5 text-slate-300">
              <CalendarIcon className="size-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Date</span>
                <span className="font-semibold text-white">{ticket.date}</span>
              </div>
            </div>

            <div className="flex items-center gap-2.5 text-slate-300">
              <MapPinIcon className="size-4 text-blue-400 shrink-0" />
              <div>
                <span className="text-[10px] text-slate-500 uppercase block font-mono">Venue</span>
                <span className="font-semibold text-white">{ticket.venue}</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Verification Block: Pass Code & QR Code ── */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 p-4 sm:p-5 rounded-none border-2 border-blue-500/40 bg-[#060D1A] mb-6">
          {/* Pass Code (3 Columns on Desktop) */}
          <div className="md:col-span-3 flex flex-col justify-between space-y-4">
            <div>
              <div className="flex items-center gap-2 mb-1.5">
                <SparklesIcon className="size-3.5 text-blue-400" />
                <span className="text-[11px] font-mono text-blue-400 font-bold uppercase tracking-widest">
                  GATE PASS VERIFICATION CODE
                </span>
              </div>
              <p className="text-xs text-slate-400 font-sans leading-relaxed">
                Present this code or show the scannable QR pass at the entrance desk on event day.
              </p>
            </div>

            <div className="p-3.5 rounded-none border border-[#152A54] bg-[#02050E] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div>
                <span className="text-[9px] uppercase font-mono text-slate-500 block">
                  PASS CODE / TICKET ID
                </span>
                <span className="text-xl sm:text-2xl font-mono font-extrabold text-blue-400 tracking-wider">
                  {ticket.registrationNumber}
                </span>
              </div>

              <button
                type="button"
                onClick={handleCopyCode}
                className="inline-flex items-center justify-center gap-1.5 h-10 px-4 font-mono text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 active:scale-95 border border-blue-500 transition-all cursor-pointer shrink-0"
              >
                {copied ? (
                  <>
                    <CheckIcon className="size-3.5 text-white" />
                    <span>COPIED</span>
                  </>
                ) : (
                  <>
                    <CopyIcon className="size-3.5 text-white" />
                    <span>COPY CODE</span>
                  </>
                )}
              </button>
            </div>

            <div className="text-[11px] font-mono text-slate-500 flex items-center gap-2">
              <CheckCircle2Icon className="size-3.5 text-emerald-400" />
              <span>Full pass details dispatched to: {ticket.leaderEmail}</span>
            </div>
          </div>

          {/* Scannable QR Code (2 Columns on Desktop) */}
          <div className="md:col-span-2 flex flex-col items-center justify-center p-3 rounded-none border border-[#152A54] bg-[#02050E] text-center">
            {ticket.qrDataUrl ? (
              <div className="p-2 bg-white rounded-none border-2 border-blue-500/80 shadow-md shadow-blue-500/20">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={ticket.qrDataUrl}
                  alt={`QR Code Pass for ${ticket.registrationNumber}`}
                  className="size-36 sm:size-40 object-contain block"
                />
              </div>
            ) : (
              <div className="size-36 flex items-center justify-center border border-dashed border-slate-700 text-slate-500 text-xs">
                QR Unavailable
              </div>
            )}
            <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mt-2 block">
              OFFICIAL SCAN PASS
            </span>
          </div>
        </div>

        {/* ── Attendee & Team Credentials ── */}
        <div className="space-y-3 border-t border-[#152A54] pt-5">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <UserIcon className="size-3.5 text-blue-400" />
              Attendee Credentials
            </span>
            {hasTeam && ticket.teamName && (
              <span className="font-mono text-blue-400 font-bold">
                TEAM: {ticket.teamName.toUpperCase()}
              </span>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-[#02050E] p-3.5 border border-[#152A54]">
            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-mono">
                {hasTeam ? "Team Leader" : "Participant"}
              </span>
              <span className="font-bold text-white font-sans">{ticket.leaderName}</span>
              <span className="text-[11px] text-slate-400 block font-mono mt-0.5">
                {ticket.leaderPhone}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Institution</span>
              <span className="font-semibold text-white font-sans">{ticket.college}</span>
              <span className="text-[11px] text-slate-400 block font-sans mt-0.5">
                {ticket.department}
              </span>
            </div>

            <div>
              <span className="text-[10px] text-slate-500 block uppercase font-mono">Year</span>
              <span className="font-semibold text-white font-mono">Year {ticket.year}</span>
            </div>
          </div>

          {/* Team Members Roster (if applicable) */}
          {hasTeam && ticket.teamMembers && ticket.teamMembers.length > 0 && (
            <div className="space-y-2 pt-2">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <UsersIcon className="size-3.5 text-blue-400" />
                <span className="font-bold uppercase text-[11px] tracking-wider text-slate-300">
                  Registered Team Roster ({ticket.teamMembers.length + 1} Members)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {/* Leader entry */}
                <div className="p-2.5 rounded-none border border-blue-500/30 bg-blue-950/15 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex size-5 items-center justify-center text-[9px] font-bold text-blue-400 bg-blue-600/20 border border-blue-500/40">
                      01
                    </span>
                    <span className="font-semibold text-white">{ticket.leaderName}</span>
                  </div>
                  <span className="text-[10px] font-mono text-blue-400 uppercase font-bold">
                    Leader
                  </span>
                </div>

                {/* Team members */}
                {ticket.teamMembers.map((member, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 rounded-none border border-[#152A54] bg-[#02050E] flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2">
                      <span className="inline-flex size-5 items-center justify-center text-[9px] font-bold text-slate-400 bg-slate-800 border border-[#152A54]">
                        {String(idx + 2).padStart(2, "0")}
                      </span>
                      <span className="font-semibold text-slate-200">{member.name}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-500">
                      {member.phone}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* ── Vel Tech Campus Transportation Details ── */}
        <div className="space-y-2 border-t border-[#152A54] pt-5">
          <div className="flex items-center justify-between text-xs text-slate-400 uppercase">
            <span className="flex items-center gap-1.5 font-bold text-slate-300">
              <BusIcon className="size-3.5 text-sky-400" />
              Vel Tech Campus Transportation
            </span>
            <span className="font-mono text-sky-400 font-bold text-[10px]">
              {ticket.transportOptIn ? "6:00 AM ONWARDS" : "SELF-COMMUTE"}
            </span>
          </div>

          {ticket.transportOptIn ? (
            <div className="p-3.5 rounded-none border border-sky-500/40 bg-sky-950/20 space-y-2 text-xs">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 border-b border-[#152A54]/80 pb-2">
                <span className="font-mono font-bold text-sky-300 uppercase tracking-wider text-[11px]">
                  [ OFFICIAL VEL TECH BUS PASS ]
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {ticket.passengersCount} Seat{ticket.passengersCount > 1 ? "s" : ""} Reserved • Report by 06:00 AM
                </span>
              </div>

              {ticket.samePickupForTeam || !ticket.teamMembers || ticket.teamMembers.length === 0 ? (
                <div className="space-y-1 text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0 mt-0.5">Route:</span>
                    <span className="font-bold text-white">{ticket.pickupRoute}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0 mt-0.5">Boarding Stop:</span>
                    <span className="font-semibold text-sky-300">{ticket.pickupStop}</span>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="text-[10px] font-mono text-slate-500 uppercase shrink-0 mt-0.5">Landmark:</span>
                    <span className="text-slate-200">{ticket.pickupLandmark}</span>
                  </div>
                </div>
              ) : (
                <div className="space-y-2 divide-y divide-[#152A54]/60 pt-1">
                  <div className="text-[11px] space-y-0.5">
                    <span className="font-bold text-sky-400">Leader ({ticket.leaderName}):</span>
                    <p className="text-slate-200">{ticket.pickupRoute} &gt; {ticket.pickupStop}</p>
                    <p className="text-[10px] font-mono text-slate-400">Landmark: {ticket.pickupLandmark}</p>
                  </div>
                  {ticket.teamMembers.map((m, idx) => (
                    <div key={idx} className="text-[11px] pt-1.5 space-y-0.5">
                      <span className="font-bold text-slate-300">Member {idx + 2} ({m.name}):</span>
                      {m.transportOptIn ? (
                        <>
                          <p className="text-slate-200">{m.pickupRoute} &gt; {m.pickupStop}</p>
                          <p className="text-[10px] font-mono text-slate-400">Landmark: {m.pickupLandmark}</p>
                        </>
                      ) : (
                        <p className="text-slate-500 italic">Self-Arranged Transportation</p>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ) : (
            <div className="p-3 rounded-none border border-[#152A54] bg-[#02050E] text-xs text-slate-400">
              Participant has opted for Self-Arranged Commute directly to Vel Tech campus.
            </div>
          )}
        </div>

        {/* ── Footer Notice ── */}
        <div className="mt-6 pt-4 border-t border-[#152A54] flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-[10px] font-mono text-slate-500">
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
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-5 font-mono text-xs font-bold uppercase tracking-wider text-white bg-blue-600 hover:bg-blue-700 active:scale-95 border border-blue-500 transition-all cursor-pointer shadow-lg shadow-blue-950/60"
          >
            <PrinterIcon className="size-3.5" />
            <span>Print / Save Ticket</span>
          </button>

          <button
            type="button"
            onClick={handleCopyCode}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 h-11 px-5 font-mono text-xs font-bold uppercase tracking-wider text-slate-300 bg-[#0B162C] hover:bg-[#102246] hover:text-white border border-[#152A54] hover:border-blue-500/60 transition-colors cursor-pointer"
          >
            <CopyIcon className="size-3.5 text-blue-400" />
            <span>{copied ? "Pass Code Copied!" : "Copy Pass Code"}</span>
          </button>
        </div>

        <div className="w-full sm:w-auto text-right">
          {onRegisterAnother ? (
            <button
              type="button"
              onClick={onRegisterAnother}
              className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300 uppercase tracking-wider underline underline-offset-4 cursor-pointer"
            >
              <span>Register for Another Event</span>
              <ArrowRightIcon className="size-3" />
            </button>
          ) : (
            <Link
              href="/events"
              className="inline-flex items-center gap-1.5 text-xs font-mono text-blue-400 hover:text-blue-300 uppercase tracking-wider underline underline-offset-4"
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

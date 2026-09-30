'use client';

import React from 'react';
import { Registration } from '../lib/types';
import { Hexagon, Download, Printer, CheckCircle, ShieldCheck, Sparkles, X, Share2 } from 'lucide-react';

interface TicketPassProps {
  registration: Registration;
  onClose?: () => void;
}

export function TicketPass({ registration, onClose }: TicketPassProps) {
  const { participant, registrationNumber, eventName, teamName, qrPayload, registeredAt, status } = registration;

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = () => {
    // Generate image or download link
    const link = document.createElement('a');
    link.download = `${registrationNumber}-CodeHive2K26-Pass.txt`;
    const content = `CODEHIVE 2K26 - OFFICIAL EVENT PASS
Registration Number: ${registrationNumber}
Participant: ${participant.name}
College: ${participant.college}
Department: ${participant.department} (${participant.year})
Event: ${eventName}
Team: ${teamName || 'Solo Participant'}
Status: ${status}
Registered At: ${registeredAt}
QR Verification Payload: ${qrPayload}

Please present this pass at the on-site verification desk for badge issuance.
`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    link.href = URL.createObjectURL(blob);
    link.click();
  };

  return (
    <div className="relative max-w-md mx-auto rounded-3xl p-1 bg-gradient-to-br from-amber-400 via-emerald-400 to-cyan-500 shadow-2xl shadow-cyan-500/20">
      
      {/* Main Ticket Surface */}
      <div className="relative rounded-[22px] bg-slate-950 p-6 sm:p-7 overflow-hidden text-white">
        
        {/* Subtle decorative background watermarks */}
        <div className="absolute -top-10 -right-10 w-44 h-44 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />
        <div className="absolute -bottom-10 -left-10 w-44 h-44 bg-emerald-500/10 rounded-full blur-2xl pointer-events-none" />
        <Hexagon className="absolute -bottom-12 -right-12 w-48 h-48 text-slate-900 pointer-events-none stroke-1 opacity-50" />

        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800 relative z-10">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-cyan-400 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
                <Hexagon className="w-4 h-4 text-amber-400 fill-amber-400/20" />
              </div>
            </div>
            <div>
              <span className="text-xs font-black tracking-widest bg-gradient-to-r from-amber-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                CODEHIVE 2K26
              </span>
              <p className="text-[9px] font-semibold text-slate-400 tracking-wider uppercase">
                Official Delegate Pass
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-[10px] font-extrabold text-emerald-400 uppercase tracking-wider">
            <CheckCircle className="w-3 h-3 text-emerald-400" />
            <span>{status}</span>
          </div>
        </div>

        {/* Registration ID Banner */}
        <div className="my-5 p-3 rounded-xl bg-slate-900/90 border border-cyan-500/30 flex items-center justify-between relative z-10">
          <div>
            <span className="text-[10px] font-bold tracking-wider text-slate-400 uppercase">Registration ID</span>
            <div className="font-mono text-xl sm:text-2xl font-black text-cyan-300 tracking-wider">
              {registrationNumber}
            </div>
          </div>
          <div className="text-right">
            <span className="text-[10px] font-semibold text-slate-400">Oct 24 - 25</span>
            <span className="block text-[10px] font-bold text-amber-400 uppercase">Chennai, India</span>
          </div>
        </div>

        {/* Participant & Event Details */}
        <div className="space-y-3 text-xs relative z-10">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Participant</span>
            <span className="text-base font-bold text-white block mt-0.5">{participant.name}</span>
            <span className="text-[11px] text-slate-300 block">{participant.college}</span>
            <span className="text-[11px] text-slate-400 block">{participant.department} • {participant.year}</span>
          </div>

          <div className="pt-2 border-t border-slate-900">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registered Event</span>
            <span className="text-sm font-semibold text-emerald-300 block mt-0.5">{eventName}</span>
            {teamName && (
              <span className="text-[11px] text-amber-300 font-medium block mt-0.5">
                Team: <strong>{teamName}</strong>
              </span>
            )}
          </div>
        </div>

        {/* Center QR Code Container */}
        <div className="mt-6 p-4 rounded-2xl bg-white flex flex-col items-center justify-center relative z-10 shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={`https://api.qrserver.com/v1/create-qr-code/?size=220x220&data=${encodeURIComponent(qrPayload)}`}
            alt={`QR Code for ${registrationNumber}`}
            className="w-44 h-44 rounded-lg object-contain"
          />
          <p className="text-[10px] font-bold font-mono tracking-widest text-slate-700 mt-2 uppercase">
            Scan at On-Site Check-in Desk
          </p>
        </div>

        {/* Security watermark footer */}
        <div className="mt-4 pt-3 border-t border-slate-900 flex items-center justify-between text-[10px] text-slate-500 relative z-10">
          <div className="flex items-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
            <span>Cryptographically Verified</span>
          </div>
          <span>Issued: {registeredAt.slice(0, 10)}</span>
        </div>

      </div>

      {/* Pass Actions (Print / Download / Close) */}
      <div className="p-3 bg-slate-900/90 rounded-b-2xl border-t border-slate-800 flex items-center justify-between gap-2 print:hidden">
        <button
          onClick={handleDownload}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Download className="w-3.5 h-3.5 text-cyan-400" />
          <span>Save Pass</span>
        </button>

        <button
          onClick={handlePrint}
          className="flex-1 py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-200 flex items-center justify-center gap-1.5 transition-colors"
        >
          <Printer className="w-3.5 h-3.5 text-amber-400" />
          <span>Print Pass</span>
        </button>

        {onClose && (
          <button
            onClick={onClose}
            className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
          >
            Done
          </button>
        )}
      </div>

    </div>
  );
}

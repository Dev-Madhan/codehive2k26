'use client';

import React, { useState } from 'react';
import { Registration } from '../lib/types';
import { X, QrCode, CheckCircle2, AlertTriangle, UserCheck, ShieldCheck, History, ArrowRight } from 'lucide-react';

interface QrScannerModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: Registration[];
  onCheckInSuccess: (regId: string, staffName: string) => void;
}

export function QrScannerModal({
  isOpen,
  onClose,
  registrations,
  onCheckInSuccess
}: QrScannerModalProps) {
  const [scanCode, setScanCode] = useState('');
  const [feedback, setFeedback] = useState<{
    type: 'success' | 'duplicate' | 'error';
    message: string;
    registration?: Registration;
  } | null>(null);

  if (!isOpen) return null;

  const handleProcessCode = (codeToTest: string) => {
    const raw = codeToTest.trim();
    if (!raw) return;

    // Search by exact code or parse payload (CODEHIVE-2K26:REG:CH26-XXXXXX:...)
    const found = registrations.find(
      (r) =>
        r.registrationNumber.toLowerCase() === raw.toLowerCase() ||
        r.qrPayload.toLowerCase() === raw.toLowerCase() ||
        raw.includes(r.registrationNumber)
    );

    if (!found) {
      setFeedback({
        type: 'error',
        message: `Invalid Ticket: No registration found for "${raw}".`,
      });
      return;
    }

    if (found.status === 'CHECKED_IN') {
      setFeedback({
        type: 'duplicate',
        message: `Duplicate Check-in Alert: ${found.participant.name} was ALREADY checked in at ${found.checkedInAt || 'earlier today'}.`,
        registration: found,
      });
      return;
    }

    // Success check-in!
    onCheckInSuccess(found.id, 'Desk_Alpha_01');
    const updated = {
      ...found,
      status: 'CHECKED_IN' as const,
      checkedInAt: new Date().toLocaleTimeString(),
      checkedInBy: 'Desk_Alpha_01',
    };

    setFeedback({
      type: 'success',
      message: `Verified! Welcome ${found.participant.name} to CodeHive 2K26.`,
      registration: updated,
    });
    setScanCode('');
  };

  const checkedInList = registrations.filter(r => r.status === 'CHECKED_IN');

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-amber-500/30 shadow-2xl p-6 sm:p-8 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <QrCode className="w-4 h-4 text-amber-400" />
            <span className="text-xs font-bold text-amber-400 uppercase tracking-wider">
              Staff Portal • Phase 07 Blueprint
            </span>
          </div>
          <h2 className="text-2xl font-black text-white">Event-Day QR Check-in System</h2>
          <p className="text-xs text-slate-400 mt-1">
            Scan attendee passes or manually validate registration numbers to issue physical badges.
          </p>
        </div>

        {/* Interactive Scanner Simulator / Code Entry */}
        <div className="p-5 rounded-2xl bg-slate-950/80 border border-slate-800 space-y-4">
          <div className="relative rounded-xl border-2 border-dashed border-cyan-500/40 p-6 text-center bg-slate-900/40">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto mb-2 animate-pulse">
              <QrCode className="w-6 h-6 text-cyan-400" />
            </div>
            <span className="text-xs font-semibold text-slate-200 block">QR Camera Optical Scanner Active</span>
            <span className="text-[11px] text-slate-400 block mt-0.5">Point camera at digital badge or enter Registration ID below</span>
          </div>

          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleProcessCode(scanCode);
            }}
            className="flex gap-2"
          >
            <input
              type="text"
              placeholder="e.g. CH26-8F3K21 or paste QR string"
              value={scanCode}
              onChange={(e) => setScanCode(e.target.value)}
              className="flex-1 px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-xs text-white focus:border-amber-400 focus:outline-none"
            />
            <button
              type="submit"
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 font-bold text-xs uppercase tracking-wider text-slate-950 transition-all flex items-center gap-1.5"
            >
              <span>Validate Pass</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>

          {/* Quick Click Samples to Test */}
          <div className="pt-1 flex flex-wrap items-center gap-2">
            <span className="text-[10px] text-slate-400 font-semibold uppercase">Quick Test:</span>
            {registrations.slice(0, 3).map((r) => (
              <button
                key={r.id}
                type="button"
                onClick={() => handleProcessCode(r.registrationNumber)}
                className="text-[10px] font-mono px-2 py-1 rounded bg-slate-800 hover:bg-slate-700 text-cyan-300 transition-colors"
              >
                {r.registrationNumber} ({r.participant.name.split(' ')[0]})
              </button>
            ))}
          </div>
        </div>

        {/* Real-time Feedback Alert */}
        {feedback && (
          <div className="mt-5 animate-in fade-in slide-in-from-top-2 duration-200">
            {feedback.type === 'success' && (
              <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400">Check-in Approved</h4>
                  <p className="text-xs text-emerald-200 mt-0.5">{feedback.message}</p>
                  {feedback.registration && (
                    <div className="mt-2 pt-2 border-t border-emerald-500/30 text-[11px] text-emerald-300">
                      <span>Event: <strong>{feedback.registration.eventName}</strong></span> • 
                      <span className="ml-1">College: {feedback.registration.participant.college}</span>
                    </div>
                  )}
                </div>
              </div>
            )}

            {feedback.type === 'duplicate' && (
              <div className="p-4 rounded-xl bg-amber-950/80 border border-amber-500/40 text-amber-300 flex items-start gap-3">
                <AlertTriangle className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400">Duplicate Check-in Prevented</h4>
                  <p className="text-xs text-amber-200 mt-0.5">{feedback.message}</p>
                </div>
              </div>
            )}

            {feedback.type === 'error' && (
              <div className="p-4 rounded-xl bg-rose-950/80 border border-rose-500/40 text-rose-300 flex items-start gap-3">
                <X className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-rose-400">Verification Failed</h4>
                  <p className="text-xs text-rose-200 mt-0.5">{feedback.message}</p>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Live Attendance List */}
        <div className="mt-6 pt-5 border-t border-slate-800">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <History className="w-3.5 h-3.5 text-cyan-400" />
              Verified Attendees Stream ({checkedInList.length})
            </span>
            <span className="text-[11px] font-semibold text-emerald-400">Live Desk Alpha</span>
          </div>

          <div className="space-y-2 max-h-44 overflow-y-auto pr-1">
            {checkedInList.length === 0 ? (
              <p className="text-xs text-slate-500 italic">No attendees checked in yet today.</p>
            ) : (
              checkedInList.map((item) => (
                <div
                  key={item.id}
                  className="p-2.5 rounded-xl bg-slate-950/60 border border-slate-800/80 flex items-center justify-between text-xs"
                >
                  <div className="flex items-center gap-2">
                    <UserCheck className="w-4 h-4 text-emerald-400" />
                    <div>
                      <span className="font-bold text-white block">{item.participant.name}</span>
                      <span className="text-[10px] text-slate-400">{item.participant.college}</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="font-mono text-[10px] font-bold text-cyan-300 block">{item.registrationNumber}</span>
                    <span className="text-[10px] text-emerald-400 font-semibold">{item.checkedInAt || 'Checked-in'}</span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

      </div>
    </div>
  );
}

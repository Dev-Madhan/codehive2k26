'use client';

import React from 'react';
import { EventItem } from '../lib/types';
import { X, Calendar, Clock, MapPin, Users, Trophy, Phone, CheckCircle2, Sparkles, ArrowRight } from 'lucide-react';

interface EventDetailsModalProps {
  event: EventItem | null;
  onClose: () => void;
  onRegister: (event: EventItem) => void;
}

export function EventDetailsModal({ event, onClose, onRegister }: EventDetailsModalProps) {
  if (!event) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl p-6 sm:p-8"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Category & Flagship Tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold uppercase tracking-wider px-3 py-1 rounded-md bg-cyan-950 border border-cyan-500/40 text-cyan-300">
            {event.category}
          </span>
          {event.isFlagship && (
            <span className="inline-flex items-center gap-1.5 text-xs font-black uppercase tracking-wider px-3 py-1 rounded-md bg-amber-500/20 border border-amber-500/40 text-amber-300">
              <Sparkles className="w-3.5 h-3.5 fill-amber-300" />
              Flagship Event
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <h2 className="text-2xl sm:text-3xl font-black text-white">
          {event.name}
        </h2>
        <p className="text-sm font-medium text-cyan-400 mt-1">
          {event.tagline}
        </p>

        {/* Primary Meta Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mt-6 p-4 rounded-2xl bg-slate-950/60 border border-slate-800">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Date</span>
            <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{event.date}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Time</span>
            <span className="text-xs font-semibold text-slate-200 mt-0.5 block">{event.startAt}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Format</span>
            <span className="text-xs font-semibold text-emerald-400 mt-0.5 block">{event.teamSize}</span>
          </div>
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Prize Pool</span>
            <span className="text-xs font-bold text-amber-400 mt-0.5 block">{event.prizePool}</span>
          </div>
        </div>

        {/* Description */}
        <div className="mt-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Overview</h4>
          <p className="text-sm text-slate-300 leading-relaxed font-normal">
            {event.description}
          </p>
        </div>

        {/* Venue & Fee */}
        <div className="mt-5 p-4 rounded-xl bg-slate-800/40 border border-slate-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-2 text-slate-300">
            <MapPin className="w-4 h-4 text-emerald-400 shrink-0" />
            <span><strong>Venue:</strong> {event.venue}</span>
          </div>
          <div className="text-amber-400 font-semibold">
            {event.entryFee}
          </div>
        </div>

        {/* Rules */}
        <div className="mt-6">
          <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-3">Guidelines & Rules</h4>
          <ul className="space-y-2">
            {event.rules.map((rule, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-slate-300">
                <CheckCircle2 className="w-4 h-4 text-cyan-400 shrink-0 mt-0.5" />
                <span>{rule}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Student Coordinators */}
        {event.coordinators.length > 0 && (
          <div className="mt-6 pt-5 border-t border-slate-800">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Event Coordinators</h4>
            <div className="flex flex-wrap gap-4">
              {event.coordinators.map((c, idx) => (
                <div key={idx} className="flex items-center gap-2 text-xs text-slate-300 bg-slate-950/40 px-3 py-1.5 rounded-lg border border-slate-800">
                  <Phone className="w-3 h-3 text-emerald-400" />
                  <span className="font-semibold">{c.name}:</span>
                  <a href={`tel:${c.phone}`} className="text-cyan-400 hover:underline">{c.phone}</a>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Bottom */}
        <div className="mt-8 pt-4 border-t border-slate-800 flex items-center justify-end gap-3">
          <button
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 transition-colors"
          >
            Close
          </button>
          <button
            onClick={() => {
              onClose();
              onRegister(event);
            }}
            className="px-6 py-2.5 rounded-xl text-xs font-bold text-slate-950 uppercase tracking-wider bg-gradient-to-r from-amber-400 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 shadow-md shadow-emerald-500/20 transition-all flex items-center gap-2"
          >
            <span>Register for this Event</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

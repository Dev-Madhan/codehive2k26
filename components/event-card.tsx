'use client';

import React from 'react';
import { EventItem } from '../lib/types';
import { Trophy, Users, MapPin, Calendar, Clock, ArrowRight, Sparkles } from 'lucide-react';

interface EventCardProps {
  event: EventItem;
  onSelectDetails: (event: EventItem) => void;
  onRegister: (event: EventItem) => void;
}

export function EventCard({ event, onSelectDetails, onRegister }: EventCardProps) {
  const percentage = Math.min(100, Math.round((event.registeredCount / event.capacity) * 100));

  return (
    <div className={`relative flex flex-col justify-between rounded-2xl bg-slate-900/70 border ${event.isFlagship ? 'border-amber-500/40 shadow-lg shadow-amber-500/10' : 'border-slate-800/80'} p-6 transition-all duration-300 hover:border-cyan-500/50 hover:bg-slate-900/90 group`}>
      
      {/* Top Banner tags */}
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <span className="text-[11px] font-bold tracking-wider uppercase px-2.5 py-1 rounded-md bg-slate-800 text-cyan-300 border border-slate-700/80">
            {event.category}
          </span>
          {event.isFlagship && (
            <span className="inline-flex items-center gap-1 text-[11px] font-black uppercase tracking-wider px-2.5 py-1 rounded-md bg-amber-500/20 text-amber-300 border border-amber-500/40">
              <Sparkles className="w-3 h-3 fill-amber-300" />
              Flagship
            </span>
          )}
        </div>

        {/* Title & Tagline */}
        <h3 className="text-xl font-bold text-white group-hover:text-cyan-300 transition-colors line-clamp-1">
          {event.name}
        </h3>
        <p className="text-xs text-slate-400 mt-2 line-clamp-2 leading-relaxed">
          {event.tagline}
        </p>

        {/* Info Grid */}
        <div className="mt-5 space-y-2 text-xs text-slate-300">
          <div className="flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-medium text-slate-200">{event.date}</span>
            <span className="text-slate-600">•</span>
            <Clock className="w-3.5 h-3.5 text-slate-400 shrink-0" />
            <span>{event.startAt}</span>
          </div>

          <div className="flex items-center gap-2">
            <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
            <span className="truncate text-slate-300">{event.venue}</span>
          </div>

          <div className="flex items-center justify-between pt-1">
            <span className="flex items-center gap-1.5 text-slate-400">
              <Users className="w-3.5 h-3.5 text-cyan-400" />
              {event.teamSize}
            </span>
            <span className="flex items-center gap-1 text-emerald-400 font-bold bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-500/30">
              <Trophy className="w-3 h-3 text-amber-400" />
              {event.prizePool}
            </span>
          </div>
        </div>

        {/* Capacity Bar */}
        <div className="mt-5">
          <div className="flex justify-between text-[11px] text-slate-400 mb-1.5">
            <span>Seat Capacity</span>
            <span className="font-mono text-cyan-400 font-medium">
              {event.registeredCount} / {event.capacity} filled
            </span>
          </div>
          <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
            <div
              className={`h-full rounded-full transition-all duration-500 ${
                percentage > 85 ? 'bg-amber-400' : 'bg-gradient-to-r from-emerald-500 to-cyan-500'
              }`}
              style={{ width: `${percentage}%` }}
            />
          </div>
        </div>
      </div>

      {/* Buttons */}
      <div className="mt-6 pt-4 border-t border-slate-800/80 flex items-center gap-3">
        <button
          onClick={() => onSelectDetails(event)}
          className="flex-1 py-2 px-3 text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/80 hover:bg-slate-700/80 rounded-lg border border-slate-700/60 transition-colors"
        >
          Rules & Details
        </button>
        <button
          onClick={() => onRegister(event)}
          className="flex-1 py-2 px-3 text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-emerald-400 hover:from-amber-300 hover:to-emerald-300 rounded-lg shadow-sm shadow-emerald-500/20 hover:shadow-cyan-400/30 transition-all flex items-center justify-center gap-1.5"
        >
          <span>Register</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </button>
      </div>

    </div>
  );
}

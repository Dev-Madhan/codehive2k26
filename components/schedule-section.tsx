'use client';

import React, { useState } from 'react';
import { SCHEDULE_DATA } from '../lib/data';
import { Calendar, Clock, MapPin } from 'lucide-react';

export function ScheduleSection() {
  const [activeDay, setActiveDay] = useState(0);

  return (
    <section id="schedule" className="py-20 border-t border-slate-800/80 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-3">
            <Calendar className="w-3.5 h-3.5" />
            <span>Event Roadmap</span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-white">
            Two-Day Technical Schedule
          </h2>
          <p className="text-sm text-slate-400 mt-2">
            Non-stop innovation, hackathon evaluations, technical sprints, and masterclasses across campus.
          </p>

          {/* Day Tabs */}
          <div className="flex justify-center gap-3 mt-8">
            {SCHEDULE_DATA.map((dayItem, idx) => (
              <button
                key={idx}
                onClick={() => setActiveDay(idx)}
                className={`px-6 py-2.5 rounded-xl text-xs font-bold transition-all ${
                  activeDay === idx
                    ? 'bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 text-slate-950 shadow-lg shadow-emerald-500/20'
                    : 'bg-slate-900 text-slate-400 hover:text-white border border-slate-800'
                }`}
              >
                {idx === 0 ? 'Day 1 (Friday)' : 'Day 2 (Saturday)'}
              </button>
            ))}
          </div>
        </div>

        {/* Timeline Grid */}
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="text-xs font-bold text-cyan-400 uppercase tracking-wider mb-2">
            {SCHEDULE_DATA[activeDay].day}
          </div>

          <div className="divide-y divide-slate-800 rounded-2xl bg-slate-900/60 border border-slate-800 p-2 sm:p-4">
            {SCHEDULE_DATA[activeDay].items.map((item, idx) => (
              <div key={idx} className="py-4 px-3 sm:px-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 hover:bg-slate-800/40 rounded-xl transition-colors">
                <div className="flex items-start sm:items-center gap-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 shrink-0 mt-1 sm:mt-0" />
                  <div>
                    <h4 className="text-sm font-bold text-white">{item.title}</h4>
                    <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
                      <MapPin className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item.venue}</span>
                    </div>
                  </div>
                </div>

                <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-amber-300 bg-slate-950 px-3 py-1 rounded-lg border border-slate-800 shrink-0 self-start sm:self-auto">
                  <Clock className="w-3.5 h-3.5 text-slate-400" />
                  <span>{item.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </section>
  );
}

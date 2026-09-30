'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, Compass, ShieldCheck, Trophy, Users, Zap, Terminal, ArrowRight, Play, QrCode } from 'lucide-react';

interface HeroProps {
  onOpenRegister: () => void;
  onOpen3D: () => void;
  onOpenLookup: () => void;
}

export function Hero({ onOpenRegister, onOpen3D, onOpenLookup }: HeroProps) {
  // Live Countdown to CodeHive 2K26 (October 24, 2026)
  const [timeLeft, setTimeLeft] = useState({
    days: 23,
    hours: 14,
    minutes: 42,
    seconds: 19
  });

  useEffect(() => {
    const targetDate = new Date('2026-10-24T09:00:00+05:30').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const distance = targetDate - now;

      if (distance > 0) {
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        setTimeLeft({ days, hours, minutes, seconds });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section className="relative overflow-hidden pt-12 pb-20 lg:pt-16 lg:pb-28">
      {/* Background glow meshes */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[450px] bg-gradient-to-tr from-cyan-600/15 via-emerald-500/10 to-amber-500/15 blur-3xl pointer-events-none rounded-full" />
      <div className="absolute top-12 left-10 w-72 h-72 bg-emerald-500/10 blur-[100px] pointer-events-none rounded-full" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-cyan-500/10 blur-[120px] pointer-events-none rounded-full" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* Top Announcement Pill */}
        <div className="flex justify-center mb-8">
          <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-slate-900/90 border border-cyan-500/30 shadow-inner shadow-cyan-500/10">
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="text-xs font-semibold text-slate-200">
              Registrations Open for ByteHacks & Flagship Tracks
            </span>
            <span className="text-slate-600">•</span>
            <span className="text-xs font-bold text-amber-400">Oct 24 - 25, 2026</span>
          </div>
        </div>

        {/* Main Headline */}
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-black tracking-tight text-white leading-[1.1]">
            Unleash Code. Build Future.{' '}
            <span className="block mt-2 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
              CODEHIVE 2K26
            </span>
          </h1>

          <p className="mt-6 text-base sm:text-lg lg:text-xl text-slate-300 font-normal leading-relaxed max-w-2xl mx-auto">
            India’s premier national technology symposium and 36-hour hackathon. 
            Immerse yourself in competitive algorithmic sprints, GenAI agent battles, Web3 cybersecurity, and spatial computing.
          </p>

          {/* Action CTAs */}
          <div className="mt-9 flex flex-wrap items-center justify-center gap-4">
            <button
              onClick={onOpenRegister}
              className="inline-flex items-center gap-3 px-8 py-4 rounded-xl font-extrabold text-sm uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 shadow-xl shadow-emerald-500/25 hover:shadow-cyan-400/40 hover:-translate-y-0.5 active:translate-y-0 transition-all"
            >
              <Sparkles className="w-5 h-5 fill-slate-950" />
              <span>Register for Events</span>
              <ArrowRight className="w-4 h-4 text-slate-950" />
            </button>

            <button
              onClick={onOpen3D}
              className="group inline-flex items-center gap-3 px-7 py-4 rounded-xl font-bold text-sm text-emerald-300 bg-slate-900/90 hover:bg-slate-800 border border-emerald-500/40 hover:border-emerald-400 shadow-lg shadow-emerald-950/40 transition-all hover:-translate-y-0.5 active:translate-y-0"
            >
              <Compass className="w-5 h-5 text-emerald-400 group-hover:rotate-45 transition-transform duration-300" />
              <span>Explore 3D Spatial Arena</span>
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            </button>

            <button
              onClick={onOpenLookup}
              className="inline-flex items-center gap-2 px-5 py-4 rounded-xl font-semibold text-xs text-slate-400 hover:text-slate-200 bg-slate-950/60 hover:bg-slate-900 border border-slate-800 transition-all"
            >
              <QrCode className="w-4 h-4 text-cyan-400" />
              <span>Retrieve My Pass</span>
            </button>
          </div>
        </div>

        {/* Live Countdown Box */}
        <div className="mt-14 max-w-xl mx-auto p-4 rounded-2xl bg-gradient-to-b from-slate-900/90 to-slate-950/90 border border-cyan-500/20 shadow-2xl backdrop-blur-md">
          <div className="flex items-center justify-between px-3 pb-3 border-b border-slate-800/80">
            <span className="text-xs font-bold tracking-wider text-slate-400 uppercase flex items-center gap-2">
              <Zap className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
              Countdown to Inauguration
            </span>
            <span className="text-[11px] font-semibold text-emerald-400 bg-emerald-950/60 px-2.5 py-0.5 rounded-full border border-emerald-500/30">
              Live Tracker
            </span>
          </div>

          <div className="grid grid-cols-4 gap-2 pt-3 text-center">
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/60">
              <span className="block text-2xl sm:text-3xl font-black text-white font-mono">{String(timeLeft.days).padStart(2, '0')}</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">Days</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/60">
              <span className="block text-2xl sm:text-3xl font-black text-cyan-400 font-mono">{String(timeLeft.hours).padStart(2, '0')}</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">Hours</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/60">
              <span className="block text-2xl sm:text-3xl font-black text-emerald-400 font-mono">{String(timeLeft.minutes).padStart(2, '0')}</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">Mins</span>
            </div>
            <div className="p-2 rounded-xl bg-slate-950/70 border border-slate-800/60">
              <span className="block text-2xl sm:text-3xl font-black text-amber-400 font-mono">{String(timeLeft.seconds).padStart(2, '0')}</span>
              <span className="text-[10px] font-semibold tracking-wider uppercase text-slate-400">Secs</span>
            </div>
          </div>
        </div>

        {/* 4 Feature Highlights Grid */}
        <div className="mt-14 grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/40 transition-all hover:bg-slate-900/90 group">
            <div className="w-10 h-10 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Trophy className="w-5 h-5 text-amber-400" />
            </div>
            <div className="text-2xl font-black text-white">₹1,50,000+</div>
            <p className="text-xs font-medium text-slate-400 mt-1">Cash Prizes & Swag</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-emerald-500/40 transition-all hover:bg-slate-900/90 group">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Users className="w-5 h-5 text-emerald-400" />
            </div>
            <div className="text-2xl font-black text-white">1,500+</div>
            <p className="text-xs font-medium text-slate-400 mt-1">Delegates & Coders</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-cyan-500/40 transition-all hover:bg-slate-900/90 group">
            <div className="w-10 h-10 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <Terminal className="w-5 h-5 text-cyan-400" />
            </div>
            <div className="text-2xl font-black text-white">12 Events</div>
            <p className="text-xs font-medium text-slate-400 mt-1">Technical & Creative</p>
          </div>

          <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/40 transition-all hover:bg-slate-900/90 group">
            <div className="w-10 h-10 rounded-xl bg-purple-500/10 border border-purple-500/30 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
              <ShieldCheck className="w-5 h-5 text-purple-400" />
            </div>
            <div className="text-2xl font-black text-white">Fast QR Entry</div>
            <p className="text-xs font-medium text-slate-400 mt-1">Digital Pass System</p>
          </div>
        </div>

      </div>
    </section>
  );
}

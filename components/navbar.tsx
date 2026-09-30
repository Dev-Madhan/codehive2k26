'use client';

import React, { useState } from 'react';
import { Hexagon, Sparkles, QrCode, Search, ShieldAlert, Compass, Calendar, Trophy, Menu, X, ArrowUpRight } from 'lucide-react';

interface NavbarProps {
  onOpenRegister: () => void;
  onOpenLookup: () => void;
  onOpenCheckIn: () => void;
  onOpenAdmin: () => void;
  onOpen3D: () => void;
}

export function Navbar({
  onOpenRegister,
  onOpenLookup,
  onOpenCheckIn,
  onOpenAdmin,
  onOpen3D,
}: NavbarProps) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full border-b border-cyan-500/20 bg-slate-950/85 backdrop-blur-xl transition-all">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-amber-400 via-emerald-500 to-cyan-500 p-0.5 shadow-lg shadow-cyan-500/20 group-hover:shadow-cyan-400/40 transition-all duration-300">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Hexagon className="w-6 h-6 text-amber-400 fill-amber-400/20 group-hover:rotate-12 transition-transform duration-300" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="text-xl font-extrabold tracking-wider bg-gradient-to-r from-amber-300 via-emerald-400 to-cyan-400 bg-clip-text text-transparent">
                  CODEHIVE
                </span>
                <span className="px-2 py-0.5 text-xs font-black tracking-widest bg-cyan-950/80 border border-cyan-500/40 text-cyan-400 rounded-full">
                  2K26
                </span>
              </div>
              <p className="text-[11px] font-medium text-slate-400 tracking-wide">
                National Tech Symposium & Hackathon
              </p>
            </div>
          </div>

          {/* Desktop Navigation Links */}
          <nav className="hidden lg:flex items-center gap-7">
            <a href="#events" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Trophy className="w-4 h-4 text-emerald-400" />
              Events
            </a>
            <a href="#schedule" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1.5">
              <Calendar className="w-4 h-4 text-amber-400" />
              Schedule
            </a>
            <a href="#faq" className="text-sm font-medium text-slate-300 hover:text-cyan-400 transition-colors">
              FAQ
            </a>

            {/* 3D Universe Trigger */}
            <button
              onClick={onOpen3D}
              className="relative inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full text-xs font-semibold text-emerald-300 bg-emerald-950/40 border border-emerald-500/40 hover:border-emerald-400 hover:bg-emerald-900/30 transition-all shadow-sm shadow-emerald-500/20"
            >
              <Compass className="w-3.5 h-3.5 text-emerald-400 animate-spin" style={{ animationDuration: '8s' }} />
              <span>3D Spatial Arena</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
            </button>
          </nav>

          {/* Action Tools & CTAs */}
          <div className="hidden md:flex items-center gap-3">
            {/* Find Pass */}
            <button
              onClick={onOpenLookup}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all"
              title="Lookup your Registration Ticket"
            >
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>My Ticket</span>
            </button>

            {/* Check-In Scanner Tool */}
            <button
              onClick={onOpenCheckIn}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-300 hover:text-white bg-slate-900/80 hover:bg-slate-800 border border-slate-800 rounded-lg transition-all"
              title="On-site QR Check-in System"
            >
              <QrCode className="w-3.5 h-3.5 text-amber-400" />
              <span>QR Check-in</span>
            </button>

            {/* Admin Console */}
            <button
              onClick={onOpenAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-semibold text-slate-400 hover:text-slate-200 hover:bg-slate-900/60 rounded-lg transition-all"
              title="Admin Dashboard"
            >
              <ShieldAlert className="w-3.5 h-3.5 text-slate-500" />
              <span>Admin</span>
            </button>

            {/* Primary Register Button */}
            <button
              onClick={onOpenRegister}
              className="relative group inline-flex items-center gap-2 px-5 py-2.5 rounded-xl font-bold text-xs tracking-wider text-slate-950 uppercase bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/25 hover:shadow-cyan-400/40 transition-all duration-300 active:scale-95"
            >
              <Sparkles className="w-4 h-4 fill-slate-950" />
              <span>Register Now</span>
            </button>
          </div>

          {/* Mobile menu button */}
          <div className="flex md:hidden items-center gap-2">
            <button
              onClick={onOpenRegister}
              className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-cyan-400"
            >
              Register
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-900"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden border-t border-slate-800 bg-slate-950/95 px-4 pt-3 pb-6 space-y-3">
          <div className="grid grid-cols-2 gap-2 pb-3 border-b border-slate-800">
            <button
              onClick={() => { onOpen3D(); setMobileMenuOpen(false); }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-emerald-950/50 border border-emerald-500/30 text-xs font-semibold text-emerald-300"
            >
              <Compass className="w-4 h-4" /> 3D Arena
            </button>
            <button
              onClick={() => { onOpenLookup(); setMobileMenuOpen(false); }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200"
            >
              <Search className="w-4 h-4 text-cyan-400" /> My Ticket
            </button>
            <button
              onClick={() => { onOpenCheckIn(); setMobileMenuOpen(false); }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200"
            >
              <QrCode className="w-4 h-4 text-amber-400" /> QR Check-in
            </button>
            <button
              onClick={() => { onOpenAdmin(); setMobileMenuOpen(false); }}
              className="flex items-center justify-center gap-2 p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-xs font-semibold text-slate-200"
            >
              <ShieldAlert className="w-4 h-4 text-slate-400" /> Admin
            </button>
          </div>
          <div className="space-y-2 pt-1 text-sm font-medium">
            <a href="#events" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">
              Events Directory
            </a>
            <a href="#schedule" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">
              Two-Day Schedule
            </a>
            <a href="#faq" onClick={() => setMobileMenuOpen(false)} className="block py-2 text-slate-300 hover:text-white">
              Frequently Asked Questions
            </a>
          </div>
        </div>
      )}
    </header>
  );
}

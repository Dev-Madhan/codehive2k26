'use client';

import React, { useState, useEffect } from 'react';
import { EVENTS_DATA, INITIAL_REGISTRATIONS } from '../lib/data';
import { EventItem, EventCategory, Registration } from '../lib/types';
import { Navbar } from '../components/navbar';
import { Hero } from '../components/hero';
import { EventCard } from '../components/event-card';
import { EventDetailsModal } from '../components/event-details-modal';
import { RegistrationModal } from '../components/registration-modal';
import { LookupModal } from '../components/lookup-modal';
import { QrScannerModal } from '../components/qr-scanner-modal';
import { AdminModal } from '../components/admin-modal';
import { ImmersiveModal } from '../components/immersive-modal';
import { ScheduleSection } from '../components/schedule-section';
import { FaqSection } from '../components/faq-section';
import { Footer } from '../components/footer';
import { Compass, Trophy, Search, Sparkles, Filter, ArrowRight, ExternalLink } from 'lucide-react';

const CATEGORIES: EventCategory[] = [
  'All',
  'Hackathon & Coding',
  'AI & Robotics',
  'Web3 & Security',
  'Design & Creative',
  'Gaming & Non-Tech',
  'Workshops'
];

export default function Home() {
  const [events, setEvents] = useState<EventItem[]>(EVENTS_DATA);
  const [registrations, setRegistrations] = useState<Registration[]>(INITIAL_REGISTRATIONS);
  
  // Filters
  const [selectedCategory, setSelectedCategory] = useState<EventCategory>('All');
  const [searchQuery, setSearchQuery] = useState('');

  // Modals
  const [isRegisterOpen, setIsRegisterOpen] = useState(false);
  const [registerEvent, setRegisterEvent] = useState<EventItem | null>(null);
  const [detailsEvent, setDetailsEvent] = useState<EventItem | null>(null);
  const [isLookupOpen, setIsLookupOpen] = useState(false);
  const [isCheckInOpen, setIsCheckInOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);
  const [is3DOpen, setIs3DOpen] = useState(false);

  // Load / save persistent registrations from localStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem('codehive2k26_registrations');
      if (stored) {
        setRegistrations(JSON.parse(stored));
      }
    } catch {
      // Ignore fallback
    }
  }, []);

  const saveRegistrations = (newRegs: Registration[]) => {
    setRegistrations(newRegs);
    try {
      localStorage.setItem('codehive2k26_registrations', JSON.stringify(newRegs));
    } catch {
      // Ignore
    }
  };

  // Add new registration
  const handleSuccessRegistration = (newReg: Registration) => {
    const updated = [newReg, ...registrations];
    saveRegistrations(updated);

    // Increment registered count for event
    setEvents(prev =>
      prev.map(ev =>
        ev.id === newReg.eventId ? { ...ev, registeredCount: ev.registeredCount + 1 } : ev
      )
    );
  };

  // Check-in action from QR Scanner
  const handleCheckInSuccess = (regId: string, staffName: string) => {
    const updated = registrations.map(r => {
      if (r.id === regId) {
        return {
          ...r,
          status: 'CHECKED_IN' as const,
          checkedInAt: new Date().toLocaleTimeString(),
          checkedInBy: staffName,
        };
      }
      return r;
    });
    saveRegistrations(updated);
  };

  // Admin status toggle
  const handleToggleStatus = (regId: string) => {
    const updated = registrations.map(r => {
      if (r.id === regId) {
        const nextStatus = r.status === 'CHECKED_IN' ? 'CONFIRMED' : 'CHECKED_IN';
        return {
          ...r,
          status: nextStatus,
          checkedInAt: nextStatus === 'CHECKED_IN' ? new Date().toLocaleTimeString() : undefined,
        };
      }
      return r;
    });
    saveRegistrations(updated);
  };

  // Filter events
  const filteredEvents = events.filter(e => {
    const matchesCategory = selectedCategory === 'All' || e.category === selectedCategory;
    const matchesSearch =
      e.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tagline.toLowerCase().includes(searchQuery.toLowerCase()) ||
      e.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen flex flex-col bg-[#020617] text-slate-100 overflow-x-hidden">
      
      {/* Navigation */}
      <Navbar
        onOpenRegister={() => {
          setRegisterEvent(events[0]);
          setIsRegisterOpen(true);
        }}
        onOpenLookup={() => setIsLookupOpen(true)}
        onOpenCheckIn={() => setIsCheckInOpen(true)}
        onOpenAdmin={() => setIsAdminOpen(true)}
        onOpen3D={() => setIs3DOpen(true)}
      />

      <main className="flex-1">
        
        {/* Hero Section */}
        <Hero
          onOpenRegister={() => {
            setRegisterEvent(events[0]);
            setIsRegisterOpen(true);
          }}
          onOpen3D={() => setIs3DOpen(true)}
          onOpenLookup={() => setIsLookupOpen(true)}
        />

        {/* 3D Spatial Arena Feature Showcase Banner */}
        <section className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative rounded-3xl p-6 sm:p-8 bg-gradient-to-r from-emerald-950/60 via-slate-900 to-cyan-950/60 border border-emerald-500/30 overflow-hidden shadow-2xl">
            <div className="absolute top-0 right-0 w-96 h-96 bg-emerald-500/10 blur-[90px] pointer-events-none rounded-full" />
            
            <div className="relative z-10 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
              <div className="max-w-2xl">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-bold uppercase tracking-wider mb-3">
                  <Compass className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Next-Gen WebGL Experience</span>
                </div>
                <h3 className="text-2xl sm:text-3xl font-black text-white">
                  Step Into the CodeHive 3D Spatial Universe
                </h3>
                <p className="text-xs sm:text-sm text-slate-300 mt-2 leading-relaxed">
                  Fly through cosmic vortex lines, navigate floating procedural tech islands, orbit the interactive globe, and encounter animated 3D delegates in real time.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 shrink-0">
                <button
                  onClick={() => setIs3DOpen(true)}
                  className="px-6 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-emerald-400 to-cyan-400 hover:from-emerald-300 hover:to-cyan-300 transition-all shadow-lg shadow-emerald-500/20 flex items-center gap-2"
                >
                  <Compass className="w-4 h-4 text-slate-950" />
                  <span>Launch 3D Arena</span>
                </button>
                <a
                  href="/github_web"
                  target="_blank"
                  rel="noreferrer"
                  className="px-5 py-3.5 rounded-xl font-semibold text-xs text-slate-300 hover:text-white bg-slate-950/80 hover:bg-slate-900 border border-slate-800 transition-colors flex items-center gap-2"
                >
                  <span>Standalone Tab</span>
                  <ExternalLink className="w-3.5 h-3.5 text-slate-400" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* Events Directory Section */}
        <section id="events" className="py-20 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Header & Controls */}
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-bold uppercase tracking-wider mb-3">
                <Trophy className="w-3.5 h-3.5" />
                <span>Events & Competitions</span>
              </div>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Explore Event Tracks
              </h2>
              <p className="text-sm text-slate-400 mt-1 max-w-xl">
                Choose from intense hackathons, competitive programming, AI agent arenas, and hands-on masterclasses.
              </p>
            </div>

            {/* Search Input */}
            <div className="relative w-full md:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search events, tracks, tags..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white placeholder-slate-500 focus:border-cyan-400 focus:outline-none transition-colors"
              />
            </div>
          </div>

          {/* Category Filter Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-4 mb-8 scrollbar-none">
            {CATEGORIES.map((cat) => {
              const count = cat === 'All' ? events.length : events.filter(e => e.category === cat).length;
              const isSelected = selectedCategory === cat;
              return (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-4 py-2 rounded-xl text-xs font-semibold whitespace-nowrap transition-all flex items-center gap-1.5 ${
                    isSelected
                      ? 'bg-gradient-to-r from-amber-400 to-cyan-400 text-slate-950 font-bold shadow-md shadow-cyan-500/20'
                      : 'bg-slate-900 text-slate-400 hover:text-white hover:bg-slate-800/80 border border-slate-800'
                  }`}
                >
                  <span>{cat}</span>
                  <span className={`text-[10px] px-1.5 py-0.2 rounded-full ${isSelected ? 'bg-slate-950/20 text-slate-950 font-black' : 'bg-slate-800 text-slate-500'}`}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          {/* Events Grid */}
          {filteredEvents.length === 0 ? (
            <div className="p-12 rounded-3xl bg-slate-900/40 border border-slate-800 text-center">
              <Filter className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <h4 className="text-base font-bold text-white">No Events Found</h4>
              <p className="text-xs text-slate-400 mt-1">
                No events match your current search or category filter. Try clearing the filters.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEvents.map((ev) => (
                <EventCard
                  key={ev.id}
                  event={ev}
                  onSelectDetails={(selected) => setDetailsEvent(selected)}
                  onRegister={(selected) => {
                    setRegisterEvent(selected);
                    setIsRegisterOpen(true);
                  }}
                />
              ))}
            </div>
          )}

        </section>

        {/* Schedule Timeline Section */}
        <ScheduleSection />

        {/* FAQ & Sponsors */}
        <FaqSection />

      </main>

      {/* Footer */}
      <Footer />

      {/* Interactive Modals */}
      <EventDetailsModal
        event={detailsEvent}
        onClose={() => setDetailsEvent(null)}
        onRegister={(ev) => {
          setRegisterEvent(ev);
          setIsRegisterOpen(true);
        }}
      />

      <RegistrationModal
        initialEvent={registerEvent}
        eventsList={events}
        isOpen={isRegisterOpen}
        onClose={() => {
          setIsRegisterOpen(false);
          setRegisterEvent(null);
        }}
        onSuccessRegistration={handleSuccessRegistration}
      />

      <LookupModal
        isOpen={isLookupOpen}
        onClose={() => setIsLookupOpen(false)}
        registrations={registrations}
      />

      <QrScannerModal
        isOpen={isCheckInOpen}
        onClose={() => setIsCheckInOpen(false)}
        registrations={registrations}
        onCheckInSuccess={handleCheckInSuccess}
      />

      <AdminModal
        isOpen={isAdminOpen}
        onClose={() => setIsAdminOpen(false)}
        registrations={registrations}
        events={events}
        onToggleStatus={handleToggleStatus}
      />

      <ImmersiveModal
        isOpen={is3DOpen}
        onClose={() => setIs3DOpen(false)}
      />

    </div>
  );
}

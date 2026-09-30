'use client';

import React, { useState } from 'react';
import { EventItem, Registration } from '../lib/types';
import { generateRegistrationNumber } from '../lib/qr';
import { TicketPass } from './ticket-pass';
import { X, Sparkles, User, Mail, Phone, School, GraduationCap, Users, Upload, CheckCircle2, ArrowRight } from 'lucide-react';
import confetti from 'canvas-confetti';

interface RegistrationModalProps {
  initialEvent?: EventItem | null;
  eventsList: EventItem[];
  isOpen: boolean;
  onClose: () => void;
  onSuccessRegistration: (reg: Registration) => void;
}

export function RegistrationModal({
  initialEvent,
  eventsList,
  isOpen,
  onClose,
  onSuccessRegistration
}: RegistrationModalProps) {
  const [selectedEventId, setSelectedEventId] = useState<string>(initialEvent ? initialEvent.id : eventsList[0]?.id || '');
  const [isTeam, setIsTeam] = useState<boolean>(initialEvent?.teamSize.includes('Members') || false);
  
  // Form State
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    college: '',
    department: 'Computer Science and Engineering',
    year: '3rd Year',
    teamName: '',
    member2: '',
    member3: '',
    member4: '',
  });

  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [confirmedRegistration, setConfirmedRegistration] = useState<Registration | null>(null);

  if (!isOpen) return null;

  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setAvatarPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = 'Valid 10-digit phone number is required';
    if (!formData.college.trim()) errs.college = 'College/University name is required';
    if (isTeam && !formData.teamName.trim()) errs.teamName = 'Team name is required for team events';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;

    setIsSubmitting(true);

    setTimeout(() => {
      const selectedEvent = eventsList.find(ev => ev.id === selectedEventId) || eventsList[0];
      const registrationNumber = generateRegistrationNumber(); // Format: CH26-XXXXXX

      const teamMembersList = [formData.name];
      if (formData.member2.trim()) teamMembersList.push(formData.member2.trim());
      if (formData.member3.trim()) teamMembersList.push(formData.member3.trim());
      if (formData.member4.trim()) teamMembersList.push(formData.member4.trim());

      const newRegistration: Registration = {
        id: `reg-${Date.now()}`,
        registrationNumber,
        participant: {
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          college: formData.college,
          department: formData.department,
          year: formData.year,
          avatarUrl: avatarPreview || undefined,
        },
        eventId: selectedEvent.id,
        eventName: selectedEvent.name,
        teamName: isTeam ? formData.teamName : undefined,
        teamMembers: isTeam ? teamMembersList : undefined,
        registeredAt: new Date().toISOString().replace('T', ' ').slice(0, 19),
        status: 'CONFIRMED',
        qrPayload: `CODEHIVE-2K26:REG:${registrationNumber}:${selectedEvent.slug}:${formData.email}`,
      };

      // Fire confetti burst!
      confetti({
        particleCount: 120,
        spread: 70,
        origin: { y: 0.6 },
        colors: ['#38bdf8', '#34d399', '#fbbf24', '#a855f7']
      });

      setConfirmedRegistration(newRegistration);
      onSuccessRegistration(newRegistration);
      setIsSubmitting(false);
    }, 600);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl p-6 sm:p-8 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {confirmedRegistration ? (
          <div>
            <div className="text-center mb-6">
              <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 mb-2">
                <CheckCircle2 className="w-6 h-6" />
              </div>
              <h3 className="text-2xl font-black text-white">Registration Confirmed!</h3>
              <p className="text-xs text-slate-400 mt-1">
                Your delegate pass has been issued. Save or download your QR ticket below.
              </p>
            </div>

            <TicketPass registration={confirmedRegistration} onClose={onClose} />
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-5">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">Fast Registration</span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
              </div>
              <h2 className="text-2xl font-black text-white">
                Register for CodeHive 2K26
              </h2>
              <p className="text-xs text-slate-400 mt-1">
                Instant digital pass generation with unique Registration ID & QR Code.
              </p>
            </div>

            {/* Event Selection dropdown */}
            <div>
              <label className="block text-xs font-bold text-slate-300 uppercase tracking-wider mb-1.5">
                Select Event / Track
              </label>
              <select
                value={selectedEventId}
                onChange={(e) => {
                  setSelectedEventId(e.target.value);
                  const ev = eventsList.find(item => item.id === e.target.value);
                  if (ev?.teamSize.includes('Members')) setIsTeam(true);
                }}
                className="w-full px-4 py-2.5 rounded-xl bg-slate-950 border border-slate-700/80 text-white text-xs font-medium focus:border-cyan-400 focus:outline-none"
              >
                {eventsList.map((ev) => (
                  <option key={ev.id} value={ev.id}>
                    {ev.name} ({ev.category} • {ev.teamSize})
                  </option>
                ))}
              </select>
            </div>

            {/* Personal Details */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <User className="w-3.5 h-3.5 text-cyan-400" />
                  Full Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Aditya Narayanan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${errors.name ? 'border-rose-500' : 'border-slate-800'} text-xs text-white focus:border-cyan-400 focus:outline-none`}
                />
                {errors.name && <p className="text-[10px] text-rose-400 mt-1">{errors.name}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Mail className="w-3.5 h-3.5 text-amber-400" />
                  Email Address *
                </label>
                <input
                  type="email"
                  placeholder="aditya@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${errors.email ? 'border-rose-500' : 'border-slate-800'} text-xs text-white focus:border-cyan-400 focus:outline-none`}
                />
                {errors.email && <p className="text-[10px] text-rose-400 mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <Phone className="w-3.5 h-3.5 text-emerald-400" />
                  Phone Number *
                </label>
                <input
                  type="tel"
                  placeholder="+91 98401 23456"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${errors.phone ? 'border-rose-500' : 'border-slate-800'} text-xs text-white focus:border-cyan-400 focus:outline-none`}
                />
                {errors.phone && <p className="text-[10px] text-rose-400 mt-1">{errors.phone}</p>}
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <School className="w-3.5 h-3.5 text-purple-400" />
                  College / University *
                </label>
                <input
                  type="text"
                  placeholder="e.g. SRM / IIT / Anna Univ"
                  value={formData.college}
                  onChange={(e) => setFormData({ ...formData, college: e.target.value })}
                  className={`w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border ${errors.college ? 'border-rose-500' : 'border-slate-800'} text-xs text-white focus:border-cyan-400 focus:outline-none`}
                />
                {errors.college && <p className="text-[10px] text-rose-400 mt-1">{errors.college}</p>}
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1 flex items-center gap-1.5">
                  <GraduationCap className="w-3.5 h-3.5 text-cyan-400" />
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="Computer Science and Engineering">Computer Science & Engg</option>
                  <option value="Information Technology">Information Technology</option>
                  <option value="Artificial Intelligence & Data Science">AI & Data Science</option>
                  <option value="Electronics & Communication">Electronics & Comm</option>
                  <option value="Electrical & Electronics">Electrical & Electronics</option>
                  <option value="Mechanical / Design">Mechanical / Design</option>
                  <option value="Other">Other Department</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">
                  Year of Study
                </label>
                <select
                  value={formData.year}
                  onChange={(e) => setFormData({ ...formData, year: e.target.value })}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
                >
                  <option value="1st Year">1st Year</option>
                  <option value="2nd Year">2nd Year</option>
                  <option value="3rd Year">3rd Year</option>
                  <option value="4th Year">4th Year</option>
                  <option value="Postgraduate / Alumni">Postgraduate / Alumni</option>
                </select>
              </div>
            </div>

            {/* Solo vs Team Switch */}
            <div className="p-3.5 rounded-xl bg-slate-950/70 border border-slate-800 flex items-center justify-between">
              <div>
                <span className="text-xs font-bold text-white block">Participation Format</span>
                <span className="text-[11px] text-slate-400">Register as an individual or team leader</span>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsTeam(false)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${!isTeam ? 'bg-cyan-500 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Solo
                </button>
                <button
                  type="button"
                  onClick={() => setIsTeam(true)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${isTeam ? 'bg-amber-400 text-slate-950 font-bold' : 'text-slate-400 hover:text-white'}`}
                >
                  Team
                </button>
              </div>
            </div>

            {/* Team details fields if team */}
            {isTeam && (
              <div className="space-y-3 p-4 rounded-xl bg-slate-950/50 border border-amber-500/20">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">
                    Team Name *
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. CyberVortex"
                    value={formData.teamName}
                    onChange={(e) => setFormData({ ...formData, teamName: e.target.value })}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-amber-400 focus:outline-none"
                  />
                  {errors.teamName && <p className="text-[10px] text-rose-400 mt-1">{errors.teamName}</p>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="Member 2 Name"
                    value={formData.member2}
                    onChange={(e) => setFormData({ ...formData, member2: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Member 3 Name"
                    value={formData.member3}
                    onChange={(e) => setFormData({ ...formData, member3: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                  <input
                    type="text"
                    placeholder="Member 4 Name"
                    value={formData.member4}
                    onChange={(e) => setFormData({ ...formData, member4: e.target.value })}
                    className="px-3 py-1.5 rounded-lg bg-slate-950 border border-slate-800 text-xs text-white"
                  />
                </div>
              </div>
            )}

            {/* Submit CTA */}
            <div className="pt-2">
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-3.5 rounded-xl font-extrabold text-xs uppercase tracking-wider text-slate-950 bg-gradient-to-r from-amber-400 via-emerald-400 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 shadow-xl shadow-cyan-500/20 active:scale-[0.99] transition-all flex items-center justify-center gap-2"
              >
                {isSubmitting ? (
                  <span>Generating Secure Ticket...</span>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4 fill-slate-950" />
                    <span>Complete Registration & Issue Pass</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
}

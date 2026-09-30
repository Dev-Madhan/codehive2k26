'use client';

import React, { useState } from 'react';
import { Registration, EventItem } from '../lib/types';
import { X, ShieldCheck, Download, Search, Filter, Users, Trophy, CheckCircle, Clock, FileSpreadsheet, RefreshCw } from 'lucide-react';

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: Registration[];
  events: EventItem[];
  onToggleStatus: (regId: string) => void;
}

export function AdminModal({
  isOpen,
  onClose,
  registrations,
  events,
  onToggleStatus
}: AdminModalProps) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEvent, setFilterEvent] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  if (!isOpen) return null;

  // Filtered registrations
  const filtered = registrations.filter((r) => {
    const matchesSearch =
      r.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.participant.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.participant.college.toLowerCase().includes(searchTerm.toLowerCase()) ||
      r.participant.email.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesEvent = filterEvent === 'ALL' || r.eventId === filterEvent;
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;

    return matchesSearch && matchesEvent && matchesStatus;
  });

  const totalCheckedIn = registrations.filter(r => r.status === 'CHECKED_IN').length;
  const attendanceRate = registrations.length > 0 ? Math.round((totalCheckedIn / registrations.length) * 100) : 0;
  const uniqueColleges = new Set(registrations.map(r => r.participant.college)).size;

  // Export to CSV
  const handleExportCsv = () => {
    const headers = [
      'RegistrationNumber',
      'Name',
      'Email',
      'Phone',
      'College',
      'Department',
      'Year',
      'Event',
      'TeamName',
      'Status',
      'RegisteredAt',
      'CheckedInAt',
    ];

    const rows = filtered.map(r => [
      `"${r.registrationNumber}"`,
      `"${r.participant.name}"`,
      `"${r.participant.email}"`,
      `"${r.participant.phone}"`,
      `"${r.participant.college}"`,
      `"${r.participant.department}"`,
      `"${r.participant.year}"`,
      `"${r.eventName}"`,
      `"${r.teamName || 'N/A'}"`,
      `"${r.status}"`,
      `"${r.registeredAt}"`,
      `"${r.checkedInAt || 'N/A'}"`,
    ]);

    const csvContent = [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `codehive2k26_registrations_${new Date().toISOString().slice(0, 10)}.csv`;
    link.click();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-5xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-slate-700 shadow-2xl p-6 sm:p-8 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              <span className="text-xs font-bold text-emerald-400 uppercase tracking-wider">
                Admin Console • Phase 06 Blueprint
              </span>
            </div>
            <h2 className="text-2xl font-black text-white">Event Operations Dashboard</h2>
          </div>

          <button
            onClick={handleExportCsv}
            className="self-start sm:self-auto inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-xs font-bold text-cyan-300 hover:text-cyan-200 transition-colors shadow-sm"
          >
            <FileSpreadsheet className="w-4 h-4 text-emerald-400" />
            <span>Export CSV ({filtered.length})</span>
          </button>
        </div>

        {/* 4 Metrics Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-6">
          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Registrations</span>
            <div className="text-2xl font-black text-white mt-1">{registrations.length}</div>
            <span className="text-[10px] text-emerald-400">Total Delegates</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Checked In</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">{totalCheckedIn}</div>
            <span className="text-[10px] text-slate-400">Badges Issued</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Attendance Rate</span>
            <div className="text-2xl font-black text-cyan-300 mt-1">{attendanceRate}%</div>
            <span className="text-[10px] text-slate-400">Turnout Metric</span>
          </div>

          <div className="p-4 rounded-2xl bg-slate-950/70 border border-slate-800">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Colleges</span>
            <div className="text-2xl font-black text-amber-400 mt-1">{uniqueColleges}</div>
            <span className="text-[10px] text-slate-400">Institutions Represented</span>
          </div>
        </div>

        {/* Filters and Search Bar */}
        <div className="p-4 rounded-2xl bg-slate-950/60 border border-slate-800 flex flex-col md:flex-row gap-3 items-stretch md:items-center justify-between mb-5">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by ID, Name, College, or Email..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-4 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>

          <div className="flex flex-wrap items-center gap-2">
            <select
              value={filterEvent}
              onChange={(e) => setFilterEvent(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Events ({events.length})</option>
              {events.map((ev) => (
                <option key={ev.id} value={ev.id}>
                  {ev.name.slice(0, 30)}...
                </option>
              ))}
            </select>

            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-300 focus:outline-none"
            >
              <option value="ALL">All Status</option>
              <option value="CONFIRMED">CONFIRMED</option>
              <option value="CHECKED_IN">CHECKED_IN</option>
            </select>
          </div>
        </div>

        {/* Registrations Table */}
        <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950/70">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-900/90 text-slate-400 font-bold uppercase text-[10px] tracking-wider border-b border-slate-800">
              <tr>
                <th className="py-3 px-4">Reg Number</th>
                <th className="py-3 px-4">Participant</th>
                <th className="py-3 px-4">College</th>
                <th className="py-3 px-4">Event</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-medium">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-8 text-center text-slate-500 italic">
                    No registrations matching the filter criteria.
                  </td>
                </tr>
              ) : (
                filtered.map((r) => (
                  <tr key={r.id} className="hover:bg-slate-900/40 transition-colors">
                    <td className="py-3 px-4 font-mono font-bold text-cyan-300">
                      {r.registrationNumber}
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-white">{r.participant.name}</div>
                      <div className="text-[10px] text-slate-400">{r.participant.email}</div>
                    </td>
                    <td className="py-3 px-4 text-slate-300 max-w-[180px] truncate">
                      {r.participant.college}
                    </td>
                    <td className="py-3 px-4 text-emerald-300 max-w-[200px] truncate">
                      {r.eventName}
                    </td>
                    <td className="py-3 px-4">
                      <span
                        className={`inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[10px] font-bold ${
                          r.status === 'CHECKED_IN'
                            ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-500/40'
                            : 'bg-cyan-950/80 text-cyan-400 border border-cyan-500/40'
                        }`}
                      >
                        {r.status === 'CHECKED_IN' ? <CheckCircle className="w-3 h-3" /> : <Clock className="w-3 h-3" />}
                        {r.status}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <button
                        onClick={() => onToggleStatus(r.id)}
                        className="text-[10px] font-semibold px-2.5 py-1 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                      >
                        Toggle Status
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

      </div>
    </div>
  );
}

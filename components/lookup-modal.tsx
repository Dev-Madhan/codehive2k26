'use client';

import React, { useState } from 'react';
import { Registration } from '../lib/types';
import { TicketPass } from './ticket-pass';
import { X, Search, QrCode, AlertCircle, ArrowRight } from 'lucide-react';

interface LookupModalProps {
  isOpen: boolean;
  onClose: () => void;
  registrations: Registration[];
}

export function LookupModal({ isOpen, onClose, registrations }: LookupModalProps) {
  const [query, setQuery] = useState('');
  const [result, setResult] = useState<Registration | null>(null);
  const [hasSearched, setHasSearched] = useState(false);

  if (!isOpen) return null;

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const clean = query.trim().toLowerCase();
    if (!clean) return;

    const found = registrations.find(
      (r) =>
        r.registrationNumber.toLowerCase() === clean ||
        r.participant.email.toLowerCase() === clean ||
        r.participant.name.toLowerCase().includes(clean)
    );

    setResult(found || null);
    setHasSearched(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div 
        className="relative w-full max-w-xl max-h-[92vh] overflow-y-auto rounded-3xl bg-slate-900 border border-cyan-500/30 shadow-2xl p-6 sm:p-8 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-700 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <div className="flex items-center gap-2 mb-1">
            <Search className="w-4 h-4 text-cyan-400" />
            <span className="text-xs font-bold text-cyan-400 uppercase tracking-wider">Pass Retrieval</span>
          </div>
          <h2 className="text-2xl font-black text-white">Find My Event Pass</h2>
          <p className="text-xs text-slate-400 mt-1">
            Search using your Registration ID (e.g. <span className="font-mono text-cyan-300">CH26-8F3K21</span>) or registered email address.
          </p>
        </div>

        {/* Search input form */}
        <form onSubmit={handleSearch} className="flex gap-2 mb-6">
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Enter Registration ID or Email"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-slate-950 border border-slate-800 text-xs text-white focus:border-cyan-400 focus:outline-none"
            />
          </div>
          <button
            type="submit"
            className="px-5 py-3 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-500 hover:from-cyan-400 hover:to-emerald-400 font-bold text-xs uppercase tracking-wider text-slate-950 transition-all flex items-center gap-1.5"
          >
            <span>Search</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Results */}
        {hasSearched && (
          <div>
            {result ? (
              <div className="space-y-4">
                <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/30 text-emerald-300 text-xs font-medium flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-400" />
                  Pass found for <strong>{result.participant.name}</strong> ({result.registrationNumber})
                </div>
                <TicketPass registration={result} />
              </div>
            ) : (
              <div className="p-6 rounded-2xl bg-slate-950/60 border border-slate-800 text-center">
                <AlertCircle className="w-8 h-8 text-amber-400 mx-auto mb-2" />
                <h4 className="text-sm font-bold text-white">No Matching Registration Found</h4>
                <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                  We could not find an active pass for &quot;{query}&quot;. Please verify the registration ID or register for an event.
                </p>
              </div>
            )}
          </div>
        )}

      </div>
    </div>
  );
}

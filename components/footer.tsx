'use client';

import React from 'react';
import { Hexagon, Mail, Globe } from 'lucide-react';

export function Footer() {
  return (
    <footer className="border-t border-slate-800 bg-slate-950 text-slate-400 text-xs py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-slate-800">
          
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 to-cyan-500 p-0.5">
              <div className="w-full h-full bg-slate-950 rounded-[10px] flex items-center justify-center">
                <Hexagon className="w-5 h-5 text-amber-400 fill-amber-400/20" />
              </div>
            </div>
            <div>
              <span className="text-base font-extrabold tracking-wider text-white">
                CODEHIVE 2K26
              </span>
              <p className="text-[11px] text-slate-500">
                National Level Technical Symposium & Hackathon
              </p>
            </div>
          </div>

          <div className="flex items-center gap-6 text-xs font-medium">
            <a href="#events" className="hover:text-white transition-colors">Events Directory</a>
            <a href="#schedule" className="hover:text-white transition-colors">Schedule</a>
            <a href="#faq" className="hover:text-white transition-colors">FAQ</a>
            <a href="/github_web" target="_blank" rel="noreferrer" className="text-emerald-400 hover:text-emerald-300 transition-colors">
              3D Spatial Arena ↗
            </a>
          </div>

          <div className="flex items-center gap-3">
            <a
              href="https://github.com"
              target="_blank"
              rel="noreferrer"
              aria-label="GitHub Repository"
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white transition-colors"
            >
              <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
              </svg>
            </a>
            <a
              href="mailto:contact@codehive2k26.org"
              aria-label="Email Contact"
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white transition-colors"
            >
              <Mail className="w-4 h-4" />
            </a>
            <a
              href="#"
              aria-label="Website"
              className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-800 flex items-center justify-center hover:text-white transition-colors"
            >
              <Globe className="w-4 h-4" />
            </a>
          </div>

        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-[11px] text-slate-500">
          <p>© 2026 CodeHive Organising Committee. All rights reserved.</p>
          <div className="flex items-center gap-1">
            <span>Engineered with Next.js 16, Tailwind CSS & WebGL</span>
          </div>
        </div>

      </div>
    </footer>
  );
}

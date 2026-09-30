'use client';

import React from 'react';
import { X, ExternalLink, Compass, Maximize2, Sparkles, Volume2 } from 'lucide-react';

interface ImmersiveModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ImmersiveModal({ isOpen, onClose }: ImmersiveModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex flex-col bg-slate-950 animate-in fade-in duration-300">
      
      {/* Top HUD Control Bar */}
      <div className="h-16 px-4 sm:px-6 bg-slate-950/90 border-b border-cyan-500/20 backdrop-blur-xl flex items-center justify-between shrink-0 z-10">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-amber-400 to-cyan-400 p-0.5">
            <div className="w-full h-full bg-slate-950 rounded-[6px] flex items-center justify-center">
              <Compass className="w-4 h-4 text-emerald-400 animate-spin" style={{ animationDuration: '10s' }} />
            </div>
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-black tracking-wider text-white">
                CODEHIVE 2K26 3D SPATIAL UNIVERSE
              </span>
              <span className="px-2 py-0.5 text-[10px] font-bold bg-emerald-950 border border-emerald-500/40 text-emerald-400 rounded-full">
                Interactive WebGL
              </span>
            </div>
            <p className="text-[10px] text-slate-400">
              Scroll down to explore vortex tracks, floating islands, and tech pavilions
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <a
            href="/github_web"
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold text-slate-300 hover:text-white bg-slate-900 hover:bg-slate-800 border border-slate-800 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5 text-cyan-400" />
            <span className="hidden sm:inline">Open Standalone</span>
          </a>

          <button
            onClick={onClose}
            className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-lg text-xs font-bold text-slate-950 bg-gradient-to-r from-amber-400 to-cyan-400 hover:from-amber-300 hover:to-cyan-300 transition-all shadow-md shadow-cyan-500/20"
          >
            <X className="w-4 h-4" />
            <span>Back to Portal</span>
          </button>
        </div>
      </div>

      {/* Embedded 3D Canvas Iframe */}
      <div className="relative flex-1 w-full h-full bg-slate-950 overflow-hidden">
        <iframe
          src="/github_web"
          title="CodeHive 2K26 3D Spatial Arena"
          className="w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        />
      </div>

    </div>
  );
}

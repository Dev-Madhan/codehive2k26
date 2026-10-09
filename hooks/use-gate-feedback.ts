"use client";

import { useState, useCallback } from "react";

export function useGateFeedback() {
  const [isMuted, setIsMuted] = useState<boolean>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("codehive_scanner_muted");
        return saved === "true";
      } catch {
        return false;
      }
    }
    return false;
  });

  const toggleMute = useCallback(() => {
    setIsMuted((prev) => {
      const next = !prev;
      try {
        localStorage.setItem("codehive_scanner_muted", String(next));
      } catch {
        // Ignore
      }
      return next;
    });
  }, []);

  const triggerFeedback = useCallback(
    (type: "success" | "duplicate" | "error") => {
      // 1. Mobile Haptic Vibration
      if (typeof window !== "undefined" && "vibrate" in navigator) {
        try {
          if (type === "success") {
            navigator.vibrate([60, 30, 60]);
          } else if (type === "duplicate") {
            navigator.vibrate([150, 60, 150]);
          } else {
            navigator.vibrate([250]);
          }
        } catch {
          // Ignore vibration policy rejections
        }
      }

      // 2. Synthesized Web Audio Chimes (Zero external asset dependencies)
      if (isMuted) return;

      try {
        const AudioCtx =
          window.AudioContext ||
          (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
        if (!AudioCtx) return;

        const ctx = new AudioCtx();
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.connect(gain);
        gain.connect(ctx.destination);

        const now = ctx.currentTime;

        if (type === "success") {
          // Crisp ascending crystal chime (E5 -> A5)
          osc.type = "sine";
          osc.frequency.setValueAtTime(659.25, now);
          osc.frequency.setValueAtTime(880, now + 0.08);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);
          osc.start(now);
          osc.stop(now + 0.28);
        } else if (type === "duplicate") {
          // Warning dissonance (320Hz -> 220Hz)
          osc.type = "triangle";
          osc.frequency.setValueAtTime(320, now);
          osc.frequency.setValueAtTime(220, now + 0.12);
          gain.gain.setValueAtTime(0.15, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
          osc.start(now);
          osc.stop(now + 0.35);
        } else {
          // Rejection low buzz (180Hz)
          osc.type = "sawtooth";
          osc.frequency.setValueAtTime(180, now);
          osc.frequency.setValueAtTime(120, now + 0.1);
          gain.gain.setValueAtTime(0.12, now);
          gain.gain.exponentialRampToValueAtTime(0.001, now + 0.3);
          osc.start(now);
          osc.stop(now + 0.3);
        }
      } catch {
        // AudioContext restricted by browser autoplay policy
      }
    },
    [isMuted]
  );

  return {
    isMuted,
    toggleMute,
    triggerFeedback,
  };
}

"use client";

import { useState, useEffect } from "react";
import { AlertTriangleIcon, XIcon } from "lucide-react";

const BANNER_DISMISSED_KEY = "codehive_postponement_dismissed_v1";

export function PostponementBanner() {
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(true);
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    try {
      const dismissed = localStorage.getItem(BANNER_DISMISSED_KEY);
      if (dismissed === "true") {
        setIsDismissed(true);
      }
    } catch {
      // ignore
    }
    setMounted(true);
  }, []);

  function dismiss() {
    setIsOpen(false);
    try {
      localStorage.setItem(BANNER_DISMISSED_KEY, "true");
    } catch {
      // ignore
    }
    setTimeout(() => {
      setIsDismissed(true);
    }, 350);
  }

  if (!mounted || isDismissed) return null;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="w-full overflow-hidden"
      style={{
        display: "grid",
        gridTemplateRows: isOpen ? "1fr" : "0fr",
        opacity: isOpen ? 1 : 0,
        transition: "grid-template-rows 320ms cubic-bezier(0.16, 1, 0.3, 1), opacity 240ms ease",
      }}
    >
      <div
        className="min-h-0 overflow-hidden"
        style={{
          transform: isOpen ? "translateY(0)" : "translateY(-100%)",
          transition: "transform 320ms cubic-bezier(0.16, 1, 0.3, 1)",
        }}
      >
        <div className="w-full bg-amber-400 border-b-2 border-amber-600">
          <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-2.5 flex items-center justify-between gap-3">
            {/* Left: Icon + Message */}
            <div className="flex items-center gap-2.5 min-w-0">
              <AlertTriangleIcon
                className="size-4 shrink-0 text-black"
                aria-hidden="true"
              />
              <p className="font-mono text-[11px] sm:text-xs font-bold text-black uppercase tracking-wide leading-snug">
                <span className="font-black">⚠ IMPORTANT UPDATE —&nbsp;</span>
                <span className="font-normal">
                  Codehive 2K26 2.0 has been{" "}
                  <strong className="font-black">temporarily postponed</strong>.
                  Tentative new date:{" "}
                  <strong className="font-black">December 2026.</strong>
                </span>
                <span className="hidden sm:inline text-black/70">
                  &nbsp;— Pre-elimination &amp; shortlisting rounds cancelled per current schedule.
                </span>
              </p>
            </div>

            {/* Right: Dismiss */}
            <button
              type="button"
              onClick={dismiss}
              aria-label="Dismiss postponement notice"
              className="shrink-0 p-1 rounded hover:bg-amber-500 active:bg-amber-600 transition-colors cursor-pointer"
            >
              <XIcon className="size-3.5 text-black" aria-hidden="true" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default PostponementBanner;


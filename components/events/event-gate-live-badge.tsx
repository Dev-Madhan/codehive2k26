"use client";

import * as React from "react";

interface EventGateLiveBadgeProps {
  initialIsOpen: boolean;
  eventSlug: string;
}

export function EventGateLiveBadge({
  initialIsOpen,
  eventSlug,
}: EventGateLiveBadgeProps) {
  const [isOpen, setIsOpen] = React.useState(initialIsOpen);

  React.useEffect(() => {
    setIsOpen(initialIsOpen);
  }, [initialIsOpen]);

  React.useEffect(() => {
    const checkLiveGate = async () => {
      try {
        const res = await fetch(`/api/events/gate?slug=${eventSlug}`, {
          cache: "no-store",
        });
        if (res.ok) {
          const json = await res.json();
          if (json.success && json.data) {
            setIsOpen(Boolean(json.data.isOpen));
          }
        }
      } catch {
        // Silently ignore
      }
    };

    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        checkLiveGate();
      }
    }, 5000);

    const handleFocus = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        checkLiveGate();
      }
    };

    window.addEventListener("focus", handleFocus);
    document.addEventListener("visibilitychange", handleFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener("focus", handleFocus);
      document.removeEventListener("visibilitychange", handleFocus);
    };
  }, [eventSlug]);

  if (isOpen) {
    return (
      <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-[11px] text-emerald-400 font-bold shrink-0">
        <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
        <span>OPEN // FREE ENTRY</span>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-1.5 sm:gap-2 font-mono text-[10px] sm:text-[11px] text-amber-400 font-bold shrink-0 border border-amber-500/40 bg-amber-500/10 px-2 py-0.5">
      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
      <span>SLOTS PAUSED</span>
    </div>
  );
}

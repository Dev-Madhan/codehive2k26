"use client";

import * as React from "react";
import { Suspense } from "react";
import { toast } from "sonner";
import { RegistrationForm } from "@/components/registration/registration-form";
import { RegistrationFormSkeleton } from "@/components/registration/registration-skeleton";
import { TrackPausedRebalanceCard } from "@/components/events/track-paused-rebalance-card";

interface EventRegistrationPortalLiveProps {
  initialIsOpen: boolean;
  eventId: string;
  eventName: string;
  eventSlug: string;
  minTeamSize?: number;
  maxTeamSize?: number;
}

export function EventRegistrationPortalLive({
  initialIsOpen,
  eventId,
  eventName,
  eventSlug,
  minTeamSize = 3,
  maxTeamSize = 3,
}: EventRegistrationPortalLiveProps) {
  const [isOpen, setIsOpen] = React.useState(initialIsOpen);
  const prevIsOpenRef = React.useRef(initialIsOpen);

  // Sync with prop changes
  React.useEffect(() => {
    setIsOpen(initialIsOpen);
    prevIsOpenRef.current = initialIsOpen;
  }, [initialIsOpen]);

  // Realtime gate check function
  const checkLiveGate = React.useCallback(async () => {
    try {
      const res = await fetch(`/api/events/gate?slug=${eventSlug}`, {
        cache: "no-store",
        headers: {
          Pragma: "no-cache",
          "Cache-Control": "no-cache",
        },
      });

      if (!res.ok) return;
      const json = await res.json();

      if (json.success && json.data) {
        const nextIsOpen = Boolean(json.data.isOpen);

        if (prevIsOpenRef.current !== nextIsOpen) {
          if (!nextIsOpen) {
            toast.warning(`Slots Paused for ${eventName}`, {
              description:
                "Registrations have been temporarily paused to balance track capacity. Please check the recommended alternative track.",
              duration: 7000,
            });
          } else {
            toast.success(`Slots Now Open for ${eventName}`, {
              description: "Registrations are actively accepting candidates. Free entry pass.",
              duration: 7000,
            });
          }
          prevIsOpenRef.current = nextIsOpen;
          setIsOpen(nextIsOpen);
        }
      }
    } catch {
      // Silently ignore background polling network errors
    }
  }, [eventSlug, eventName]);

  // Realtime polling every 5 seconds when tab is active
  React.useEffect(() => {
    const interval = setInterval(() => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        checkLiveGate();
      }
    }, 5000);

    return () => clearInterval(interval);
  }, [checkLiveGate]);

  // Realtime window focus and visibility change listener
  React.useEffect(() => {
    const handleFocusOrVisible = () => {
      if (typeof document !== "undefined" && document.visibilityState === "visible") {
        checkLiveGate();
      }
    };

    window.addEventListener("focus", handleFocusOrVisible);
    document.addEventListener("visibilitychange", handleFocusOrVisible);

    return () => {
      window.removeEventListener("focus", handleFocusOrVisible);
      document.removeEventListener("visibilitychange", handleFocusOrVisible);
    };
  }, [checkLiveGate]);

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Header Portal Strip */}
      <div className="border-b border-[#262626] pb-3 sm:pb-4 flex flex-col xs:flex-row xs:items-center justify-between gap-1.5 sm:gap-2">
        <div>
          <span className="font-mono text-[9px] sm:text-[10px] uppercase tracking-widest text-[#737373]">
            // STEP 02
          </span>
          <h2 className="text-base sm:text-2xl font-mono font-black text-white uppercase tracking-tight mt-0.5">
            {isOpen ? "REGISTRATION PORTAL" : "REGISTRATION GATEWAY"}
          </h2>
          <p className="hidden sm:block text-xs text-neutral-400 font-sans mt-0.5 sm:mt-1">
            {isOpen
              ? "Complete official squad registration. All 3 builders' details (Leader + Members 02 & 03) and merged College ID document are strictly mandatory."
              : "Track capacity and registration availability status for this symposium event."}
          </p>
        </div>

        <div className="flex items-center gap-1.5 self-start xs:self-auto shrink-0 font-mono">
          {isOpen ? (
            <>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400 inline-flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                ALL 3 BUILDERS REQUIRED
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 border border-[#404040] bg-[#161616] text-neutral-200">
                FREE PASS
              </span>
            </>
          ) : (
            <>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 border border-amber-500/40 bg-amber-500/10 text-amber-400 inline-flex items-center gap-1">
                <span className="size-1.5 rounded-full bg-amber-400" />
                SLOTS PAUSED
              </span>
              <span className="text-[9px] sm:text-[10px] font-bold uppercase px-2 py-0.5 border border-emerald-500/40 bg-emerald-500/10 text-emerald-400">
                ALTERNATIVE ACTIVE
              </span>
            </>
          )}
        </div>
      </div>

      {/* Interactive Body: Form vs Paused Rebalance Card */}
      {isOpen ? (
        <Suspense fallback={<RegistrationFormSkeleton />}>
          <RegistrationForm
            eventId={eventId}
            eventName={eventName}
            minTeamSize={minTeamSize}
            maxTeamSize={maxTeamSize}
          />
        </Suspense>
      ) : (
        <TrackPausedRebalanceCard
          currentEventName={eventName}
          currentEventSlug={eventSlug}
        />
      )}
    </div>
  );
}

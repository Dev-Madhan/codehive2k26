"use client";

import * as React from "react";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  ShieldCheckIcon,
  Loader2Icon,
  UnlockIcon,
  PauseCircleIcon,
  LockIcon,
  UsersIcon,
  SparklesIcon,
  LayersIcon,
  AlertCircleIcon,
} from "lucide-react";
import { updateEventRegistrationGate } from "@/actions/event";
import type { EventItem } from "@/components/admin/events-client";
import type { EventStatus } from "@prisma/client";

interface RegistrationControlDialogProps {
  event: EventItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: (updatedEvent: {
    id: string;
    registrationOpen: boolean;
    status: string;
    capacity?: number;
  }) => void;
}

export function RegistrationControlDialog({
  event,
  open,
  onOpenChange,
  onSuccess,
}: RegistrationControlDialogProps) {
  const [isSubmitting, setIsSubmitting] = React.useState(false);
  const [selectedGate, setSelectedGate] = React.useState<"OPEN" | "PAUSED" | "CLOSED">("OPEN");
  const [capacity, setCapacity] = React.useState<number>(100);

  React.useEffect(() => {
    if (event) {
      if (event.registrationOpen === false || event.status === "REGISTRATION_CLOSED") {
        setSelectedGate("PAUSED");
      } else {
        setSelectedGate("OPEN");
      }
      setCapacity(event.capacity || 100);
    }
  }, [event]);

  if (!event) return null;

  const currentRegistrations = event._count?.registrations || 0;
  const currentTeams = event._count?.teams || 0;
  const candidateHeadcount =
    event.candidateCount !== undefined
      ? event.candidateCount
      : currentTeams > 0
      ? currentTeams * (event.minTeamSize || 3)
      : currentRegistrations;

  const handleSave = async () => {
    try {
      setIsSubmitting(true);
      const isOpen = selectedGate === "OPEN";
      const status: EventStatus = isOpen ? "REGISTRATION_OPEN" : "REGISTRATION_CLOSED";

      const res = await updateEventRegistrationGate(event.id, {
        isOpen,
        status,
        capacity: Number(capacity) || 100,
      });

      if (!res.success) {
        toast.error(res.error?.message || "Failed to update registration status.");
        return;
      }

      toast.success(
        isOpen
          ? `Registrations opened for ${event.name}`
          : `Registrations paused for ${event.name}`
      );

      onSuccess?.({
        id: event.id,
        registrationOpen: isOpen,
        status,
        capacity: Number(capacity),
      });

      onOpenChange(false);
    } catch (err: any) {
      toast.error(err?.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={isSubmitting ? undefined : onOpenChange}>
      <DialogContent className="w-[calc(100vw-1.5rem)] xs:w-[calc(100vw-2rem)] max-w-xl bg-[#0F0F0F] border border-[#262626] text-white p-0 overflow-hidden font-mono text-xs rounded-none shadow-2xl flex flex-col max-h-[92vh] sm:max-h-[88vh]">
        {/* Header */}
        <DialogHeader className="p-4 sm:p-5 pr-12 border-b border-[#262626] bg-[#0A0A0A] space-y-1.5 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold text-white bg-white/10 border border-[#333333] px-2 py-0.5 uppercase tracking-wider inline-flex items-center gap-1.5">
              <span className="size-1.5 bg-emerald-400 animate-pulse" />
              REGISTRATION FLOW CONTROL
            </span>
          </div>
          <DialogTitle className="text-base sm:text-lg font-black text-white uppercase tracking-tight">
            {event.name}
          </DialogTitle>
          <DialogDescription className="text-xs text-neutral-400 leading-relaxed font-sans">
            Manage live applicant access, pause high-influx events, and regulate symposium track distribution.
          </DialogDescription>
        </DialogHeader>

        {/* Scrollable Body Content (Themed Brutalist Scrollbar) */}
        <div className="p-4 sm:p-5 space-y-4 overflow-y-auto flex-1 dialog-scrollbar">
          {/* Real-time Telemetry Metrics */}
          <div className="grid grid-cols-3 gap-1.5 sm:gap-2 border border-[#222222] bg-[#080808] p-2.5 sm:p-3 text-center shrink-0">
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase text-neutral-400 block truncate">
                Candidates
              </span>
              <span className="text-base sm:text-xl font-bold text-white tabular-nums block">
                {candidateHeadcount}
              </span>
              <span className="text-[8px] sm:text-[9px] text-neutral-400 block truncate">
                {currentRegistrations} passes
              </span>
            </div>
            <div className="border-x border-[#1A1A1A] min-w-0 px-1">
              <span className="text-[9px] sm:text-[10px] uppercase text-neutral-400 block truncate">
                Rosters
              </span>
              <span className="text-base sm:text-xl font-bold text-emerald-400 tabular-nums block">
                {currentTeams}
              </span>
              <span className="text-[8px] sm:text-[9px] text-neutral-400 block truncate">
                teams formed
              </span>
            </div>
            <div className="min-w-0">
              <span className="text-[9px] sm:text-[10px] uppercase text-neutral-400 block truncate">
                Track Status
              </span>
              <span
                className={`text-[9px] sm:text-xs font-bold uppercase mt-1 inline-block px-1 sm:px-1.5 py-0.5 border truncate max-w-full ${
                  event.registrationOpen !== false && event.status !== "REGISTRATION_CLOSED"
                    ? "text-emerald-400 border-emerald-500/40 bg-emerald-500/10"
                    : "text-amber-400 border-amber-500/40 bg-amber-500/10"
                }`}
              >
                {event.registrationOpen !== false && event.status !== "REGISTRATION_CLOSED"
                  ? "ACTIVE"
                  : "SLOTS PAUSED"}
              </span>
            </div>
          </div>

          {/* Action Gate Selector */}
          <div className="space-y-2">
            <label className="text-[11px] font-bold uppercase text-neutral-300 flex items-center gap-1.5">
              <span>Select Registration Gate State:</span>
            </label>

            <div className="space-y-2">
              {/* Option 1: OPEN */}
              <button
                type="button"
                onClick={() => setSelectedGate("OPEN")}
                className={`w-full text-left p-3 sm:p-3.5 border transition-all cursor-pointer flex items-start gap-3 active:scale-[0.99] ${
                  selectedGate === "OPEN"
                    ? "border-emerald-500 bg-emerald-950/20 text-white"
                    : "border-[#222222] bg-[#0A0A0A] text-neutral-400 hover:border-[#333333]"
                }`}
              >
                <div
                  className={`p-1.5 sm:p-2 border shrink-0 mt-0.5 ${
                    selectedGate === "OPEN"
                      ? "border-emerald-500/50 bg-emerald-950 text-emerald-400"
                      : "border-[#333333] bg-[#141414] text-neutral-500"
                  }`}
                >
                  <UnlockIcon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <p className="font-bold text-xs uppercase text-white flex items-center gap-1.5">
                      <span>Gate Open (Accepting Entries)</span>
                    </p>
                    {selectedGate === "OPEN" && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-emerald-500 text-black font-bold uppercase tracking-wider shrink-0">
                        ACTIVE SELECTION
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1 font-sans leading-relaxed">
                    Public form is live. New teams can verify email, input roster details, and receive instant QR passes.
                  </p>
                </div>
              </button>

              {/* Option 2: PAUSED */}
              <button
                type="button"
                onClick={() => setSelectedGate("PAUSED")}
                className={`w-full text-left p-3 sm:p-3.5 border transition-all cursor-pointer flex items-start gap-3 active:scale-[0.99] ${
                  selectedGate === "PAUSED"
                    ? "border-amber-500 bg-amber-950/20 text-white"
                    : "border-[#222222] bg-[#0A0A0A] text-neutral-400 hover:border-[#333333]"
                }`}
              >
                <div
                  className={`p-1.5 sm:p-2 border shrink-0 mt-0.5 ${
                    selectedGate === "PAUSED"
                      ? "border-amber-500/50 bg-amber-950 text-amber-400"
                      : "border-[#333333] bg-[#141414] text-neutral-500"
                  }`}
                >
                  <PauseCircleIcon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <p className="font-bold text-xs uppercase text-white flex items-center gap-1.5">
                      <span>Slots Paused (Smart Rebalancing)</span>
                    </p>
                    {selectedGate === "PAUSED" && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-amber-400 text-black font-bold uppercase tracking-wider shrink-0">
                        ACTIVE SELECTION
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1 font-sans leading-relaxed">
                    Freezes new submissions without deleting data. Directs new applicants to the other open symposium track.
                  </p>
                </div>
              </button>

              {/* Option 3: CLOSED */}
              <button
                type="button"
                onClick={() => setSelectedGate("CLOSED")}
                className={`w-full text-left p-3 sm:p-3.5 border transition-all cursor-pointer flex items-start gap-3 active:scale-[0.99] ${
                  selectedGate === "CLOSED"
                    ? "border-red-500 bg-red-950/20 text-white"
                    : "border-[#222222] bg-[#0A0A0A] text-neutral-400 hover:border-[#333333]"
                }`}
              >
                <div
                  className={`p-1.5 sm:p-2 border shrink-0 mt-0.5 ${
                    selectedGate === "CLOSED"
                      ? "border-red-500/50 bg-red-950 text-red-400"
                      : "border-[#333333] bg-[#141414] text-neutral-500"
                  }`}
                >
                  <LockIcon className="size-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between gap-1.5 flex-wrap">
                    <p className="font-bold text-xs uppercase text-white flex items-center gap-1.5">
                      <span>Gate Locked (Permanent Close)</span>
                    </p>
                    {selectedGate === "CLOSED" && (
                      <span className="text-[9px] px-1.5 py-0.5 bg-red-500 text-black font-bold uppercase tracking-wider shrink-0">
                        ACTIVE SELECTION
                      </span>
                    )}
                  </div>
                  <p className="text-[11px] text-neutral-400 mt-1 font-sans leading-relaxed">
                    Registration deadline passed or absolute ceiling achieved. Hard lock on all new entries.
                  </p>
                </div>
              </button>
            </div>
          </div>

          {/* Capacity Cap Settings */}
          <div className="border border-[#222222] bg-[#0A0A0A] p-3 sm:p-3.5 space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
              <div>
                <label className="text-[11px] font-bold uppercase text-neutral-300 block">
                  Track Capacity Ceiling
                </label>
                <span className="text-[10px] text-neutral-400 font-sans block mt-0.5">
                  Maximum total candidate quota for hall capacity management.
                </span>
              </div>
              <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                <input
                  type="number"
                  min={currentRegistrations || 1}
                  max={1000}
                  value={capacity}
                  onChange={(e) => setCapacity(Number(e.target.value))}
                  className="w-24 sm:w-28 bg-[#050505] border border-[#333333] px-3 py-1.5 text-xs text-white font-mono focus:outline-hidden focus:border-white rounded-none tabular-nums"
                />
                <span className="text-[10px] text-neutral-400 uppercase font-mono">SEATS</span>
              </div>
            </div>
          </div>

          {/* Zero Data Loss Reassurance Alert */}
          <div className="border border-emerald-500/30 bg-emerald-950/15 p-3 flex items-start gap-2.5">
            <ShieldCheckIcon className="size-4 text-emerald-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 min-w-0">
              <p className="text-[11px] font-bold text-emerald-400 uppercase tracking-wide">
                Zero Data Loss Guarantee
              </p>
              <p className="text-[10px] text-neutral-300 leading-relaxed font-sans">
                Toggling or pausing registration status will <strong>never</strong> delete or alter any existing registrations ({candidateHeadcount} candidates across {currentTeams} teams). All QR passes and confirmations remain 100% valid.
              </p>
            </div>
          </div>

          {/* Smart Rebalance Hint */}
          <div className="border border-sky-500/20 bg-sky-950/10 p-3 flex items-start gap-2.5">
            <SparklesIcon className="size-4 text-sky-400 shrink-0 mt-0.5" />
            <div className="space-y-0.5 min-w-0">
              <p className="text-[11px] font-bold text-sky-400 uppercase tracking-wide">
                Automated Rebalance Active
              </p>
              <p className="text-[10px] text-neutral-400 leading-relaxed font-sans">
                When set to <strong>SLOTS PAUSED</strong>, students attempting to register will see an automated invitation to register for the other symposium track with identical prizes and perks.
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <DialogFooter className="p-3.5 sm:p-4 border-t border-[#262626] bg-[#0A0A0A] flex flex-col-reverse sm:flex-row sm:items-center sm:justify-end gap-2.5 shrink-0">
          <Button
            type="button"
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={isSubmitting}
            className="w-full sm:w-auto h-10 rounded-none border-[#333333] bg-[#141414] text-neutral-300 hover:text-white font-mono text-xs uppercase cursor-pointer"
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleSave}
            disabled={isSubmitting}
            className="w-full sm:w-auto h-10 rounded-none bg-white hover:bg-neutral-200 text-black font-mono text-xs uppercase font-bold px-5 cursor-pointer border border-white flex items-center justify-center gap-1.5 active:scale-[0.99]"
          >
            {isSubmitting ? (
              <>
                <Loader2Icon className="size-3.5 animate-spin" />
                <span>Applying Gate State...</span>
              </>
            ) : (
              <span>Confirm &amp; Apply Changes</span>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

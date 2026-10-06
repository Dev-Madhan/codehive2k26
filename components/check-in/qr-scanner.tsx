"use client";

import { useState, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkInParticipant } from "@/actions/checkin";
import { CheckInResult } from "@/types/registration";
import { useSession } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  CheckCircle2Icon,
  AlertCircleIcon,
  ShieldCheckIcon,
  TicketIcon,
  UsersIcon,
  ClockIcon,
  BuildingIcon,
  ClipboardPasteIcon,
  XIcon,
  HistoryIcon,
  ArrowRightIcon,
  SparklesIcon,
} from "lucide-react";

export function PassVerifierComponent() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get("code") || searchParams.get("token") || "";
  const [tokenInput, setTokenInput] = useState(codeFromUrl);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentScans, setRecentScans] = useState<CheckInResult[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (codeFromUrl) {
      setTokenInput(codeFromUrl);
    }
  }, [codeFromUrl]);

  const { data: session } = useSession();

  // Audio & Haptic feedback on mobile
  const triggerMobileFeedback = (success: boolean) => {
    // 1. Haptic vibration
    if (typeof window !== "undefined" && "vibrate" in navigator) {
      try {
        if (success) {
          navigator.vibrate([80, 40, 80]);
        } else {
          navigator.vibrate([150, 50, 150]);
        }
      } catch {
        // Ignore vibration errors
      }
    }

    // 2. Synthesized audio chime
    try {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);

      if (success) {
        osc.frequency.setValueAtTime(659.25, ctx.currentTime); // E5
        osc.frequency.setValueAtTime(880, ctx.currentTime + 0.08); // A5
        gain.gain.setValueAtTime(0.12, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.25);
        osc.start();
        osc.stop(ctx.currentTime + 0.25);
      } else {
        osc.frequency.setValueAtTime(240, ctx.currentTime);
        osc.frequency.setValueAtTime(180, ctx.currentTime + 0.1);
        gain.gain.setValueAtTime(0.15, ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.3);
        osc.start();
        osc.stop(ctx.currentTime + 0.3);
      }
    } catch {
      // Audio context restricted by browser policy
    }
  };

  const handleManualCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    const clean = tokenInput.trim();
    if (!clean) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const staffId = session?.user?.id || "admin_session_verifier";

    const res = await checkInParticipant(staffId, {
      qrToken: clean,
      deviceInfo: "Mobile Console Verifier",
    });

    setLoading(false);

    if (res.success) {
      setResult(res.data);
      setTokenInput("");
      setRecentScans((prev) => [res.data, ...prev.slice(0, 4)]);
      triggerMobileFeedback(true);
      toast.success("Attendee Verified & Checked In!", {
        description: `${res.data.participantName} (${res.data.registrationNumber})`,
      });
    } else {
      setError(res.error.message);
      triggerMobileFeedback(false);
      toast.error("Verification Rejected", {
        description: res.error.message,
      });
    }
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        setTokenInput(text.trim().toUpperCase());
        toast.info("Pasted from clipboard");
      }
    } catch {
      toast.error("Clipboard permission required");
    }
  };

  const handleResetForNext = () => {
    setResult(null);
    setError(null);
    setTokenInput("");
    setTimeout(() => {
      inputRef.current?.focus();
    }, 100);
  };

  return (
    <div className="max-w-xl mx-auto rounded-none border border-[#262626] bg-[#0F0F0F] p-4 sm:p-7 space-y-5 font-mono max-w-full">
      {/* ── Header ── */}
      <div className="text-center space-y-2 border-b border-[#262626] pb-4 sm:pb-5">
        <div className="inline-flex size-11 sm:size-12 items-center justify-center rounded-none bg-[#161616] text-white border border-[#262626] mb-1">
          <TicketIcon className="size-5 sm:size-6" />
        </div>
        <h2 className="text-base sm:text-lg font-bold text-white uppercase tracking-wider">
          &gt; Event Pass Verifier &amp; Check-In
        </h2>
        <p className="text-xs text-[#A3A3A3] max-w-md mx-auto leading-relaxed">
          Enter attendee 6-character Pass Code (e.g. <span className="text-white font-bold">CH26-XXXXXX</span>) or scan QR token.
        </p>
      </div>

      {/* ── Mobile Form with Touch-Friendly Inputs ── */}
      <form onSubmit={handleManualCheckIn} className="space-y-3.5">
        <div className="space-y-1.5">
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#A3A3A3] font-bold">
            <span>Pass Code or QR Token</span>
            <button
              type="button"
              onClick={handlePaste}
              className="inline-flex items-center gap-1 text-white hover:text-[#A3A3A3] cursor-pointer"
            >
              <ClipboardPasteIcon className="size-3" />
              <span>[ Paste ]</span>
            </button>
          </div>

          <div className="relative">
            <Input
              ref={inputRef}
              value={tokenInput}
              onChange={(e) => setTokenInput(e.target.value.toUpperCase())}
              placeholder="ENTER PASS CODE (e.g. CH26-ABC123)"
              className="h-12 sm:h-13 rounded-none border border-[#262626] bg-[#080808] text-white font-mono text-center tracking-widest placeholder:text-[#525252] focus:border-white focus:ring-1 focus:ring-white text-sm sm:text-base uppercase pr-10"
              autoCapitalize="characters"
              autoCorrect="off"
            />
            {tokenInput && (
              <button
                type="button"
                onClick={() => setTokenInput("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-1 text-[#737373] hover:text-white cursor-pointer"
                aria-label="Clear input"
              >
                <XIcon className="size-4" />
              </button>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !tokenInput.trim()}
          className="h-11 sm:h-12 w-full rounded-none font-mono text-xs uppercase tracking-wider font-bold bg-white hover:bg-neutral-200 text-black border border-white transition-colors cursor-pointer shadow-md disabled:opacity-40"
        >
          {loading ? "[ VERIFYING PASS... ]" : "[ VALIDATE & CHECK-IN ATTENDEE ]"}
        </Button>
      </form>

      {/* ── Success Result Card (Mobile-Optimized Stacking) ── */}
      {result && (
        <div className="rounded-none border-2 border-white/80 bg-[#080808] p-4 sm:p-5 space-y-4 shadow-xl animate-in fade-in zoom-in-95 duration-200">
          <div className="flex items-center justify-between border-b border-[#262626] pb-3">
            <div className="flex items-center gap-2 text-white font-bold text-xs uppercase">
              <ShieldCheckIcon className="size-4 sm:size-5 text-white shrink-0" />
              <span className="truncate">Pass Verified • Admitted</span>
            </div>
            <span className="text-[10px] font-mono text-black font-bold bg-white border border-white px-2 py-0.5 shrink-0">
              ATTENDED
            </span>
          </div>

          <div className="space-y-2.5 text-xs">
            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 border-b border-[#262626]/60 pb-1.5">
              <span className="text-[#737373] uppercase text-[10px]">Pass Code:</span>
              <span className="text-base sm:text-lg font-bold text-white tracking-wider">
                {result.registrationNumber}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 border-b border-[#262626]/60 pb-1.5">
              <span className="text-[#737373] uppercase text-[10px]">Attendee:</span>
              <span className="font-bold text-white text-sm sm:text-base">
                {result.participantName}
              </span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 border-b border-[#262626]/60 pb-1.5">
              <span className="text-[#737373] uppercase text-[10px]">Event:</span>
              <span className="font-semibold text-[#E5E5E5]">
                {result.eventName}
              </span>
            </div>

            {result.college && (
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 border-b border-[#262626]/60 pb-1.5">
                <span className="text-[#737373] uppercase text-[10px]">College:</span>
                <span className="text-[#A3A3A3] text-[11px] sm:text-xs">
                  {result.college} {result.department ? `(${result.department})` : ""}
                </span>
              </div>
            )}

            {result.teamName && (
              <div className="flex flex-col sm:flex-row sm:items-baseline sm:justify-between gap-0.5 border-b border-[#262626]/60 pb-1.5">
                <span className="text-[#737373] uppercase text-[10px]">Team:</span>
                <span className="font-bold text-white">
                  {result.teamName.toUpperCase()}
                </span>
              </div>
            )}

            {result.teamMembers && result.teamMembers.length > 0 && (
              <div className="pt-1">
                <span className="text-[#737373] uppercase text-[10px] block mb-1">
                  Team Members:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {result.teamMembers.map((m, i) => (
                    <span
                      key={i}
                      className="px-2 py-0.5 rounded-none border border-[#262626] bg-[#161616] text-[10px] text-[#E5E5E5]"
                    >
                      {m}
                    </span>
                  ))}
                </div>
              </div>
            )}

            <div className="flex items-center justify-between text-[10px] text-[#737373] pt-2 border-t border-[#262626]">
              <span className="flex items-center gap-1">
                <ClockIcon className="size-3" />
                Time: {new Date(result.checkedInAt).toLocaleTimeString("en-IN")}
              </span>
              <span className="text-white font-bold">STATUS: OK</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleResetForNext}
            className="w-full h-10 rounded-none bg-white hover:bg-neutral-200 text-black font-mono text-xs uppercase tracking-wider font-bold cursor-pointer transition-colors shadow-sm"
          >
            [ + Validate Next Attendee ]
          </Button>
        </div>
      )}

      {/* ── Error Banner ── */}
      {error && (
        <div className="rounded-none border border-red-900/60 bg-red-950/30 p-4 text-center space-y-1 text-red-400 animate-in fade-in duration-150">
          <div className="flex items-center justify-center gap-1.5 font-bold text-xs uppercase">
            <AlertCircleIcon className="size-4 shrink-0" />
            <span>Verification Rejected</span>
          </div>
          <p className="text-xs text-red-300 font-sans">{error}</p>
          <button
            type="button"
            onClick={() => {
              setError(null);
              inputRef.current?.focus();
            }}
            className="mt-2 text-[10px] text-red-400 hover:text-red-200 underline cursor-pointer"
          >
            [ Dismiss &amp; Retry ]
          </button>
        </div>
      )}

      {/* ── Recent Scans Feed (Mobile Gate Assistant) ── */}
      {recentScans.length > 0 && (
        <div className="border-t border-[#262626] pt-4 space-y-2">
          <div className="flex items-center justify-between text-[11px] text-[#A3A3A3] font-bold uppercase">
            <span className="flex items-center gap-1.5">
              <HistoryIcon className="size-3 text-white" />
              Recent Admissions
            </span>
            <span className="text-[10px] text-[#737373]">{recentScans.length} logged</span>
          </div>

          <div className="space-y-1.5">
            {recentScans.map((scan, i) => (
              <div
                key={`${scan.registrationNumber}-${i}`}
                className="flex items-center justify-between p-2 bg-[#080808] border border-[#262626] text-xs"
              >
                <div className="flex items-center gap-2 min-w-0">
                  <CheckCircle2Icon className="size-3.5 text-white shrink-0" />
                  <div className="min-w-0">
                    <p className="font-bold text-white text-[11px] truncate">{scan.participantName}</p>
                    <p className="text-[10px] text-[#737373] font-mono truncate">{scan.registrationNumber} • {scan.eventName}</p>
                  </div>
                </div>
                <span className="text-[10px] text-[#A3A3A3] shrink-0 ml-2">
                  {new Date(scan.checkedInAt).toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" })}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default PassVerifierComponent;

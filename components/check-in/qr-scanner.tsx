"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useSearchParams } from "next/navigation";
import { useSession } from "@/lib/auth-client";
import { checkInParticipant } from "@/actions/checkin";
import { CheckInResult } from "@/types/registration";
import { useQrScanner, extractPassToken } from "@/hooks/use-qr-scanner";
import { useGateFeedback } from "@/hooks/use-gate-feedback";
import { CameraViewfinder } from "@/components/check-in/camera-viewfinder";
import { FileDropScanner } from "@/components/check-in/file-drop-scanner";
import { VerificationCard } from "@/components/check-in/verification-card";
import { GateStatsBar } from "@/components/check-in/gate-stats-bar";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Toggle } from "@/components/ui/toggle";
import { toast } from "sonner";
import {
  TicketIcon,
  ClipboardPasteIcon,
  XIcon,
  AlertCircleIcon,
  CameraIcon,
  UploadCloudIcon,
  KeyboardIcon,
  EyeIcon,
  CheckCircle2Icon,
  Loader2Icon,
} from "lucide-react";

export function PassVerifierComponent() {
  const searchParams = useSearchParams();
  const codeFromUrl = searchParams.get("code") || searchParams.get("token") || "";

  const [activeTab, setActiveTab] = useState<string>("camera");
  const [tokenInput, setTokenInput] = useState(codeFromUrl);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [recentScans, setRecentScans] = useState<CheckInResult[]>([]);
  const [isRapidMode, setIsRapidMode] = useState<boolean>(false);
  const [isInspectMode, setIsInspectMode] = useState<boolean>(false);
  const [rapidFeedbackBanner, setRapidFeedbackBanner] = useState<{
    name: string;
    code: string;
    success: boolean;
  } | null>(null);

  const inputRef = useRef<HTMLInputElement>(null);
  const resultCardRef = useRef<HTMLDivElement>(null);
  const scannerCardRef = useRef<HTMLDivElement>(null);
  const autoResetTimerRef = useRef<NodeJS.Timeout | null>(null);

  const { data: session } = useSession();
  const { isMuted, toggleMute, triggerFeedback } = useGateFeedback();

  // QR Scanner hook
  const {
    videoRef,
    hasCamera,
    isScanning,
    permissionDenied,
    cameras,
    selectedCameraId,
    hasFlash,
    isFlashOn,
    scannerError,
    startScanning,
    stopScanning,
    toggleFlash,
    changeCamera,
    scanImageFile,
  } = useQrScanner({
    onScan: (token) => {
      if (loading || result) return;
      executeVerification(token);
    },
    debounceMs: 2500,
    autoStart: activeTab === "camera",
  });

  // Primary verification runner
  const executeVerification = useCallback(
    async (token: string, inspectOnlyOverride?: boolean) => {
      const cleanToken = extractPassToken(token);
      if (!cleanToken) return;

      setLoading(true);
      setError(null);

      // In non-rapid mode, pause scanner while inspecting pass result
      if (!isRapidMode) {
        stopScanning();
      }

      const staffId = session?.user?.id || "admin_session_verifier";
      const inspectFlag =
        typeof inspectOnlyOverride === "boolean" ? inspectOnlyOverride : isInspectMode;

      const res = await checkInParticipant(staffId, {
        qrToken: cleanToken,
        deviceInfo: "CodeHive Real-Time Web Scanner",
        inspectOnly: inspectFlag,
      });

      setLoading(false);

      if (res.success) {
        setResult(res.data);
        setTokenInput("");

        // Scroll smoothly to pass information below scanner
        setTimeout(() => {
          resultCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 150);

        if (!inspectFlag && !res.data.alreadyCheckedIn) {
          setRecentScans((prev) => [res.data, ...prev.slice(0, 9)]);
        }

        if (res.data.alreadyCheckedIn) {
          triggerFeedback("duplicate");
          toast.warning("Duplicate Entry Detected!", {
            description: `${res.data.participantName} was already checked in.`,
          });
        } else {
          triggerFeedback("success");
          toast.success(
            inspectFlag ? "Pass Inspected (Audit Mode)" : "Attendee Admitted & Checked In!",
            {
              description: `${res.data.participantName} (${res.data.registrationNumber})`,
            }
          );
        }

        // Rapid Gate Auto-Advance handling
        if (isRapidMode && !inspectFlag) {
          setRapidFeedbackBanner({
            name: res.data.participantName,
            code: res.data.registrationNumber,
            success: !res.data.alreadyCheckedIn,
          });

          if (autoResetTimerRef.current) {
            clearTimeout(autoResetTimerRef.current);
          }

          autoResetTimerRef.current = setTimeout(() => {
            setRapidFeedbackBanner(null);
            setResult(null);
          }, 1800);
        }
      } else {
        setError(res.error.message);
        triggerFeedback(
          res.error.code === "ALREADY_CHECKED_IN" ? "duplicate" : "error"
        );
        toast.error("Verification Rejected", {
          description: res.error.message,
        });

        if (isRapidMode) {
          setRapidFeedbackBanner({
            name: "REJECTED",
            code: cleanToken,
            success: false,
          });
          if (autoResetTimerRef.current) {
            clearTimeout(autoResetTimerRef.current);
          }
          autoResetTimerRef.current = setTimeout(() => {
            setRapidFeedbackBanner(null);
          }, 2200);
        } else {
          // Restart scanning on error so staff can retry immediately
          startScanning();
        }
      }
    },
    [session?.user?.id, isInspectMode, isRapidMode, triggerFeedback, stopScanning, startScanning]
  );

  // Handle URL query parameters on initial page load
  useEffect(() => {
    if (codeFromUrl) {
      Promise.resolve().then(() => {
        executeVerification(codeFromUrl);
      });
    }
  }, [codeFromUrl, executeVerification]);

  // Tab change handler
  const handleTabChange = (newTab: string) => {
    setActiveTab(newTab);
    if (newTab === "camera") {
      startScanning();
    } else {
      stopScanning();
    }
  };

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!tokenInput.trim() || loading) return;
    executeVerification(tokenInput.trim());
  };

  const handlePaste = async () => {
    try {
      const text = await navigator.clipboard.readText();
      if (text) {
        const clean = extractPassToken(text);
        setTokenInput(clean);
        toast.info("Pasted Pass Code");
      }
    } catch {
      toast.error("Clipboard permission required");
    }
  };

  const handleScanNext = () => {
    setResult(null);
    setError(null);
    setTokenInput("");

    // Scroll smoothly back up to scanner
    scannerCardRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

    if (activeTab === "camera") {
      startScanning();
    } else if (activeTab === "manual") {
      setTimeout(() => inputRef.current?.focus(), 100);
    }
  };

  const handleAdmitNowFromInspect = () => {
    if (result) {
      executeVerification(result.registrationNumber, false);
    }
  };

  return (
    <div className="w-full space-y-3 sm:space-y-4 font-mono">
      {/* ── Compact Gate Statistics Bar ── */}
      <GateStatsBar recentScans={recentScans} shiftCount={recentScans.length} />

      {/* ── Main Scanner Card (Clean, Centered, Focused) ── */}
      <div ref={scannerCardRef}>
        <Card className="rounded-none border-[#262626] bg-[#0A0A0A] font-mono shadow-2xl p-0 overflow-hidden">
          {/* Header Strip */}
          <CardHeader className="border-b border-[#262626] p-3 sm:p-4 bg-[#0D0D0D]">
            <div className="flex items-center justify-between gap-2">
              <div className="flex items-center gap-2 min-w-0">
                <div className="size-7 bg-[#161616] border border-[#262626] flex items-center justify-center text-white shrink-0">
                  <TicketIcon className="size-3.5" />
                </div>
                <CardTitle className="text-xs sm:text-sm font-bold uppercase tracking-wider text-white truncate">
                  &gt; Gate Pass Scanner
                </CardTitle>
              </div>

              {/* View/Check-in Mode Switcher */}
              <div className="flex items-center gap-1.5 shrink-0">
                <Toggle
                  pressed={isInspectMode}
                  onPressedChange={setIsInspectMode}
                  title="Audit Mode: Preview pass without marking database"
                  className={`h-7 px-2 rounded-none border text-[9px] uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all ${
                    isInspectMode
                      ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/60"
                      : "border-[#262626] bg-[#121212] text-[#A3A3A3] hover:text-white"
                  }`}
                >
                  <EyeIcon className="size-3 mr-1" />
                  <span>{isInspectMode ? "AUDIT" : "CHECK-IN"}</span>
                </Toggle>
              </div>
            </div>
          </CardHeader>

          <CardContent className="p-3 sm:p-4 space-y-3">
            {/* Rapid Mode Floating Notification HUD */}
            {rapidFeedbackBanner && (
              <div
                className={`p-3 border text-center animate-in fade-in slide-in-from-top-2 duration-150 ${
                  rapidFeedbackBanner.success
                    ? "bg-emerald-950/70 border-emerald-500 text-emerald-300 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
                    : "bg-red-950/70 border-red-500 text-red-300 shadow-[0_0_20px_rgba(239,68,68,0.2)]"
                }`}
              >
                <div className="flex items-center justify-center gap-2 text-xs font-bold uppercase">
                  {rapidFeedbackBanner.success ? (
                    <CheckCircle2Icon className="size-4.5 text-emerald-400 shrink-0" />
                  ) : (
                    <AlertCircleIcon className="size-4.5 text-red-400 shrink-0" />
                  )}
                  <span className="truncate">
                    {rapidFeedbackBanner.success ? "ADMITTED:" : "BLOCKED:"}{" "}
                    {rapidFeedbackBanner.name} ({rapidFeedbackBanner.code})
                  </span>
                </div>
                <p className="text-[10px] text-[#A3A3A3] mt-1 font-mono">
                  Auto-resuming camera for next pass...
                </p>
              </div>
            )}

            {/* Mode Switcher Tabs */}
            <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
              <TabsList className="w-full grid grid-cols-3 rounded-none bg-[#050505] border border-[#262626] p-0.5 sm:p-1 h-9 sm:h-10">
                <TabsTrigger
                  value="camera"
                  className="rounded-none text-[10px] sm:text-xs uppercase font-mono tracking-wider text-[#A3A3A3] data-active:bg-white data-active:text-black data-active:font-bold py-1 cursor-pointer"
                >
                  <CameraIcon className="size-3 sm:size-3.5 mr-1 shrink-0" />
                  <span>Camera</span>
                </TabsTrigger>
                <TabsTrigger
                  value="upload"
                  className="rounded-none text-[10px] sm:text-xs uppercase font-mono tracking-wider text-[#A3A3A3] data-active:bg-white data-active:text-black data-active:font-bold py-1 cursor-pointer"
                >
                  <UploadCloudIcon className="size-3 sm:size-3.5 mr-1 shrink-0" />
                  <span>Upload</span>
                </TabsTrigger>
                <TabsTrigger
                  value="manual"
                  className="rounded-none text-[10px] sm:text-xs uppercase font-mono tracking-wider text-[#A3A3A3] data-active:bg-white data-active:text-black data-active:font-bold py-1 cursor-pointer"
                >
                  <KeyboardIcon className="size-3 sm:size-3.5 mr-1 shrink-0" />
                  <span>Manual</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab 1: Live Camera Viewfinder */}
              <TabsContent value="camera" className="mt-3 space-y-3">
                <CameraViewfinder
                  videoRef={videoRef}
                  isScanning={isScanning}
                  hasCamera={hasCamera}
                  permissionDenied={permissionDenied}
                  cameras={cameras}
                  selectedCameraId={selectedCameraId}
                  hasFlash={hasFlash}
                  isFlashOn={isFlashOn}
                  scannerError={scannerError}
                  isMuted={isMuted}
                  isRapidMode={isRapidMode}
                  onCameraChange={changeCamera}
                  onToggleFlash={toggleFlash}
                  onToggleMute={toggleMute}
                  onToggleRapidMode={() => setIsRapidMode((prev) => !prev)}
                  onRetryCamera={startScanning}
                />
              </TabsContent>

              {/* Tab 2: Ticket Screenshot Dropzone */}
              <TabsContent value="upload" className="mt-3">
                <FileDropScanner
                  onScanImage={async (file) => {
                    const token = await scanImageFile(file);
                    await executeVerification(token);
                    return token;
                  }}
                  disabled={loading}
                />
              </TabsContent>

              {/* Tab 3: Manual Code Entry */}
              <TabsContent value="manual" className="mt-3 space-y-3">
                <form onSubmit={handleManualSubmit} className="space-y-3">
                  <div className="space-y-1.5">
                    <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#A3A3A3] font-bold">
                      <span>Pass Code or Scanned Token</span>
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
                        className="h-11 sm:h-12 rounded-none border border-[#262626] bg-[#050505] text-white font-mono text-center tracking-widest placeholder:text-[#404040] focus:border-white focus:ring-1 focus:ring-white text-sm sm:text-base uppercase pr-10"
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
                    className="h-11 w-full rounded-none font-mono text-xs uppercase tracking-wider font-bold bg-white hover:bg-neutral-200 text-black border border-white transition-colors cursor-pointer shadow-md disabled:opacity-40"
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <Loader2Icon className="size-3.5 animate-spin" />
                        [ VERIFYING PASS... ]
                      </span>
                    ) : (
                      <span>[ VALIDATE &amp; CHECK-IN ATTENDEE ]</span>
                    )}
                  </Button>
                </form>
              </TabsContent>
            </Tabs>

            {/* Loading Indicator */}
            {loading && !rapidFeedbackBanner && (
              <div className="p-3 bg-[#121212] border border-[#262626] text-center space-y-1.5 animate-pulse">
                <Loader2Icon className="size-4.5 animate-spin mx-auto text-white" />
                <p className="text-[11px] uppercase tracking-wider text-white font-bold">
                  [ VERIFYING ATTENDEE AGAINST REGISTRATION ROSTER... ]
                </p>
              </div>
            )}

            {/* Error Banner */}
            {error && !rapidFeedbackBanner && (
              <div className="rounded-none border border-red-900/60 bg-red-950/30 p-3 text-center space-y-1.5 text-red-400 animate-in fade-in duration-150">
                <div className="flex items-center justify-center gap-1.5 font-bold text-xs uppercase">
                  <AlertCircleIcon className="size-4 shrink-0" />
                  <span>Verification Rejected</span>
                </div>
                <p className="text-xs text-red-300 font-mono leading-relaxed">{error}</p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setError(null);
                    if (activeTab === "camera") startScanning();
                  }}
                  className="text-[10px] text-red-400 hover:text-red-200 uppercase font-mono underline cursor-pointer h-6 px-2 mt-1"
                >
                  [ Dismiss &amp; Try Again ]
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* ── Pass Information Displayed Below Scanner After Scanning ── */}
      {result && !rapidFeedbackBanner && (
        <div ref={resultCardRef} className="pt-2">
          <VerificationCard
            result={result}
            onNextScan={handleScanNext}
            onAdmitNow={handleAdmitNowFromInspect}
            isInspectMode={isInspectMode}
          />
        </div>
      )}
    </div>
  );
}

export default PassVerifierComponent;

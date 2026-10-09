"use client";

import { RefObject } from "react";
import { CameraDevice } from "@/hooks/use-qr-scanner";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Toggle } from "@/components/ui/toggle";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ZapIcon,
  ZapOffIcon,
  Volume2Icon,
  VolumeXIcon,
  VideoIcon,
  VideoOffIcon,
  AlertTriangleIcon,
  SparklesIcon,
  RefreshCwIcon,
} from "lucide-react";

interface CameraViewfinderProps {
  videoRef: RefObject<HTMLVideoElement | null>;
  isScanning: boolean;
  hasCamera: boolean | null;
  permissionDenied: boolean;
  cameras: CameraDevice[];
  selectedCameraId: string;
  hasFlash: boolean;
  isFlashOn: boolean;
  scannerError: string | null;
  isMuted: boolean;
  isRapidMode: boolean;
  onCameraChange: (id: string) => void;
  onToggleFlash: () => void;
  onToggleMute: () => void;
  onToggleRapidMode: () => void;
  onRetryCamera: () => void;
}

export function CameraViewfinder({
  videoRef,
  isScanning,
  hasCamera,
  permissionDenied,
  cameras,
  selectedCameraId,
  hasFlash,
  isFlashOn,
  scannerError,
  isMuted,
  isRapidMode,
  onCameraChange,
  onToggleFlash,
  onToggleMute,
  onToggleRapidMode,
  onRetryCamera,
}: CameraViewfinderProps) {
  // Mobile one-tap camera flip
  const handleFlipCamera = () => {
    if (cameras.length <= 1) return;
    const currentIndex = cameras.findIndex((c) => c.id === selectedCameraId);
    const nextIndex = (currentIndex + 1) % cameras.length;
    onCameraChange(cameras[nextIndex].id);
  };

  return (
    <Card className="rounded-none border-[#262626] bg-[#080808] p-0 font-mono overflow-hidden shadow-2xl">
      {/* ── Top Bar (Desktop Device Selector & Status) ── */}
      <div className="flex items-center justify-between gap-2 border-b border-[#262626] px-2.5 py-2 sm:px-3 sm:py-2.5 bg-[#0D0D0D]">
        <div className="flex items-center gap-1.5 sm:gap-2 min-w-0 flex-1">
          <Badge
            variant="outline"
            className="rounded-none border-[#262626] bg-[#141414] text-[9px] sm:text-[10px] uppercase font-mono px-2 py-0.5 text-white shrink-0"
          >
            <span
              className={`size-1.5 rounded-full ${
                isScanning ? "bg-red-500 animate-pulse" : "bg-neutral-500"
              } mr-1 inline-block`}
            />
            {isScanning ? "LIVE" : "PAUSED"}
          </Badge>

          {cameras.length > 0 && (
            <div className="hidden sm:block flex-1 max-w-56">
              <Select
                value={selectedCameraId}
                onValueChange={(val) => {
                  if (val) onCameraChange(val);
                }}
              >
                <SelectTrigger className="h-7.5 rounded-none border-[#262626] bg-[#080808] text-[11px] font-mono text-[#E5E5E5] w-full">
                  <SelectValue placeholder="Select Camera" />
                </SelectTrigger>
                <SelectContent className="rounded-none border-[#262626] bg-[#0F0F0F] text-white font-mono text-xs">
                  {cameras.map((cam) => (
                    <SelectItem key={cam.id} value={cam.id}>
                      {cam.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
        </div>

        {/* Quick Rapid Mode Header Toggle */}
        <div className="flex items-center gap-1.5 shrink-0">
          <Toggle
            pressed={isRapidMode}
            onPressedChange={onToggleRapidMode}
            title="Rapid Gate: Auto-advancing check-ins"
            className={`h-7 sm:h-8 px-2 sm:px-2.5 rounded-none border text-[9px] sm:text-[10px] uppercase font-bold tracking-wider cursor-pointer active:scale-95 transition-all ${
              isRapidMode
                ? "bg-white text-black border-white"
                : "border-[#262626] bg-[#121212] text-[#A3A3A3] hover:text-white"
            }`}
          >
            <SparklesIcon className="size-3 mr-1" />
            <span>RAPID</span>
          </Toggle>
        </div>
      </div>

      {/* ── Viewfinder Video Canvas (Square on mobile for 1:1 QR framing) ── */}
      <CardContent className="p-0 relative bg-black aspect-square sm:aspect-video sm:max-h-95 w-full flex items-center justify-center overflow-hidden">
        {permissionDenied ? (
          <div className="p-6 text-center space-y-3 max-w-sm mx-auto">
            <div className="size-12 mx-auto border border-red-500/40 bg-red-950/30 flex items-center justify-center text-red-400">
              <VideoOffIcon className="size-6" />
            </div>
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">
              Camera Access Denied
            </h4>
            <p className="text-xs text-[#A3A3A3] leading-relaxed">
              Browser permission was blocked. Please enable camera access in your browser settings to scan QR passes.
            </p>
            <Button
              type="button"
              onClick={onRetryCamera}
              className="rounded-none bg-white text-black font-mono font-bold text-xs uppercase h-10 w-full cursor-pointer"
            >
              [ Request Permission Again ]
            </Button>
          </div>
        ) : hasCamera === false ? (
          <div className="p-6 text-center space-y-2 text-[#A3A3A3]">
            <AlertTriangleIcon className="size-8 mx-auto text-amber-400" />
            <p className="text-xs text-white uppercase font-bold">No Camera Hardware Found</p>
            <p className="text-[11px]">Use Screenshot upload or Manual Pass Code entry.</p>
          </div>
        ) : (
          <>
            <video
              ref={videoRef}
              className="size-full object-cover"
              playsInline
              muted
              autoPlay
            />

            {/* Cyberpunk HUD Frame & Laser Sweep Reticle */}
            <div className="absolute inset-0 pointer-events-none flex items-center justify-center p-6 sm:p-10">
              <div className="relative size-full max-w-65 max-h-65 sm:max-w-70 sm:max-h-70 border border-white/20">
                {/* 4 Corner Target Brackets */}
                <div className="absolute -top-1 -left-1 size-5 border-t-2 border-l-2 border-white" />
                <div className="absolute -top-1 -right-1 size-5 border-t-2 border-r-2 border-white" />
                <div className="absolute -bottom-1 -left-1 size-5 border-b-2 border-l-2 border-white" />
                <div className="absolute -bottom-1 -right-1 size-5 border-b-2 border-r-2 border-white" />

                {/* Laser Sweep Line */}
                <div className="absolute left-0 right-0 h-0.5 bg-red-500 shadow-[0_0_12px_#ef4444] animate-laser-sweep" />

                {/* Center Crosshair Accents */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 size-2 border border-white/40" />

                {/* HUD Framing Label */}
                <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/85 backdrop-blur-sm border border-[#262626] px-2 py-0.5 text-[8px] sm:text-[9px] uppercase tracking-wider text-[#D4D4D4] whitespace-nowrap">
                  ALIGN PASS QR IN FRAME
                </div>
              </div>
            </div>

            {/* ── Mobile Floating HUD Pill Controls (One-Handed Thumb Reach) ── */}
            {/* Top-Right Floating Actions: Torch & Flip Camera */}
            <div className="absolute top-2.5 right-2.5 flex items-center gap-1.5 z-20 pointer-events-auto">
              {hasFlash && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={onToggleFlash}
                  title="Toggle Torch / Flashlight"
                  className={`size-8 rounded-none border backdrop-blur-md shadow-lg transition-transform active:scale-90 cursor-pointer ${
                    isFlashOn
                      ? "bg-yellow-400 text-black border-yellow-400"
                      : "bg-black/75 text-white border-white/30 hover:bg-black/90"
                  }`}
                >
                  {isFlashOn ? (
                    <ZapIcon className="size-4 fill-black" />
                  ) : (
                    <ZapOffIcon className="size-4 text-[#A3A3A3]" />
                  )}
                </Button>
              )}

              {cameras.length > 1 && (
                <Button
                  type="button"
                  variant="outline"
                  size="icon"
                  onClick={handleFlipCamera}
                  title="Flip Front / Rear Camera"
                  className="size-8 rounded-none bg-black/75 backdrop-blur-md border border-white/30 text-white hover:bg-black/90 shadow-lg transition-transform active:scale-90 cursor-pointer"
                >
                  <RefreshCwIcon className="size-3.5 text-white" />
                </Button>
              )}
            </div>

            {/* Bottom-Left Floating Audio Mute Pill */}
            <div className="absolute bottom-2.5 left-2.5 z-20 pointer-events-auto">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={onToggleMute}
                title={isMuted ? "Unmute Audio" : "Mute Audio"}
                className="size-7.5 rounded-none bg-black/75 backdrop-blur-md border border-white/30 text-white hover:bg-black/90 shadow-md transition-transform active:scale-90 cursor-pointer"
              >
                {isMuted ? (
                  <VolumeXIcon className="size-3.5 text-red-400" />
                ) : (
                  <Volume2Icon className="size-3.5 text-white" />
                )}
              </Button>
            </div>

            {/* Bottom-Right Mode HUD Badge */}
            <div className="absolute bottom-2.5 right-2.5 z-10 pointer-events-none">
              <div className="bg-black/80 backdrop-blur-sm border border-white/20 px-2 py-0.5 text-[9px] uppercase tracking-wider text-white font-mono">
                {isRapidMode ? (
                  <span className="text-emerald-400 font-bold flex items-center gap-1">
                    <span className="size-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    AUTO-ADVANCE
                  </span>
                ) : (
                  <span className="text-[#A3A3A3] flex items-center gap-1">
                    <VideoIcon className="size-2.5 text-white" />
                    INSPECT MODE
                  </span>
                )}
              </div>
            </div>
          </>
        )}
      </CardContent>

      {scannerError && !permissionDenied && (
        <div className="p-2.5 bg-amber-950/40 border-t border-amber-900/60 text-amber-300 text-xs text-center">
          {scannerError}
        </div>
      )}
    </Card>
  );
}

"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { checkInParticipant } from "@/actions/checkin";
import { CheckInResult } from "@/types/registration";
import { CheckCircle2Icon, AlertCircleIcon, QrCodeIcon } from "lucide-react";

export function QrScannerComponent() {
  const [qrToken, setQrToken] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<CheckInResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleManualCheckIn = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!qrToken.trim()) return;

    setLoading(true);
    setError(null);
    setResult(null);

    const res = await checkInParticipant("staff_session_user_id", {
      qrToken: qrToken.trim(),
      deviceInfo: "Staff Web Portal",
    });

    setLoading(false);

    if (res.success) {
      setResult(res.data);
      setQrToken("");
    } else {
      setError(res.error.message);
    }
  };

  return (
    <div className="max-w-lg mx-auto rounded-none border border-[#152A54] bg-[#060D1A] p-6 space-y-6 font-mono">
      <div className="text-center space-y-2 border-b border-[#152A54] pb-4">
        <div className="inline-flex size-12 items-center justify-center rounded-none bg-blue-600/15 text-blue-400 border border-blue-500/30">
          <QrCodeIcon className="size-6" />
        </div>
        <h2 className="text-lg font-bold text-white uppercase tracking-wider">&gt; Event Day Check-In</h2>
        <p className="text-xs text-slate-400">
          Scan participant QR code or enter the opaque token manually.
        </p>
      </div>

      <form onSubmit={handleManualCheckIn} className="space-y-4">
        <div className="space-y-2">
          <Input
            value={qrToken}
            onChange={(e) => setQrToken(e.target.value)}
            placeholder="ENTER TOKEN (e.g. CH26-A1B2C3D4)"
            className="h-11 rounded-none border border-[#152A54] bg-[#03060E] text-white font-mono text-center tracking-widest placeholder:text-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 text-sm"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="h-11 w-full rounded-none font-mono text-xs uppercase tracking-wider font-bold bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 transition-colors cursor-pointer shadow-md shadow-blue-950/50"
        >
          {loading ? "[ VERIFYING TOKEN... ]" : "[ VALIDATE & CHECK-IN ]"}
        </Button>
      </form>

      {/* Success Notification Banner (Reference Image 3 layout) */}
      {result && (
        <div className="rounded-none border border-blue-500/40 bg-blue-950/20 p-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-blue-400 font-bold text-xs uppercase">
            <CheckCircle2Icon className="size-4" />
            <span>Checked In Successfully</span>
          </div>
          <p className="text-xs text-white">
            <strong>{result.participantName}</strong> ({result.registrationNumber})
          </p>
          <p className="text-[11px] text-slate-400">Event: {result.eventName}</p>
        </div>
      )}

      {/* Error Notification Banner (Reference Image 3 layout) */}
      {error && (
        <div className="rounded-none border border-red-900/50 bg-red-950/20 p-4 text-center space-y-1 text-red-400">
          <div className="flex items-center justify-center gap-2 font-bold text-xs uppercase">
            <AlertCircleIcon className="size-4" />
            <span>Check-in Failed</span>
          </div>
          <p className="text-xs text-red-300">{error}</p>
        </div>
      )}
    </div>
  );
}

export default QrScannerComponent;

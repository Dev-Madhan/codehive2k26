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
    <div className="max-w-lg mx-auto rounded-xl border border-border bg-surface p-6 space-y-6">
      <div className="text-center space-y-2">
        <div className="inline-flex size-12 items-center justify-center rounded-full bg-primary/10 text-cyan">
          <QrCodeIcon className="size-6" />
        </div>
        <h2 className="text-xl font-bold text-foreground">Event Day Check-In</h2>
        <p className="text-sm text-muted">
          Scan participant QR code or enter the opaque token manually.
        </p>
      </div>

      <form onSubmit={handleManualCheckIn} className="space-y-4">
        <div className="space-y-2">
          <Input
            value={qrToken}
            onChange={(e) => setQrToken(e.target.value)}
            placeholder="Enter QR Token (e.g. CH26-A1B2C3D4)"
            className="font-mono text-center tracking-widest border-2 border-border focus-visible:border-primary text-base"
          />
        </div>
        <Button
          type="submit"
          disabled={loading}
          className="w-full border-2 border-primary bg-primary hover:bg-primary-hover text-white cursor-pointer font-medium"
        >
          {loading ? "Verifying Token..." : "Validate & Check-in"}
        </Button>
      </form>

      {result && (
        <div className="rounded-lg border border-success/40 bg-success/10 p-4 text-center space-y-2">
          <div className="flex items-center justify-center gap-2 text-success font-semibold">
            <CheckCircle2Icon className="size-5" />
            <span>Checked In Successfully!</span>
          </div>
          <p className="text-sm text-foreground">
            <strong>{result.participantName}</strong> ({result.registrationNumber})
          </p>
          <p className="text-xs text-muted">Event: {result.eventName}</p>
        </div>
      )}

      {error && (
        <div className="rounded-lg border border-error/40 bg-error/10 p-4 text-center space-y-1 text-error">
          <div className="flex items-center justify-center gap-2 font-semibold">
            <AlertCircleIcon className="size-5" />
            <span>Check-in Failed</span>
          </div>
          <p className="text-xs">{error}</p>
        </div>
      )}
    </div>
  );
}

export default QrScannerComponent;

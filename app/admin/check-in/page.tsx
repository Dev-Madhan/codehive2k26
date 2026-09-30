import { QrScannerComponent } from "@/components/check-in/qr-scanner";

export default function AdminCheckInPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold tracking-tight">Event Day QR Check-In</h1>
        <p className="text-sm text-muted">
          Validate attendee QR passes, record attendance, and prevent duplicate check-ins.
        </p>
      </div>

      <div className="py-6">
        <QrScannerComponent />
      </div>
    </div>
  );
}

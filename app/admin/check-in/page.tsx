import { Suspense } from "react";
import { PassVerifierComponent } from "@/components/check-in/qr-scanner";

export default function AdminCheckInPage() {
  return (
    <div className="space-y-6 font-mono">
      <div className="border-b border-[#152A54] pb-4">
        <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 text-[11px] font-bold text-blue-400 bg-blue-600/15 border border-blue-500/30 mb-2">
          &gt; admin / pass_verifier
        </div>
        <h1 className="text-2xl font-bold tracking-tight text-white uppercase">
          Event Pass Verifier
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Validate attendee passes by 6-character Pass Code or QR token, record attendance timestamps, and prevent duplicate entries.
        </p>
      </div>

      <div className="py-4">
        <Suspense fallback={<div className="text-center font-mono text-xs text-slate-500 py-10">[ LOADING VERIFIER... ]</div>}>
          <PassVerifierComponent />
        </Suspense>
      </div>
    </div>
  );
}

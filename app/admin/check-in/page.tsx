import { Suspense } from "react";
import { PassVerifierComponent } from "@/components/check-in/qr-scanner";

export default function AdminCheckInPage() {
  return (
    <div className="space-y-3 sm:space-y-6 font-mono max-w-2xl mx-auto px-1 sm:px-0">
      <div className="border-b border-[#262626] pb-2.5 sm:pb-4">
        <div className="inline-flex items-center gap-1.5 px-2 py-0.5 text-[10px] sm:text-[11px] font-bold text-black bg-white border border-white mb-1.5 sm:mb-2">
          &gt; admin / pass_verifier
        </div>
        <h1 className="text-lg sm:text-2xl font-bold tracking-tight text-white uppercase">
          Event Pass Verifier
        </h1>
        <p className="text-[11px] sm:text-xs text-[#A3A3A3] mt-0.5 sm:mt-1">
          Validate attendee passes by QR token or 6-character Pass Code with real-time verification and anti-fraud checks.
        </p>
      </div>

      <div className="py-1 sm:py-3">
        <Suspense fallback={<div className="text-center font-mono text-xs text-slate-500 py-10">[ LOADING VERIFIER... ]</div>}>
          <PassVerifierComponent />
        </Suspense>
      </div>
    </div>
  );
}

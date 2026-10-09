"use client";

import { useEffect } from "react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Fatal Root Layout Crash Caught]:", error);
  }, [error]);

  return (
    <html lang="en" className="dark bg-black text-white">
      <body className="min-h-screen bg-black text-white flex flex-col justify-center items-center px-4 font-mono">
        <div className="w-full max-w-md border border-[#262626] bg-[#0A0A0A] p-6 space-y-5 text-center shadow-2xl">
          <div className="text-red-500 font-bold text-xs uppercase tracking-widest">
            [ CRITICAL_ROOT_FAILURE ]
          </div>
          <h1 className="text-2xl font-black uppercase text-white tracking-wider">
            SYSTEM CRASH // 500
          </h1>
          <p className="text-xs text-[#A3A3A3] leading-relaxed font-sans">
            A fatal exception occurred in the primary application layout. The execution tree has been safely isolated.
          </p>
          {error.digest && (
            <div className="text-[11px] text-[#737373] bg-[#111111] p-2 border border-[#222222]">
              DIGEST: {error.digest}
            </div>
          )}
          <button
            onClick={() => reset()}
            className="w-full h-10 font-mono text-xs font-bold uppercase tracking-wider bg-white text-black hover:bg-neutral-200 transition-colors border border-white cursor-pointer"
          >
            Re-Initialize System
          </button>
        </div>
      </body>
    </html>
  );
}

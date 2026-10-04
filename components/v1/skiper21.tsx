"use client";

import { LoaderCircle } from "lucide-react";

export interface Skiper21Props {
  isLoading?: boolean;
  onGoogleSignIn: () => void;
}

export function Skiper21({
  isLoading = false,
  onGoogleSignIn,
}: Skiper21Props) {
  return (
    <div className="w-full max-w-[420px] rounded-3xl border border-white/10 bg-white/[0.04] p-6 shadow-[0_24px_70px_rgba(0,0,0,0.45)] backdrop-blur-xl sm:p-8">
      <h2 className="text-lg font-semibold tracking-tight text-white">
        Sign in to CodeHive
      </h2>
      <p className="mt-1 text-sm leading-6 text-white/50">
        Use your Google account to access your registrations and event passes.
      </p>
      <button
        type="button"
        onClick={onGoogleSignIn}
        disabled={isLoading}
        className="mt-7 inline-flex h-12 w-full items-center justify-center gap-3 rounded-xl bg-white px-4 text-sm font-semibold text-slate-900 transition-colors hover:bg-slate-100 disabled:cursor-wait disabled:opacity-70"
      >
        {isLoading ? (
          <LoaderCircle className="size-4 animate-spin" />
        ) : (
          <svg
            aria-hidden="true"
            className="size-[18px]"
            viewBox="0 0 24 24"
          >
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.04a6.96 6.96 0 0 1 0-4.08V7.12H2.18a11 11 0 0 0 0 9.76z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84C6.71 7.3 9.14 5.38 12 5.38z"
            />
          </svg>
        )}
        {isLoading ? "Connecting to Google..." : "Continue with Google"}
      </button>
      <p className="mt-5 text-center text-xs leading-5 text-white/35">
        Sign in securely with Google to continue.
      </p>
    </div>
  );
}

export default Skiper21;

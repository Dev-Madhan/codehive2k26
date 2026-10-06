"use client";

import Link from "next/link";
import { ArrowRightIcon, LayoutDashboardIcon, SparklesIcon } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export function HeroActions() {
  const { data: session, isPending } = useSession();
  const userRole = ((session?.user as { role?: string })?.role || "PARTICIPANT").toUpperCase();
  const isAdmin = userRole === "ADMIN";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-2.5 sm:gap-3 pt-2 sm:pt-4 w-full max-w-xs sm:max-w-none pointer-events-auto">
      {/* Primary Action Button */}
      <Link
        href="/events"
        className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider font-bold rounded-none bg-white hover:bg-[#E5E5E5] active:scale-[0.98] text-black border border-white transition-all shadow-[0_0_20px_rgba(255,255,255,0.2)] hover:shadow-[0_0_25px_rgba(255,255,255,0.3)] cursor-pointer"
      >
        [ Explore Events ]
        <ArrowRightIcon className="size-3.5" />
      </Link>

      {/* Auth-Aware Action Button */}
      {isPending ? (
        // Smooth placeholder while determining auth state (Zero Layout Shift)
        <div className="w-full sm:w-[136px] min-h-[46px] border border-[#262626] bg-[#0F0F0F]/60 animate-pulse" />
      ) : session?.user ? (
        // Logged-in: Participants see ONLY Explore Events; Admins have access to the Dashboard
        isAdmin ? (
          <Link
            href="/dashboard"
            className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider font-semibold rounded-none bg-[#0F0F0F] hover:bg-[#161616] active:scale-[0.98] text-[#E5E5E5] hover:text-white border border-[#404040] hover:border-white transition-all shadow-[0_0_15px_rgba(255,255,255,0.05)] cursor-pointer"
          >
            <LayoutDashboardIcon className="size-3.5 text-[#E5E5E5]" />
            [ Live Dashboard ]
          </Link>
        ) : null
      ) : (
        // Unauthenticated: Sign In is displayed
        <Link
          href="/auth"
          className="w-full sm:w-auto min-h-[46px] inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider font-semibold rounded-none bg-[#0F0F0F] hover:bg-[#161616] active:scale-[0.98] text-white border border-[#262626] hover:border-[#404040] transition-all cursor-pointer"
        >
          [ Sign In ]
        </Link>
      )}
    </div>
  );
}

export default HeroActions;

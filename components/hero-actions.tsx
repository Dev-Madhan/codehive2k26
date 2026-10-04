"use client";

import Link from "next/link";
import { ArrowRightIcon, LayoutDashboardIcon, SparklesIcon } from "lucide-react";
import { useSession } from "@/lib/auth-client";

export function HeroActions() {
  const { data: session, isPending } = useSession();
  const userRole = ((session?.user as { role?: string })?.role || "PARTICIPANT").toUpperCase();
  const isAdmin = userRole === "ADMIN";

  return (
    <div className="flex flex-col sm:flex-row items-center justify-center gap-3 pt-4 pointer-events-auto">
      {/* Primary Action Button */}
      <Link
        href="/events"
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider font-bold rounded-none bg-blue-600 hover:bg-blue-500 text-foreground border border-blue-400/80 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_25px_rgba(59,130,246,0.6)] cursor-pointer"
      >
        [ Explore Events ]
        <ArrowRightIcon className="size-3.5" />
      </Link>

      {/* Auth-Aware Action Button */}
      {isPending ? (
        // Smooth placeholder while determining auth state (Zero Layout Shift)
        <div className="w-full sm:w-[136px] h-[42px] border border-border bg-card/60 animate-pulse" />
      ) : session?.user ? (
        // Logged-in: Participants see ONLY Explore Events; Admins have access to the Dashboard
        isAdmin ? (
          <Link
            href="/dashboard"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider font-semibold rounded-none bg-card hover:bg-secondary text-blue-400 hover:text-foreground border border-blue-500/50 hover:border-blue-400 transition-all shadow-[0_0_15px_rgba(21,42,84,0.4)] cursor-pointer"
          >
            <LayoutDashboardIcon className="size-3.5 text-blue-400" />
            [ Live Dashboard ]
          </Link>
        ) : null
      ) : (
        // Unauthenticated: Sign In is displayed
        <Link
          href="/auth"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider font-semibold rounded-none bg-card hover:bg-secondary text-foreground border border-border hover:border-blue-500/50 transition-all cursor-pointer"
        >
          [ Sign In ]
        </Link>
      )}
    </div>
  );
}

export default HeroActions;

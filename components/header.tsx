"use client";

import Link from "next/link";
import { cn } from "@/lib/utils";
import { useScroll } from "@/hooks/use-scroll";
import { Button } from "@/components/ui/button";
import { MobileNav } from "@/components/mobile-nav";
import { useSession } from "@/lib/auth-client";
import { DropdownMenuAvatar } from "@/components/dropdown-menu-avatar";

export const navLinks = [
  {
    label: "Events",
    href: "/events",
  },
  {
    label: "Dashboard",
    href: "/dashboard",
  },
];

export function Header() {
  const scrolled = useScroll(10);
  const { data: session, isPending } = useSession();

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b border-[#152A54] bg-black/90 backdrop-blur-md transition-all",
        {
          "shadow-lg shadow-black/80": scrolled,
        }
      )}
    >
      <div className="max-w-7xl mx-auto flex h-14 items-center justify-between px-4 sm:px-6">
        {/* Logo / Prompt */}
        <Link
          className="flex items-center gap-1.5 font-mono font-bold text-base tracking-tight text-white hover:opacity-90 transition-opacity"
          href="/"
        >
          <span className="text-blue-500 font-extrabold">&gt;</span>
          <span>code</span>
          <span className="text-blue-400">hive</span>
          <span className="text-[11px] text-slate-500 font-mono">_2k26</span>
        </Link>

        {/* Centered navigation links */}
        <nav className="hidden items-center gap-1 md:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="px-3 py-1.5 font-mono text-xs uppercase tracking-wider text-slate-300 hover:text-white hover:bg-[#0B162C] border border-transparent hover:border-[#152A54] rounded-none transition-all"
            >
              [ {link.label} ]
            </Link>
          ))}
        </nav>

        {/* Profile / Auth button on the right */}
        <div className="flex items-center gap-3">
          {!isPending && session?.user ? (
            <DropdownMenuAvatar />
          ) : (
            <Link
              href="/auth"
              className="hidden md:inline-flex items-center justify-center px-4 py-1.5 font-mono text-xs uppercase tracking-wider font-semibold rounded-none bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 transition-colors shadow-sm"
            >
              [ Sign In ]
            </Link>
          )}
          <MobileNav />
        </div>
      </div>
    </header>
  );
}

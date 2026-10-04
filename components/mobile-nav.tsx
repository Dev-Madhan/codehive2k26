"use client";

import { cn } from "@/lib/utils";
import React from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Portal, PortalBackdrop } from "@/components/portal";
import { navLinks } from "@/components/header";
import { XIcon, MenuIcon, LogOutIcon } from "lucide-react";
import { useSession, signOut } from "@/lib/auth-client";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export function MobileNav() {
  const [open, setOpen] = React.useState(false);
  const { data: session } = useSession();

  return (
    <div className="md:hidden">
      <button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="size-9 flex items-center justify-center rounded-none border border-[#152A54] bg-[#060D1A] text-white hover:bg-[#0B162C] transition-colors"
        onClick={() => setOpen(!open)}
      >
        {open ? (
          <XIcon className="size-4" />
        ) : (
          <MenuIcon className="size-4" />
        )}
      </button>
      {open && (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop />
          <div
            className={cn(
              "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
              "size-full p-4 bg-black/95 border-b border-[#152A54]"
            )}
            data-slot={open ? "open" : "closed"}
          >
            {session?.user && (
              <div className="flex items-center gap-3 p-3 mb-4 rounded-none border border-[#152A54] bg-[#060D1A]">
                <Avatar className="size-9 rounded-none border border-blue-500/60">
                  {session.user.image && (
                    <AvatarImage
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="rounded-none object-cover"
                    />
                  )}
                  <AvatarFallback className="rounded-none bg-[#0E1B38] font-mono font-bold text-blue-400 text-xs">
                    {session.user.name?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-mono font-semibold text-white truncate">
                    {session.user.name || "Participant"}
                  </p>
                  <p className="text-[11px] font-mono text-slate-400 truncate">{session.user.email}</p>
                </div>
              </div>
            )}

            <div className="grid gap-y-1">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="px-3 py-2 font-mono text-xs uppercase tracking-wider text-slate-300 hover:text-white hover:bg-[#0B162C] border border-transparent hover:border-[#152A54] rounded-none transition-all"
                >
                  &gt; {link.label}
                </Link>
              ))}
            </div>

            <div className="mt-6 flex flex-col gap-2">
              {session?.user ? (
                <>
                  {((session.user as { role?: string })?.role || "").toUpperCase() === "ADMIN" && (
                    <Link
                      href="/dashboard"
                      onClick={() => setOpen(false)}
                      className="w-full py-2.5 text-center font-mono text-xs uppercase tracking-wider font-semibold rounded-none bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 transition-colors"
                    >
                      [ Go to Dashboard ]
                    </Link>
                  )}
                  <button
                    className="w-full flex items-center justify-center gap-2 py-2 font-mono text-xs uppercase tracking-wider text-red-400 border border-red-900/40 bg-red-950/20 hover:bg-red-950/40 rounded-none transition-colors"
                    onClick={async () => {
                      await signOut();
                      setOpen(false);
                    }}
                  >
                    <LogOutIcon className="size-3.5" />
                    [ Sign Out ]
                  </button>
                </>
              ) : (
                <Link
                  href="/auth"
                  onClick={() => setOpen(false)}
                  className="w-full py-2.5 text-center font-mono text-xs uppercase tracking-wider font-semibold rounded-none bg-blue-600 hover:bg-blue-700 text-white border border-blue-500 transition-colors"
                >
                  [ Sign In / Register ]
                </Link>
              )}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

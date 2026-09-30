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
      <Button
        aria-controls="mobile-menu"
        aria-expanded={open}
        aria-label="Toggle menu"
        className="md:hidden"
        onClick={() => setOpen(!open)}
        size="icon"
        variant="outline"
      >
        {open ? (
          <XIcon className="size-4.5" />
        ) : (
          <MenuIcon className="size-4.5" />
        )}
      </Button>
      {open && (
        <Portal className="top-14" id="mobile-menu">
          <PortalBackdrop />
          <div
            className={cn(
              "data-[slot=open]:zoom-in-97 ease-out data-[slot=open]:animate-in",
              "size-full p-4"
            )}
            data-slot={open ? "open" : "closed"}
          >
            {session?.user && (
              <div className="flex items-center gap-3 p-3 mb-4 rounded-xl border border-border bg-surface">
                <Avatar className="size-10 rounded-lg after:rounded-lg border border-primary/50">
                  {session.user.image && (
                    <AvatarImage
                      src={session.user.image}
                      alt={session.user.name || "User"}
                      className="rounded-lg object-cover"
                    />
                  )}
                  <AvatarFallback className="rounded-lg bg-surface-elevated font-bold text-cyan text-sm">
                    {session.user.name?.slice(0, 2).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-foreground truncate">
                    {session.user.name || "Participant"}
                  </p>
                  <p className="text-xs text-muted truncate">{session.user.email}</p>
                </div>
              </div>
            )}

            <div className="grid gap-y-2">
              {navLinks.map((link) => (
                <Button
                  className="justify-start"
                  key={link.label}
                  variant="ghost"
                  render={<Link href={link.href} onClick={() => setOpen(false)} />}
                  nativeButton={false}
                >
                  {link.label}
                </Button>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-2">
              {session?.user ? (
                <>
                  <Button
                    className="w-full border-2 border-primary bg-primary hover:bg-primary-hover text-white cursor-pointer"
                    render={<Link href="/dashboard" onClick={() => setOpen(false)} />}
                    nativeButton={false}
                  >
                    Go to Dashboard
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full gap-2 text-error border-error/30 hover:bg-error/10 cursor-pointer"
                    onClick={async () => {
                      await signOut();
                      setOpen(false);
                    }}
                  >
                    <LogOutIcon className="size-4" />
                    Sign Out
                  </Button>
                </>
              ) : (
                <Button
                  className="w-full border-2 border-primary bg-primary hover:bg-primary-hover text-white cursor-pointer"
                  render={<Link href="/auth" onClick={() => setOpen(false)} />}
                  nativeButton={false}
                >
                  Get Started
                </Button>
              )}
            </div>
          </div>
        </Portal>
      )}
    </div>
  );
}

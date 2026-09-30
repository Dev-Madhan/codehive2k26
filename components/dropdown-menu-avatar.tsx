"use client";

import * as React from "react";
import { useRouter } from "next/navigation";
import {
  CalendarIcon,
  LayoutDashboardIcon,
  LogOutIcon,
  QrCodeIcon,
  ShieldCheckIcon,
} from "lucide-react";

import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/reui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useSession, signOut } from "@/lib/auth-client";

function getInitials(name?: string | null): string {
  if (!name) return "U";
  const parts = name.trim().split(" ");
  if (parts.length >= 2) {
    return (parts[0][0] + parts[1][0]).toUpperCase();
  }
  return name.slice(0, 2).toUpperCase();
}

export interface DropdownMenuAvatarProps {
  /**
   * "pill": Renders the profile badge with avatar + user name and perfected spacing.
   * "icon": Renders the circular avatar icon button (default ReUI style).
   */
  variant?: "pill" | "icon";
}

export function DropdownMenuAvatar({ variant = "pill" }: DropdownMenuAvatarProps) {
  const router = useRouter();
  const { data: session } = useSession();

  const userImage = session?.user?.image || undefined;
  const userName = session?.user?.name || "Participant";
  const userEmail = session?.user?.email;
  const firstName = session?.user?.name?.split(" ")[0] || "Account";
  const initials = getInitials(session?.user?.name || session?.user?.email);

  const rawRole = (session?.user as { role?: string })?.role || "PARTICIPANT";
  const isAdmin = ["SUPER_ADMIN", "ORGANIZER", "STAFF"].includes(rawRole);
  const roleLabel = rawRole.toLowerCase().replace("_", " ");

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign out error:", err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          variant === "pill" ? (
            <button
              type="button"
              className="flex items-center gap-2.5 p-1 sm:py-1 sm:pl-1.5 sm:pr-3.5 rounded-xl border border-border/70 bg-surface/50 hover:bg-surface hover:border-cyan/50 backdrop-blur-sm transition-all duration-200 group cursor-pointer shadow-xs focus:outline-none"
              title={`Signed in as ${userName}`}
            >
              <Avatar className="size-8 rounded-lg after:rounded-lg border-2 border-cyan/80 group-hover:border-cyan transition-colors shrink-0">
                {userImage && (
                  <AvatarImage
                    src={userImage}
                    alt={userName}
                    className="rounded-lg object-cover"
                  />
                )}
                <AvatarFallback className="rounded-lg bg-surface-elevated text-xs font-bold text-cyan">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline text-sm font-semibold text-foreground tracking-tight max-w-[120px] truncate">
                {firstName}
              </span>
            </button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-full cursor-pointer hover:bg-surface border border-border/50 hover:border-cyan/50 transition-colors"
            >
              <Avatar className="size-8 rounded-full border-2 border-cyan/80 hover:border-cyan transition-colors">
                {userImage && <AvatarImage src={userImage} alt={userName} className="rounded-full object-cover" />}
                <AvatarFallback className="rounded-full bg-surface-elevated text-xs font-bold text-cyan">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          )
        }
      />
      <DropdownMenuContent align="end" className="w-64 p-1.5 bg-surface border-border shadow-2xl rounded-xl">
        {/* User Identity Header */}
        <div className="px-3 py-2.5 flex items-center justify-between gap-2 border-b border-border/60">
          <div className="flex flex-col min-w-0">
            <p className="text-sm font-semibold text-foreground truncate">{userName}</p>
            {userEmail && (
              <p className="text-xs text-muted truncate mt-0.5">{userEmail}</p>
            )}
          </div>
          <Badge
            variant={isAdmin ? "primary-light" : "outline"}
            size="xs"
            className="capitalize shrink-0 font-medium"
          >
            {roleLabel}
          </Badge>
        </div>

        {/* Participant Navigation Section */}
        <DropdownMenuGroup className="py-1">
          <DropdownMenuItem
            className="cursor-pointer gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-elevated focus:bg-surface-elevated text-foreground transition-colors"
            onClick={() => router.push("/dashboard")}
          >
            <div className="p-1 rounded-md bg-cyan/10 text-cyan">
              <LayoutDashboardIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">My Dashboard</span>
              <span className="text-[11px] text-muted">Passes & registrations</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-elevated focus:bg-surface-elevated text-foreground transition-colors"
            onClick={() => router.push("/events")}
          >
            <div className="p-1 rounded-md bg-primary/10 text-primary">
              <CalendarIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Browse Events</span>
              <span className="text-[11px] text-muted">Hackathons & workshops</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-elevated focus:bg-surface-elevated text-foreground transition-colors"
            onClick={() => router.push("/dashboard")}
          >
            <div className="p-1 rounded-md bg-mint/10 text-mint">
              <QrCodeIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-sm font-medium">Event Day Pass</span>
              <span className="text-[11px] text-muted">Digital QR check-in</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Organizer / Admin Section (if applicable) */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-border/60" />
            <div className="px-3 py-1 text-[10px] font-semibold text-muted tracking-wider uppercase">
              Organizer Portal
            </div>
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-elevated focus:bg-surface-elevated text-foreground transition-colors"
                onClick={() => router.push("/admin/dashboard")}
              >
                <div className="p-1 rounded-md bg-primary/10 text-primary">
                  <ShieldCheckIcon className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Admin Dashboard</span>
                  <span className="text-[11px] text-muted">Manage events & attendees</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer gap-2.5 px-3 py-2 rounded-lg hover:bg-surface-elevated focus:bg-surface-elevated text-foreground transition-colors"
                onClick={() => router.push("/admin/check-in")}
              >
                <div className="p-1 rounded-md bg-cyan/10 text-cyan">
                  <QrCodeIcon className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">Live Scanner</span>
                  <span className="text-[11px] text-muted">Scan attendee passes</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        {/* Sign Out */}
        <DropdownMenuSeparator className="bg-border/60" />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer gap-2.5 px-3 py-2 rounded-lg hover:bg-error/10 focus:bg-error/10 text-error focus:text-error transition-colors mt-0.5"
          onClick={handleSignOut}
        >
          <LogOutIcon className="size-4 shrink-0" />
          <span className="text-sm font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

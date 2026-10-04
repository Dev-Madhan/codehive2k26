"use client";

import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboardIcon,
  CalendarIcon,
  QrCodeIcon,
  ShieldCheckIcon,
  LogOutIcon,
} from "lucide-react";

interface DropdownMenuAvatarProps {
  /**
   * Style of the trigger button:
   * - "pill": shows avatar + user's first name + subtle border (recommended for desktop headers)
   * - "icon": avatar only, standard circular icon button (for compact spaces / mobile)
   * - "butter": rounded oyster pill style for Butter.video navbar
   */
  variant?: "pill" | "icon" | "butter";
}

export function DropdownMenuAvatar({ variant = "pill" }: DropdownMenuAvatarProps) {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session?.user) return null;

  const user = session.user;
  const userName = user.name || "User";
  const userEmail = user.email || "";
  const userImage = user.image || undefined;
  const userRole = (user as { role?: string }).role?.toLowerCase() || "user";
  const isAdmin = userRole === "admin";
  const isOrganizer = userRole === "organizer";
  const roleLabel = isAdmin ? "Admin" : isOrganizer ? "Organizer" : "Participant";

  // First name for the pill trigger
  const firstName = userName.split(" ")[0];

  // Two-letter initials for fallback
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const handleSignOut = async () => {
    try {
      await signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign out failed:", err);
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        render={
          variant === "butter" ? (
            <button
              type="button"
              className="flex items-center gap-2 py-1 px-2 rounded-full hover:bg-surface-hover transition-all duration-200 group cursor-pointer focus:outline-none"
              title={`Signed in as ${userName}`}
            >
              <Avatar className="size-7 rounded-full border border-border shrink-0">
                {userImage && (
                  <AvatarImage
                    src={userImage}
                    alt={userName}
                    className="rounded-full object-cover"
                  />
                )}
                <AvatarFallback className="rounded-full bg-muted text-[11px] font-sans font-bold text-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline font-sans text-xs font-semibold text-foreground tracking-tight max-w-[100px] truncate">
                {firstName}
              </span>
            </button>
          ) : variant === "pill" ? (
            <button
              type="button"
              className="flex items-center gap-2 p-1 sm:py-1 sm:pl-1.5 sm:pr-3 rounded-none border border-border bg-card hover:bg-secondary hover:border-blue-500/60 transition-all duration-200 group cursor-pointer shadow-xs focus:outline-none"
              title={`Signed in as ${userName}`}
            >
              <Avatar className="size-7 rounded-none border border-blue-500/80 group-hover:border-blue-400 transition-colors shrink-0">
                {userImage && (
                  <AvatarImage
                    src={userImage}
                    alt={userName}
                    className="rounded-none object-cover"
                  />
                )}
                <AvatarFallback className="rounded-none bg-secondary text-[11px] font-mono font-bold text-blue-400">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline font-mono text-xs font-semibold text-foreground tracking-tight max-w-[120px] truncate">
                {firstName}
              </span>
            </button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none cursor-pointer hover:bg-secondary border border-border hover:border-blue-500/50 transition-colors"
            >
              <Avatar className="size-7 rounded-none border border-blue-500/80 hover:border-blue-400 transition-colors">
                {userImage && <AvatarImage src={userImage} alt={userName} className="rounded-none object-cover" />}
                <AvatarFallback className="rounded-none bg-secondary text-[11px] font-mono font-bold text-blue-400">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          )
        }
      />
      <DropdownMenuContent align="end" className="w-64 p-1.5 bg-card border-border shadow-2xl rounded-none">
        {/* User Identity Header */}
        <div className="px-3 py-2.5 flex items-center justify-between gap-2 border-b border-border">
          <div className="flex flex-col min-w-0">
            <p className="text-xs font-mono font-bold text-foreground truncate">{userName}</p>
            {userEmail && (
              <p className="text-[11px] font-mono text-muted-foreground truncate mt-0.5">{userEmail}</p>
            )}
          </div>
          <Badge
            variant="outline"
            className="capitalize shrink-0 font-mono text-[10px] rounded-none border-blue-500/40 text-blue-400 bg-blue-500/10 px-1.5 py-0.5"
          >
            {roleLabel}
          </Badge>
        </div>

        {/* Participant Navigation Section */}
        <DropdownMenuGroup className="py-1">
          <DropdownMenuItem
            className="cursor-pointer gap-2.5 px-3 py-2 rounded-none hover:bg-secondary focus:bg-secondary text-foreground hover:text-foreground transition-colors"
            onClick={() => router.push("/dashboard")}
          >
            <div className="p-1 rounded-none bg-blue-600/15 text-blue-400">
              <LayoutDashboardIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono font-medium">My Dashboard</span>
              <span className="text-[10px] text-muted-foreground">Passes & registrations</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer gap-2.5 px-3 py-2 rounded-none hover:bg-secondary focus:bg-secondary text-foreground hover:text-foreground transition-colors"
            onClick={() => router.push("/events")}
          >
            <div className="p-1 rounded-none bg-blue-600/15 text-blue-400">
              <CalendarIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono font-medium">Browse Events</span>
              <span className="text-[10px] text-muted-foreground">Hackathons & workshops</span>
            </div>
          </DropdownMenuItem>

          <DropdownMenuItem
            className="cursor-pointer gap-2.5 px-3 py-2 rounded-none hover:bg-secondary focus:bg-secondary text-foreground hover:text-foreground transition-colors"
            onClick={() => router.push("/dashboard")}
          >
            <div className="p-1 rounded-none bg-blue-600/15 text-blue-400">
              <QrCodeIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono font-medium">Event Day Pass</span>
              <span className="text-[10px] text-muted-foreground">Digital QR check-in</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Organizer / Admin Section */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-secondary" />
            <div className="px-3 py-1 text-[10px] font-mono font-semibold text-muted-foreground tracking-wider uppercase">
              Organizer Portal
            </div>
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer gap-2.5 px-3 py-2 rounded-none hover:bg-secondary focus:bg-secondary text-foreground hover:text-foreground transition-colors"
                onClick={() => router.push("/admin/dashboard")}
              >
                <div className="p-1 rounded-none bg-blue-600/15 text-blue-400">
                  <ShieldCheckIcon className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-medium">Admin Dashboard</span>
                  <span className="text-[10px] text-muted-foreground">Manage events & attendees</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer gap-2.5 px-3 py-2 rounded-none hover:bg-secondary focus:bg-secondary text-foreground hover:text-foreground transition-colors"
                onClick={() => router.push("/admin/check-in")}
              >
                <div className="p-1 rounded-none bg-blue-600/15 text-blue-400">
                  <QrCodeIcon className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-medium">Live Scanner</span>
                  <span className="text-[10px] text-muted-foreground">Scan attendee passes</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        {/* Sign Out */}
        <DropdownMenuSeparator className="bg-secondary" />
        <DropdownMenuItem
          variant="destructive"
          className="cursor-pointer gap-2.5 px-3 py-2 rounded-none hover:bg-red-950/30 text-red-400 focus:text-red-400 transition-colors mt-0.5"
          onClick={handleSignOut}
        >
          <LogOutIcon className="size-4 shrink-0" />
          <span className="text-xs font-mono font-medium">Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

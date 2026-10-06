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
   */
  variant?: "pill" | "icon";
}

export function DropdownMenuAvatar({ variant = "pill" }: DropdownMenuAvatarProps) {
  const router = useRouter();
  const { data: session } = useSession();

  if (!session?.user) return null;

  const user = session.user;
  const userName = user.name || "User";
  const userEmail = user.email || "";
  const userImage = user.image || undefined;
  const userRole = ((user as { role?: string }).role || "PARTICIPANT").toUpperCase();
  const isAdmin = userRole === "ADMIN";
  const roleLabel = isAdmin ? "Admin" : "Participant";

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
          variant === "pill" ? (
            <button
              type="button"
              className="flex items-center gap-2 p-1 sm:py-1 sm:pl-1.5 sm:pr-3 rounded-none border border-[#262626] bg-[#0F0F0F] hover:bg-[#161616] hover:border-[#404040] transition-all duration-200 group cursor-pointer shadow-xs focus:outline-none"
              title={`Signed in as ${userName}`}
            >
              <Avatar className="size-7 rounded-none border border-[#404040] group-hover:border-white transition-colors shrink-0">
                {userImage && (
                  <AvatarImage
                    src={userImage}
                    alt={userName}
                    className="rounded-none object-cover"
                  />
                )}
                <AvatarFallback className="rounded-none bg-[#161616] text-[11px] font-mono font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
              <span className="hidden sm:inline font-mono text-xs font-semibold text-white tracking-tight max-w-[120px] truncate">
                {firstName}
              </span>
            </button>
          ) : (
            <Button
              variant="ghost"
              size="icon"
              className="rounded-none cursor-pointer hover:bg-[#161616] border border-[#262626] hover:border-[#404040] transition-colors"
            >
              <Avatar className="size-7 rounded-none border border-[#404040] hover:border-white transition-colors">
                {userImage && <AvatarImage src={userImage} alt={userName} className="rounded-none object-cover" />}
                <AvatarFallback className="rounded-none bg-[#161616] text-[11px] font-mono font-bold text-white">
                  {initials}
                </AvatarFallback>
              </Avatar>
            </Button>
          )
        }
      />
      <DropdownMenuContent align="end" className="w-64 p-1.5 bg-[#0F0F0F] border-[#262626] shadow-2xl rounded-none">
        {/* User Identity Header */}
        <div className="px-3 py-2.5 flex items-center justify-between gap-2 border-b border-[#262626]">
          <div className="flex flex-col min-w-0">
            <p className="text-xs font-mono font-bold text-white truncate">{userName}</p>
            {userEmail && (
              <p className="text-[11px] font-mono text-neutral-400 truncate mt-0.5">{userEmail}</p>
            )}
          </div>
          <Badge
            variant="outline"
            className="capitalize shrink-0 font-mono text-[10px] rounded-none border-[#404040] text-neutral-300 bg-[#161616] px-1.5 py-0.5"
          >
            {roleLabel}
          </Badge>
        </div>

        {/* Participant Navigation Section */}
        <DropdownMenuGroup className="py-1">
          <DropdownMenuItem
            className="cursor-pointer gap-2.5 px-3 py-2 rounded-none hover:bg-[#161616] focus:bg-[#161616] text-neutral-300 hover:text-white transition-colors"
            onClick={() => router.push("/events")}
          >
            <div className="p-1 rounded-none bg-[#161616] text-white border border-[#262626]">
              <CalendarIcon className="size-4" />
            </div>
            <div className="flex flex-col">
              <span className="text-xs font-mono font-medium">Browse Events</span>
              <span className="text-[10px] text-[#737373]">Hackathons & workshops</span>
            </div>
          </DropdownMenuItem>
        </DropdownMenuGroup>

        {/* Admin Console Section */}
        {isAdmin && (
          <>
            <DropdownMenuSeparator className="bg-[#262626]" />
            <div className="px-3 py-1 text-[10px] font-mono font-semibold text-[#737373] tracking-wider uppercase">
              Admin Portal
            </div>
            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer gap-2.5 px-3 py-2 rounded-none hover:bg-[#161616] focus:bg-[#161616] text-neutral-300 hover:text-white transition-colors"
                onClick={() => router.push("/dashboard")}
              >
                <div className="p-1 rounded-none bg-[#161616] text-white border border-[#262626]">
                  <LayoutDashboardIcon className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-medium">Live Dashboard</span>
                  <span className="text-[10px] text-[#737373]">Operations & analytics</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer gap-2.5 px-3 py-2 rounded-none hover:bg-[#161616] focus:bg-[#161616] text-neutral-300 hover:text-white transition-colors"
                onClick={() => router.push("/admin/dashboard")}
              >
                <div className="p-1 rounded-none bg-[#161616] text-white border border-[#262626]">
                  <ShieldCheckIcon className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-medium">Admin Management</span>
                  <span className="text-[10px] text-[#737373]">Manage events & attendees</span>
                </div>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer gap-2.5 px-3 py-2 rounded-none hover:bg-[#161616] focus:bg-[#161616] text-neutral-300 hover:text-white transition-colors"
                onClick={() => router.push("/admin/check-in")}
              >
                <div className="p-1 rounded-none bg-[#161616] text-white border border-[#262626]">
                  <QrCodeIcon className="size-4" />
                </div>
                <div className="flex flex-col">
                  <span className="text-xs font-mono font-medium">Live Scanner</span>
                  <span className="text-[10px] text-[#737373]">Scan attendee passes</span>
                </div>
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </>
        )}

        {/* Sign Out */}
        <DropdownMenuSeparator className="bg-[#262626]" />
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

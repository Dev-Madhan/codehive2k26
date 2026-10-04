"use client";

import * as React from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSession, signOut } from "@/lib/auth-client";
import { toast } from "sonner";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  ChevronsUpDownIcon,
  Settings2Icon,
  LogOutIcon,
  LogInIcon,
  ExternalLinkIcon,
} from "lucide-react";

export function NavUser({
  user: initialUser,
}: {
  user?: {
    name: string;
    email: string;
    avatar?: string;
  };
}) {
  const router = useRouter();
  const { isMobile } = useSidebar();
  const { data: session, isPending } = useSession();

  // Subtle loading state
  if (isPending) {
    return (
      <SidebarMenu>
        <SidebarMenuItem>
          <div className="flex items-center gap-2 p-1.5 animate-pulse">
            <div className="size-7 bg-[#152A54]" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-16 bg-[#152A54]" />
              <div className="h-2 w-24 bg-[#152A54]/60" />
            </div>
          </div>
        </SidebarMenuItem>
      </SidebarMenu>
    );
  }

  const user = session?.user || initialUser;
  const isAuthenticated = !!session?.user;

  const userName = user?.name || (isAuthenticated ? "Operator" : "Guest");
  const userEmail = user?.email || (isAuthenticated ? "" : "Sign in");
  const userImage = session?.user?.image || (initialUser as { avatar?: string })?.avatar || "";
  const userRole = ((session?.user as { role?: string })?.role || "ADMIN").toUpperCase();

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2) || "CH";

  const handleSignOut = async () => {
    try {
      await signOut({
        fetchOptions: {
          onSuccess: () => {
            toast.success("Signed out");
            router.push("/auth/signin");
            router.refresh();
          },
        },
      });
    } catch {
      toast.error("Sign out failed");
    }
  };

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger
            render={
              <SidebarMenuButton
                size="lg"
                className="rounded-none border border-transparent hover:border-[#152A54] hover:bg-[#060D1A] transition-all aria-expanded:bg-[#0B162C] p-2"
              />
            }
          >
            <Avatar className="size-7 rounded-none border border-[#152A54] bg-[#060D1A]">
              {userImage && <AvatarImage src={userImage} alt={userName} className="object-cover" />}
              <AvatarFallback className="rounded-none bg-[#0B162C] text-blue-400 font-mono font-bold text-[11px]">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left font-mono leading-none gap-1 ml-1">
              <span className="truncate text-xs font-semibold text-white">
                {userName}
              </span>
              <span className="truncate text-[10px] text-slate-400">
                {userEmail || userRole}
              </span>
            </div>

            <ChevronsUpDownIcon className="ml-auto size-3.5 text-slate-500" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-none border border-[#152A54] bg-[#030712] p-1 font-mono text-xs shadow-xl text-slate-200"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-2 font-normal">
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-white text-xs">{userName}</span>
                  <span className="text-[10px] text-slate-400 truncate">{userEmail}</span>
                  <span className="text-[9px] uppercase tracking-wider text-blue-400 font-bold mt-1">
                    ROLE: {userRole}
                  </span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-[#152A54]" />

            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer rounded-none hover:bg-[#0B162C] hover:text-white"
                render={<Link href="/admin/settings" />}
              >
                <Settings2Icon className="size-3.5 text-slate-400 mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer rounded-none hover:bg-[#0B162C] hover:text-white"
                render={<Link href="/events" />}
              >
                <ExternalLinkIcon className="size-3.5 text-slate-400 mr-2" />
                <span>Public Portal</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-[#152A54]" />

            {isAuthenticated ? (
              <DropdownMenuItem
                onClick={handleSignOut}
                className="cursor-pointer rounded-none text-red-400 hover:text-red-300 hover:bg-red-950/40"
              >
                <LogOutIcon className="size-3.5 mr-2" />
                <span>Log out</span>
              </DropdownMenuItem>
            ) : (
              <DropdownMenuItem
                className="cursor-pointer rounded-none text-blue-400 hover:text-blue-300 hover:bg-blue-950/40 font-bold"
                render={<Link href="/auth/signin" />}
              >
                <LogInIcon className="size-3.5 mr-2" />
                <span>Sign in</span>
              </DropdownMenuItem>
            )}
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

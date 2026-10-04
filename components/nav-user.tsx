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
            <div className="size-7 bg-secondary" />
            <div className="flex-1 space-y-1">
              <div className="h-3 w-16 bg-secondary" />
              <div className="h-2 w-24 bg-secondary/60" />
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
                className="rounded-none border border-transparent hover:border-border hover:bg-card transition-all aria-expanded:bg-secondary p-2"
              />
            }
          >
            <Avatar className="size-7 rounded-none border border-border bg-card">
              {userImage && <AvatarImage src={userImage} alt={userName} className="object-cover" />}
              <AvatarFallback className="rounded-none bg-secondary text-blue-400 font-mono font-bold text-[11px]">
                {initials}
              </AvatarFallback>
            </Avatar>

            <div className="grid flex-1 text-left font-mono leading-none gap-1 ml-1">
              <span className="truncate text-xs font-semibold text-foreground">
                {userName}
              </span>
              <span className="truncate text-[10px] text-muted-foreground">
                {userEmail || userRole}
              </span>
            </div>

            <ChevronsUpDownIcon className="ml-auto size-3.5 text-slate-500" />
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="min-w-56 rounded-none border border-border bg-background p-1 font-mono text-xs shadow-xl text-foreground"
            side={isMobile ? "bottom" : "right"}
            align="end"
            sideOffset={4}
          >
            <DropdownMenuGroup>
              <DropdownMenuLabel className="p-2 font-normal">
                <div className="flex flex-col gap-0.5">
                  <span className="font-semibold text-foreground text-xs">{userName}</span>
                  <span className="text-[10px] text-muted-foreground truncate">{userEmail}</span>
                  <span className="text-[9px] uppercase tracking-wider text-blue-400 font-bold mt-1">
                    ROLE: {userRole}
                  </span>
                </div>
              </DropdownMenuLabel>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-secondary" />

            <DropdownMenuGroup>
              <DropdownMenuItem
                className="cursor-pointer rounded-none hover:bg-secondary hover:text-foreground"
                render={<Link href="/admin/settings" />}
              >
                <Settings2Icon className="size-3.5 text-muted-foreground mr-2" />
                <span>Settings</span>
              </DropdownMenuItem>

              <DropdownMenuItem
                className="cursor-pointer rounded-none hover:bg-secondary hover:text-foreground"
                render={<Link href="/events" />}
              >
                <ExternalLinkIcon className="size-3.5 text-muted-foreground mr-2" />
                <span>Public Portal</span>
              </DropdownMenuItem>
            </DropdownMenuGroup>

            <DropdownMenuSeparator className="bg-secondary" />

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

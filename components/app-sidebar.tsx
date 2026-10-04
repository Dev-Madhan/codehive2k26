"use client";

import * as React from "react";
import Image from "next/image";
import Link from "next/link";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { NavMain, type NavMainItem } from "@/components/nav-main";
import { NavSecondary, type NavSecondaryItem } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  LayoutDashboardIcon,
  ClipboardListIcon,
  CalendarDaysIcon,
  TicketIcon,
  BarChart3Icon,
  ExternalLinkIcon,
  Settings2Icon,
  XIcon,
} from "lucide-react";

// Minimal, essential console navigation
const navItems: NavMainItem[] = [
  {
    title: "Dashboard",
    url: "/dashboard",
    icon: <LayoutDashboardIcon className="size-4" />,
  },
  {
    title: "Registrations",
    url: "/admin/registrations",
    icon: <ClipboardListIcon className="size-4" />,
  },
  {
    title: "Events",
    url: "/admin/events",
    icon: <CalendarDaysIcon className="size-4" />,
  },
  {
    title: "Pass Verifier",
    url: "/admin/check-in",
    icon: <TicketIcon className="size-4" />,
  },
  {
    title: "Reports",
    url: "/admin/reports",
    icon: <BarChart3Icon className="size-4" />,
  },
];

// Minimal secondary links
const secondaryItems: NavSecondaryItem[] = [
  {
    title: "Public Site",
    url: "/",
    icon: <ExternalLinkIcon className="size-3.5" />,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: <Settings2Icon className="size-3.5" />,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { isMobile, setOpenMobile } = useSidebar();

  return (
    <Sidebar
      collapsible="offcanvas"
      className="rounded-none border-r border-border bg-background text-foreground"
      {...props}
    >
      {/* Brand Header with Mobile Dismiss */}
      <SidebarHeader className="border-b border-border p-3 flex flex-row items-center justify-between">
        <Link
          href="/dashboard"
          onClick={() => {
            if (isMobile) setOpenMobile(false);
          }}
          className="flex items-center p-1 hover:bg-secondary transition-colors"
        >
          <Image
            src="/code%20hive%20logo.svg"
            alt="CodeHive 2K26"
            width={1825}
            height={416}
            className="h-6 w-auto max-w-[160px]"
          />
        </Link>

        {isMobile && (
          <button
            type="button"
            onClick={() => setOpenMobile(false)}
            className="p-1.5 text-muted-foreground hover:text-foreground hover:bg-secondary border border-border transition-colors cursor-pointer"
            aria-label="Close navigation menu"
          >
            <XIcon className="size-3.5" />
          </button>
        )}
      </SidebarHeader>

      {/* Nav Content */}
      <SidebarContent className="flex flex-col justify-between py-2">
        <NavMain items={navItems} />
        <NavSecondary items={secondaryItems} className="mt-auto" />
      </SidebarContent>

      {/* Real Auth Profile in Footer */}
      <SidebarFooter className="border-t border-border p-2 bg-background">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

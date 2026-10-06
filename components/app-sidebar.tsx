"use client";

import * as React from "react";
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
      className="rounded-none border-r border-[#262626] bg-[#0F0F0F] text-white"
      {...props}
    >
      {/* Brand Header with Mobile Dismiss */}
      <SidebarHeader className="border-b border-[#262626] p-3 flex flex-row items-center justify-between">
        <Link
          href="/dashboard"
          onClick={() => {
            if (isMobile) setOpenMobile(false);
          }}
          className="flex items-center gap-1 font-mono p-1 hover:bg-[#161616] transition-colors"
        >
          <span className="text-white font-extrabold text-sm">&gt;</span>
          <span className="font-bold text-white text-sm">code</span>
          <span className="font-bold text-white text-sm">hive</span>
          <span className="text-[10px] text-[#737373] ml-1">2K26</span>
        </Link>

        {isMobile && (
          <button
            type="button"
            onClick={() => setOpenMobile(false)}
            className="p-1.5 text-[#A3A3A3] hover:text-white hover:bg-[#161616] border border-[#262626] transition-colors cursor-pointer"
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
      <SidebarFooter className="border-t border-[#262626] p-2 bg-[#0F0F0F]">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

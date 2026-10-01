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
} from "@/components/ui/sidebar";
import { NavMain, type NavMainItem } from "@/components/nav-main";
import { NavSecondary, type NavSecondaryItem } from "@/components/nav-secondary";
import { NavUser } from "@/components/nav-user";
import {
  LayoutDashboardIcon,
  ClipboardListIcon,
  CalendarDaysIcon,
  QrCodeIcon,
  BarChart3Icon,
  ExternalLinkIcon,
  Settings2Icon,
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
    title: "Check-in",
    url: "/admin/check-in",
    icon: <QrCodeIcon className="size-4" />,
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
    url: "/events",
    icon: <ExternalLinkIcon className="size-3.5" />,
  },
  {
    title: "Settings",
    url: "/admin/settings",
    icon: <Settings2Icon className="size-3.5" />,
  },
];

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar
      collapsible="offcanvas"
      className="rounded-none border-r border-[#152A54] bg-[#030712] text-white"
      {...props}
    >
      {/* Brand Header */}
      <SidebarHeader className="border-b border-[#152A54] p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              className="data-[slot=sidebar-menu-button]:p-1.5! rounded-none hover:bg-[#0B162C] transition-colors"
              render={<Link href="/dashboard" />}
            >
              <div className="flex items-center gap-1 font-mono">
                <span className="text-blue-500 font-extrabold text-sm">&gt;</span>
                <span className="font-bold text-white text-sm">code</span>
                <span className="font-bold text-blue-400 text-sm">hive</span>
                <span className="text-[10px] text-slate-500 ml-1">2K26</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* Nav Content */}
      <SidebarContent className="flex flex-col justify-between py-2">
        <NavMain items={navItems} />
        <NavSecondary items={secondaryItems} className="mt-auto" />
      </SidebarContent>

      {/* Real Auth Profile in Footer */}
      <SidebarFooter className="border-t border-[#152A54] p-2 bg-[#030712]">
        <NavUser />
      </SidebarFooter>
    </Sidebar>
  );
}

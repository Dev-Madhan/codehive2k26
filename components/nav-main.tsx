"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export interface NavMainItem {
  title: string;
  url: string;
  icon?: React.ReactNode;
}

export function NavMain({
  items,
}: {
  items: NavMainItem[];
}) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup className="p-2">
      <SidebarGroupContent className="font-mono">
        <SidebarMenu className="gap-1">
          {items.map((item) => {
            const isActive =
              pathname === item.url ||
              (item.url !== "/dashboard" && pathname.startsWith(item.url));

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  render={<Link href={item.url} onClick={handleLinkClick} />}
                  className={`rounded-none text-xs uppercase tracking-wider transition-colors duration-150 min-h-[40px] px-3 ${
                    isActive
                      ? "bg-secondary text-foreground border-l-2 border-blue-500 font-bold shadow-xs"
                      : "text-muted-foreground hover:text-foreground hover:bg-card border-l-2 border-transparent active:bg-secondary"
                  }`}
                >
                  <span
                    className={`shrink-0 ${
                      isActive ? "text-blue-400" : "text-muted-foreground group-hover:text-foreground"
                    }`}
                  >
                    {item.icon}
                  </span>
                  <span className="truncate">{item.title}</span>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

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
                      ? "bg-[#161616] text-white border-l-2 border-white font-bold shadow-xs"
                      : "text-[#A3A3A3] hover:text-white hover:bg-[#161616] border-l-2 border-transparent active:bg-[#1F1F1F]"
                  }`}
                >
                  <span
                    className={`shrink-0 ${
                      isActive ? "text-white" : "text-[#737373] group-hover:text-white"
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

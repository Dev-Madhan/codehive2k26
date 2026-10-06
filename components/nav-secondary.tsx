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

export interface NavSecondaryItem {
  title: string;
  url: string;
  icon: React.ReactNode;
}

export function NavSecondary({
  items,
  ...props
}: {
  items: NavSecondaryItem[];
} & React.ComponentPropsWithoutRef<typeof SidebarGroup>) {
  const pathname = usePathname();
  const { isMobile, setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  return (
    <SidebarGroup {...props} className="font-mono p-2">
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {items.map((item) => {
            const isActive = pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  tooltip={item.title}
                  render={
                    item.url.startsWith("/") ? (
                      <Link href={item.url} onClick={handleLinkClick} />
                    ) : (
                      <a href={item.url} onClick={handleLinkClick} />
                    )
                  }
                  className={`rounded-none text-xs uppercase tracking-wider transition-colors min-h-[38px] px-3 ${
                    isActive
                      ? "bg-[#161616] text-white border-l-2 border-white font-bold"
                      : "text-[#737373] hover:text-[#E5E5E5] hover:bg-[#161616] border-l-2 border-transparent active:bg-[#1F1F1F]"
                  }`}
                >
                  <span className={`shrink-0 ${isActive ? "text-white" : "text-[#737373]"}`}>
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

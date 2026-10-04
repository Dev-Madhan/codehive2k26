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
                      ? "bg-secondary text-foreground border-l-2 border-blue-500 font-bold"
                      : "text-slate-500 hover:text-foreground-secondary hover:bg-card border-l-2 border-transparent active:bg-secondary"
                  }`}
                >
                  <span className={`shrink-0 ${isActive ? "text-blue-400" : "text-slate-500"}`}>
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

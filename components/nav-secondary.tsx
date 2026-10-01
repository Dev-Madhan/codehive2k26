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
                  render={item.url.startsWith("/") ? <Link href={item.url} /> : <a href={item.url} />}
                  className={`rounded-none text-xs uppercase tracking-wider transition-colors ${
                    isActive
                      ? "bg-[#0B162C] text-white border-l-2 border-blue-500 font-bold"
                      : "text-slate-500 hover:text-slate-300 hover:bg-[#060D1A] border-l-2 border-transparent"
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

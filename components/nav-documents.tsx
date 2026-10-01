"use client";

import * as React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { toast } from "sonner";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  MoreHorizontalIcon,
  ExternalLinkIcon,
  CopyIcon,
  SparklesIcon,
} from "lucide-react";

export interface NavPortalItem {
  name: string;
  url: string;
  icon: React.ReactNode;
  badge?: string;
}

export function NavDocuments({
  items,
  label = "Event Portals & Tools",
}: {
  items: NavPortalItem[];
  label?: string;
}) {
  const pathname = usePathname();
  const { isMobile } = useSidebar();

  const handleCopyLink = (url: string, name: string) => {
    if (typeof window !== "undefined") {
      const fullUrl = `${window.location.origin}${url}`;
      navigator.clipboard.writeText(fullUrl);
      toast.success(`Copied ${name} link to clipboard`);
    }
  };

  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden font-mono">
      <SidebarGroupLabel className="text-[10px] uppercase tracking-wider text-slate-500 font-bold px-2">
        {label}
      </SidebarGroupLabel>
      <SidebarMenu className="gap-0.5">
        {items.map((item) => {
          const isActive = pathname === item.url;

          return (
            <SidebarMenuItem key={item.name}>
              <SidebarMenuButton
                render={<Link href={item.url} />}
                className={`rounded-none text-xs font-semibold uppercase tracking-wider transition-colors ${
                  isActive
                    ? "bg-[#0B162C] text-white border-l-2 border-blue-500 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-[#060D1A] border-l-2 border-transparent"
                }`}
              >
                <span className={`shrink-0 ${isActive ? "text-blue-400" : "text-slate-400"}`}>
                  {item.icon}
                </span>
                <span className="truncate flex-1">{item.name}</span>
                {item.badge && (
                  <span className="text-[9px] font-bold uppercase px-1 py-0.2 rounded-none border border-blue-500/30 bg-blue-600/10 text-blue-400">
                    {item.badge}
                  </span>
                )}
              </SidebarMenuButton>

              <DropdownMenu>
                <DropdownMenuTrigger
                  render={
                    <SidebarMenuAction
                      showOnHover
                      className="rounded-none text-slate-500 hover:text-white hover:bg-[#0B162C] aria-expanded:bg-[#0B162C]"
                    />
                  }
                >
                  <MoreHorizontalIcon className="size-3.5" />
                  <span className="sr-only">More Options</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                  className="w-44 rounded-none border border-[#152A54] bg-[#030712] font-mono text-xs text-slate-200"
                  side={isMobile ? "bottom" : "right"}
                  align={isMobile ? "end" : "start"}
                  sideOffset={4}
                >
                  <DropdownMenuItem
                    onClick={() => {
                      if (typeof window !== "undefined") {
                        window.open(item.url, "_blank");
                      }
                    }}
                    className="cursor-pointer rounded-none hover:bg-[#0B162C] hover:text-white"
                  >
                    <ExternalLinkIcon className="size-3.5 mr-2 text-blue-400" />
                    <span>Open in New Tab</span>
                  </DropdownMenuItem>

                  <DropdownMenuItem
                    onClick={() => handleCopyLink(item.url, item.name)}
                    className="cursor-pointer rounded-none hover:bg-[#0B162C] hover:text-white"
                  >
                    <CopyIcon className="size-3.5 mr-2 text-blue-400" />
                    <span>Copy Route URL</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </SidebarMenuItem>
          );
        })}
      </SidebarMenu>
    </SidebarGroup>
  );
}

import * as React from "react";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <SidebarProvider
      style={
        {
          "--sidebar-width": "calc(var(--spacing) * 72)",
          "--header-height": "calc(var(--spacing) * 12)",
        } as React.CSSProperties
      }
    >
      <AppSidebar variant="inset" />
      <SidebarInset className="bg-[#030712] min-h-screen flex flex-col max-w-full overflow-x-hidden">
        <SiteHeader />
        <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 overflow-y-auto bg-black text-white max-w-full">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

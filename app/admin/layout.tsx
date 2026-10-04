import * as React from "react";
import { redirect } from "next/navigation";
import { getCurrentUserAccess } from "@/lib/auth-server";
import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const { session, role } = await getCurrentUserAccess();

  if (!session?.user) {
    redirect("/auth?callbackUrl=/admin/dashboard");
  }

  if (role !== "ADMIN") {
    redirect("/events");
  }

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
      <SidebarInset className="bg-background min-h-screen flex flex-col max-w-full overflow-x-hidden">
        <SiteHeader />
        <main className="flex-1 p-3 sm:p-5 md:p-6 lg:p-8 overflow-y-auto overflow-x-hidden bg-background text-foreground max-w-full">
          {children}
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}

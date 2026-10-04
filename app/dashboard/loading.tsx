import { AppSidebar } from "@/components/app-sidebar";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";

export default function DashboardLoading() {
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
      <SidebarInset className="bg-background min-h-screen flex flex-col font-mono text-foreground">
        <SiteHeader />
        <div className="flex flex-1 flex-col p-4 md:p-6 space-y-6">
          {/* KPI Section Cards Skeleton */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="border border-border bg-card p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <Skeleton className="h-3.5 w-24" />
                  <Skeleton className="size-4" />
                </div>
                <Skeleton className="h-8 w-28" />
                <Skeleton className="h-3 w-36" />
              </div>
            ))}
          </div>

          {/* Interactive Chart Container Skeleton */}
          <div className="border border-border bg-card p-5 space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div className="space-y-1">
                <Skeleton className="h-5 w-44" />
                <Skeleton className="h-3.5 w-60" />
              </div>
              <Skeleton className="h-9 w-36" />
            </div>
            <div className="h-64 sm:h-72 w-full flex items-end gap-3 pt-6 px-4">
              {[40, 65, 30, 85, 55, 90, 45, 75, 60, 95, 70, 80].map((h, idx) => (
                <div
                  key={idx}
                  className="flex-1 bg-card border border-border/40"
                  style={{ height: `${h}%` }}
                />
              ))}
            </div>
          </div>

          {/* Data Table Skeleton */}
          <div className="border border-border bg-card overflow-hidden">
            <div className="p-4 border-b border-border flex justify-between items-center">
              <Skeleton className="h-5 w-48" />
              <Skeleton className="h-9 w-32" />
            </div>
            <div className="divide-y divide-[#152A54]">
              {[1, 2, 3, 4, 5].map((row) => (
                <div key={row} className="p-4 flex items-center justify-between gap-4">
                  <Skeleton className="h-4 w-28" />
                  <Skeleton className="h-4 w-44" />
                  <Skeleton className="h-4 w-32 hidden sm:block" />
                  <Skeleton className="h-5 w-20" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

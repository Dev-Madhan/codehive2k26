import { AppSidebar } from "@/components/app-sidebar"
import { ChartAreaInteractive } from "@/components/chart-area-interactive"
import { DataTable } from "@/components/data-table"
import { SectionCards } from "@/components/section-cards"
import { SiteHeader } from "@/components/site-header"
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar"

import data from "./data.json"

export default function Page() {
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
      <SidebarInset className="max-w-full overflow-x-hidden bg-[#030712] min-h-screen">
        <SiteHeader />
        <div className="flex flex-1 flex-col max-w-full">
          <div className="@container/main flex flex-1 flex-col gap-2 max-w-full">
            <div className="flex flex-col gap-3.5 py-3 sm:gap-6 sm:py-6 max-w-full">
              <SectionCards />
              <div className="px-3 sm:px-4 lg:px-6 max-w-full">
                <ChartAreaInteractive />
              </div>
              <DataTable data={data} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  )
}

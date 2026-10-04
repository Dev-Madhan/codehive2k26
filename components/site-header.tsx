"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Separator } from "@/components/ui/separator";
import { SidebarTrigger } from "@/components/ui/sidebar";

export function SiteHeader() {
  const pathname = usePathname();

  // Dynamic breadcrumb label
  const getBreadcrumb = (path: string) => {
    if (path.includes("/admin/registrations")) return { prefix: "> admin /", title: "Registrations" };
    if (path.includes("/admin/participants")) return { prefix: "> admin /", title: "Participants" };
    if (path.includes("/admin/events")) return { prefix: "> admin /", title: "Events" };
    if (path.includes("/admin/check-in")) return { prefix: "> admin /", title: "QR Check-In" };
    if (path.includes("/admin/reports")) return { prefix: "> admin /", title: "Reports & Analytics" };
    if (path.includes("/admin/settings")) return { prefix: "> admin /", title: "System Settings" };
    if (path.includes("/admin/dashboard")) return { prefix: "> admin /", title: "Overview" };
    return { prefix: "> workspace /", title: "Dashboard" };
  };

  const breadcrumb = getBreadcrumb(pathname);

  return (
    <header className="flex h-(--header-height) shrink-0 items-center justify-between border-b border-border bg-background px-2.5 sm:px-4 lg:px-6 transition-[width,height] ease-linear">
      <div className="flex items-center gap-1.5 sm:gap-2 min-w-0">
        <SidebarTrigger className="-ml-1 text-foreground hover:bg-secondary border border-transparent hover:border-border rounded-none p-2 size-8 flex items-center justify-center shrink-0 cursor-pointer" />
        <Separator
          orientation="vertical"
          className="mx-1 sm:mx-2 h-4 bg-secondary data-vertical:self-auto shrink-0"
        />
        <div className="flex items-center gap-1 sm:gap-1.5 min-w-0">
          <span className="hidden sm:inline-block font-mono text-xs text-slate-500 uppercase tracking-wider shrink-0">
            {breadcrumb.prefix}
          </span>
          <h1 className="font-mono text-xs font-bold text-foreground uppercase tracking-wider truncate">
            {breadcrumb.title}
          </h1>
        </div>
      </div>

      {/* Top Metadata Strip */}
      <div className="flex items-center gap-2 sm:gap-3 shrink-0">
        <div className="hidden md:inline-flex items-center gap-2 px-2.5 py-1 border border-border bg-card font-mono text-[11px]">
          <span className="size-1.5 bg-blue-500 rounded-none animate-pulse" />
          <span className="text-muted-foreground uppercase">SYS_STATUS:</span>
          <span className="text-blue-400 font-bold">ONLINE</span>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center px-2.5 sm:px-3 py-1 font-mono text-[11px] sm:text-xs uppercase tracking-wider font-semibold rounded-none bg-blue-600 hover:bg-blue-500 text-foreground border border-blue-500 transition-colors shadow-sm"
        >
          <span className="inline sm:hidden">[ Events ]</span>
          <span className="hidden sm:inline">[ Live Events ]</span>
        </Link>
      </div>
    </header>
  );
}

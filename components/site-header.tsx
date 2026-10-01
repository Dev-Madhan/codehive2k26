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
    <header className="flex h-(--header-height) shrink-0 items-center justify-between border-b border-[#152A54] bg-[#030712] px-4 lg:px-6 transition-[width,height] ease-linear">
      <div className="flex items-center gap-2">
        <SidebarTrigger className="-ml-1 text-white hover:bg-[#0B162C] border border-transparent hover:border-[#152A54] rounded-none p-1.5" />
        <Separator
          orientation="vertical"
          className="mx-2 h-4 bg-[#152A54] data-vertical:self-auto"
        />
        <div className="flex items-center gap-1.5">
          <span className="font-mono text-xs text-slate-500 uppercase tracking-wider">
            {breadcrumb.prefix}
          </span>
          <h1 className="font-mono text-xs font-bold text-white uppercase tracking-wider">
            {breadcrumb.title}
          </h1>
        </div>
      </div>

      {/* Top Metadata Strip */}
      <div className="flex items-center gap-3">
        <div className="hidden sm:inline-flex items-center gap-2 px-2.5 py-1 border border-[#152A54] bg-[#060D1A] font-mono text-[11px]">
          <span className="size-1.5 bg-blue-500 rounded-none animate-pulse" />
          <span className="text-slate-400 uppercase">SYS_STATUS:</span>
          <span className="text-blue-400 font-bold">ONLINE</span>
        </div>

        <Link
          href="/events"
          className="inline-flex items-center px-3 py-1 font-mono text-xs uppercase tracking-wider font-semibold rounded-none bg-blue-600 hover:bg-blue-500 text-white border border-blue-500 transition-colors shadow-sm"
        >
          [ Live Events ]
        </Link>
      </div>
    </header>
  );
}

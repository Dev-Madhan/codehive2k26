"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboardIcon,
  CalendarIcon,
  UsersIcon,
  QrCodeIcon,
  BarChart3Icon,
} from "lucide-react";

const NAV_ITEMS = [
  { label: "Dashboard", href: "/admin/dashboard", icon: LayoutDashboardIcon },
  { label: "Events", href: "/admin/events", icon: CalendarIcon },
  { label: "Registrations", href: "/admin/registrations", icon: UsersIcon },
  { label: "Participants", href: "/admin/participants", icon: UsersIcon },
  { label: "Check-in", href: "/admin/check-in", icon: QrCodeIcon },
  { label: "Reports", href: "/admin/reports", icon: BarChart3Icon },
];

export function AdminNav() {
  const pathname = usePathname();

  return (
    <nav className="flex flex-col gap-1 w-64 border-r border-[#152A54] bg-[#030712] p-4 min-h-[calc(100vh-3.5rem)] font-mono">
      <div className="px-3 py-2 text-[10px] font-bold text-slate-500 tracking-wider uppercase border-b border-[#152A54] mb-2">
        &gt; Admin Console
      </div>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-none text-xs font-semibold uppercase tracking-wider transition-colors ${
              isActive
                ? "bg-[#0B162C] text-white border-l-2 border-blue-500"
                : "text-slate-400 hover:text-white hover:bg-[#060D1A]"
            }`}
          >
            <Icon className={`size-4 ${isActive ? "text-blue-400" : "text-slate-500"}`} />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default AdminNav;

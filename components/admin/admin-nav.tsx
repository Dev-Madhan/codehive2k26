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
    <nav className="flex flex-col gap-1 w-64 border-r border-border bg-surface p-4 min-h-[calc(100vh-4rem)]">
      <div className="px-3 py-2 text-xs font-semibold text-muted tracking-wider uppercase">
        Admin Portal
      </div>
      {NAV_ITEMS.map((item) => {
        const Icon = item.icon;
        const isActive = pathname.startsWith(item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
              isActive
                ? "bg-primary text-white"
                : "text-muted hover:text-foreground hover:bg-surface-hover"
            }`}
          >
            <Icon className="size-4" />
            <span>{item.label}</span>
          </Link>
        );
      })}
    </nav>
  );
}

export default AdminNav;

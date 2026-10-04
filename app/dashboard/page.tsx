import { redirect } from "next/navigation";
import { getCurrentUserAccess } from "@/lib/auth-server";
import prisma from "@/lib/prisma";
import { AppSidebar } from "@/components/app-sidebar";
import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import { SiteHeader } from "@/components/site-header";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import type {
  DashboardStats,
  DashboardChartPoint,
  DashboardEventItem,
} from "@/types/dashboard";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function DashboardPage() {
  // 1. RBAC Guard: Participants are strictly disallowed from dashboard facilities; only ADMIN can access
  const { session, role } = await getCurrentUserAccess();

  if (!session?.user) {
    redirect("/auth?callbackUrl=/dashboard");
  }

  if (role !== "ADMIN") {
    redirect("/events");
  }
  // Fetch real-time data from database
  const [
    totalRegistrations,
    confirmedRegistrations,
    totalCheckIns,
    busRegistrations,
    events,
    recentRegistrations,
  ] = await Promise.all([
    prisma.registration.count(),
    prisma.registration.count({ where: { status: "CONFIRMED" } }),
    prisma.checkIn.count(),
    prisma.registration.count({ where: { transportOptIn: true } }),
    prisma.event.findMany({
      include: {
        category: true,
        _count: {
          select: {
            registrations: true,
            teams: true,
          },
        },
      },
      orderBy: { startAt: "asc" },
    }),
    prisma.registration.findMany({
      select: {
        createdAt: true,
        checkedIn: true,
        checkIn: {
          select: {
            checkedInAt: true,
          },
        },
      },
      orderBy: { createdAt: "asc" },
    }),
  ]);

  // Compute live KPI metrics
  const turnoutRate =
    totalRegistrations > 0
      ? Math.round((totalCheckIns / totalRegistrations) * 100)
      : 0;

  const activeEventsCount =
    events.filter(
      (e) => e.status === "PUBLISHED" || e.status === "REGISTRATION_OPEN"
    ).length || events.length;

  const stats: DashboardStats = {
    totalRegistrations,
    confirmedRegistrations,
    activeEventsCount,
    totalCheckIns,
    busRegistrations,
    turnoutRate,
  };

  // Build daily timeline data for the past 90 days up to today
  const pointsMap = new Map<string, { registrations: number; checkIns: number }>();
  const now = new Date();
  for (let i = 89; i >= 0; i--) {
    const d = new Date(now);
    d.setDate(d.getDate() - i);
    const key = d.toISOString().split("T")[0];
    pointsMap.set(key, { registrations: 0, checkIns: 0 });
  }

  for (const reg of recentRegistrations) {
    const regDate = new Date(reg.createdAt).toISOString().split("T")[0];
    if (pointsMap.has(regDate)) {
      pointsMap.get(regDate)!.registrations += 1;
    } else {
      pointsMap.set(regDate, { registrations: 1, checkIns: 0 });
    }

    if (reg.checkIn?.checkedInAt) {
      const checkInDate = new Date(reg.checkIn.checkedInAt)
        .toISOString()
        .split("T")[0];
      if (pointsMap.has(checkInDate)) {
        pointsMap.get(checkInDate)!.checkIns += 1;
      }
    }
  }

  const chartData: DashboardChartPoint[] = Array.from(pointsMap.entries())
    .map(([date, counts]) => ({
      date,
      registrations: counts.registrations,
      checkIns: counts.checkIns,
    }))
    .sort((a, b) => a.date.localeCompare(b.date));

  // Transform events for DataTable with zero limit/capacity references
  const tableData: DashboardEventItem[] = events.map((ev, index) => {
    let teamFormat = "Solo Entry";
    if (ev.isTeamEvent) {
      teamFormat =
        ev.minTeamSize === ev.maxTeamSize
          ? `Team (${ev.maxTeamSize})`
          : `Team (${ev.minTeamSize}-${ev.maxTeamSize})`;
    }

    return {
      id: index + 1,
      dbId: ev.id,
      header: ev.name,
      slug: ev.slug,
      type: ev.category?.name || "Technical",
      categorySlug: ev.category?.slug || "technical",
      status: ev.status === "PUBLISHED" ? "Open" : ev.status.replace("_", " "),
      venue: ev.venue || "Palani Murugan Hall of Fame, Vel Tech",
      isTeamEvent: ev.isTeamEvent,
      minTeamSize: ev.minTeamSize,
      maxTeamSize: ev.maxTeamSize,
      teamFormat,
      startAt: ev.startAt ? ev.startAt.toISOString() : "",
      endAt: ev.endAt ? ev.endAt.toISOString() : "",
      registrationsCount: ev._count?.registrations || 0,
      teamsCount: ev._count?.teams || 0,
      description: ev.description || "",
    };
  });

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
      <SidebarInset className="max-w-full overflow-x-hidden bg-background min-h-screen">
        <SiteHeader />
        <div className="flex flex-1 flex-col max-w-full">
          <div className="@container/main flex flex-1 flex-col gap-2 max-w-full">
            <div className="flex flex-col gap-3.5 py-3 sm:gap-6 sm:py-6 max-w-full">
              <SectionCards stats={stats} />
              <div className="px-3 sm:px-4 lg:px-6 max-w-full">
                <ChartAreaInteractive data={chartData} />
              </div>
              <DataTable data={tableData} />
            </div>
          </div>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

import { Skeleton } from "@/components/ui/skeleton";

export default function AdminDashboardLoading() {
  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="border-b border-border pb-4 space-y-2">
        <Skeleton className="h-4 w-40" />
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-3.5 w-80" />
      </div>

      {/* 4 Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-none border border-border bg-card p-5 space-y-3"
          >
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-28" />
              <Skeleton className="size-4" />
            </div>
            <Skeleton className="h-9 w-20" />
          </div>
        ))}
      </div>
    </div>
  );
}

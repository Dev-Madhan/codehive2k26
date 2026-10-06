import { Skeleton } from "@/components/ui/skeleton";

export default function AdminEventsLoading() {
  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="border-b border-[#262626] pb-4 space-y-2">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-3.5 w-80" />
      </div>

      {/* Events Table Container Skeleton */}
      <div className="rounded-none border border-[#262626] bg-[#0F0F0F] overflow-hidden">
        {/* Table Head */}
        <div className="bg-[#080808] border-b border-[#262626] px-4 py-3 grid grid-cols-5 gap-4">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>

        {/* Table Rows (6 Rows) */}
        <div className="divide-y divide-[#262626]">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="px-4 py-3.5 grid grid-cols-5 gap-4 items-center">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

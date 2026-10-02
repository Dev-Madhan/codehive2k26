import { Skeleton } from "@/components/ui/skeleton";

export default function AdminRegistrationsLoading() {
  return (
    <div className="space-y-6 font-mono">
      {/* Terminal Header */}
      <div className="border-b border-[#152A54] pb-4 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-56" />
        <Skeleton className="h-3.5 w-72" />
      </div>

      {/* Table Container Skeleton */}
      <div className="rounded-none border border-[#152A54] bg-[#060D1A] overflow-hidden">
        {/* Table Head */}
        <div className="bg-[#03060E] border-b border-[#152A54] px-4 py-3 grid grid-cols-6 gap-4">
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-24" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
        </div>

        {/* Table Body Skeletons (8 Rows) */}
        <div className="divide-y divide-[#152A54]">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="px-4 py-3.5 grid grid-cols-6 gap-4 items-center">
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

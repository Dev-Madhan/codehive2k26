import { Skeleton } from "@/components/ui/skeleton";

export default function AdminReportsLoading() {
  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="border-b border-[#152A54] pb-4 space-y-2">
        <Skeleton className="h-4 w-44" />
        <Skeleton className="h-8 w-60" />
        <Skeleton className="h-3.5 w-72" />
      </div>

      {/* 3 Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <div
            key={i}
            className="rounded-none border border-[#152A54] bg-[#060D1A] p-5 space-y-2"
          >
            <Skeleton className="h-3.5 w-32" />
            <Skeleton className="h-9 w-20" />
          </div>
        ))}
      </div>

      {/* Event-wise breakdown container */}
      <div className="rounded-none border border-[#152A54] bg-[#060D1A] p-6 space-y-4">
        <Skeleton className="h-5 w-56" />
        <div className="divide-y divide-[#152A54]">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="py-3 flex justify-between items-center">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

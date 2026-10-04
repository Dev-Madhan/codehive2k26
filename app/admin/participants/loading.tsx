import { Skeleton } from "@/components/ui/skeleton";

export default function AdminParticipantsLoading() {
  return (
    <div className="space-y-6 font-mono">
      {/* Header */}
      <div className="border-b border-border pb-4 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-3.5 w-80" />
      </div>

      {/* Participants Table Container */}
      <div className="rounded-none border border-border bg-card overflow-hidden">
        {/* Table Head */}
        <div className="bg-background border-b border-border px-4 py-3 grid grid-cols-5 gap-4">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-24" />
        </div>

        {/* Table Rows (6 Rows) */}
        <div className="divide-y divide-[#152A54]">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="px-4 py-3.5 grid grid-cols-5 gap-4 items-center">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-24" />
              <Skeleton className="h-4 w-36" />
              <Skeleton className="h-4 w-20" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

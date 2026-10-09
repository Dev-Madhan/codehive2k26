import { Skeleton } from "@/components/ui/skeleton";

export default function AdminParticipantsLoading() {
  return (
    <div className="space-y-4 font-mono max-w-full">
      {/* ── Terminal Header Skeleton ── */}
      <div className="border-b border-[#262626] pb-2 sm:pb-3.5 space-y-2">
        <Skeleton className="h-5 w-48" />
        <Skeleton className="h-7 w-64" />
        <Skeleton className="h-4 w-96 max-w-full" />
      </div>

      {/* ── Live Sync Control Strip Skeleton ── */}
      <div className="border border-[#262626] bg-[#080808] px-2.5 py-2 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Skeleton className="size-2 rounded-full" />
          <Skeleton className="h-3.5 w-32" />
        </div>
        <div className="flex items-center gap-2">
          <Skeleton className="h-6 w-8" />
          <Skeleton className="h-6 w-20" />
          <Skeleton className="h-6 w-16" />
        </div>
      </div>

      {/* ── 4 Section Metric Cards Skeleton ── */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="border border-[#262626] bg-[#0F0F0F] p-3 sm:p-4 space-y-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-7 w-20" />
            <Skeleton className="h-3 w-36 max-w-full" />
          </div>
        ))}
      </div>

      {/* ── Sub-Telemetry Status Strip Skeleton ── */}
      <div className="border border-[#262626] bg-[#080808] px-3 py-2 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Skeleton className="h-3.5 w-36" />
          <Skeleton className="h-3.5 w-28 hidden sm:block" />
          <Skeleton className="h-3.5 w-24 hidden sm:block" />
        </div>
        <Skeleton className="h-3 w-40 hidden md:block" />
      </div>

      {/* ── Search & Filter Controls Skeleton ── */}
      <div className="border border-[#262626] bg-[#0F0F0F] p-2.5 sm:p-3 space-y-2.5">
        <Skeleton className="h-8 w-full" />
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 overflow-x-auto">
            <Skeleton className="h-6 w-16" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-20" />
            <Skeleton className="h-6 w-16" />
          </div>
          <div className="flex items-center gap-2">
            <Skeleton className="h-7 w-28" />
            <Skeleton className="h-7 w-24" />
            <Skeleton className="h-7 w-24" />
          </div>
        </div>
      </div>

      {/* ── Results Bar Skeleton ── */}
      <div className="flex items-center justify-between px-1">
        <Skeleton className="h-3 w-36" />
        <Skeleton className="h-3 w-48 hidden min-[400px]:block" />
      </div>

      {/* ── Mobile Minimal Cards Skeleton (< md) ── */}
      <div className="block md:hidden space-y-1.5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div
            key={i}
            className="border border-[#262626] bg-[#0F0F0F] p-2.5 space-y-2"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-4 w-14" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-16" />
              </div>
              <Skeleton className="h-4 w-16" />
            </div>
            <div className="flex items-center justify-between pt-1 border-t border-[#1C1C1C]">
              <div className="space-y-1 flex-1">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-2.5 w-44" />
              </div>
              <div className="flex items-center gap-1.5">
                <Skeleton className="h-6 w-12" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Desktop Table Skeleton (>= md) ── */}
      <div className="hidden md:block border border-[#262626] bg-[#0F0F0F] overflow-hidden">
        {/* Table Head */}
        <div className="bg-[#080808] border-b border-[#262626] px-4 py-3 grid grid-cols-8 gap-3">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-16" />
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-3 w-12 justify-self-end" />
        </div>

        {/* Table Rows */}
        <div className="divide-y divide-[#262626]">
          {[1, 2, 3, 4, 5, 6, 7].map((i) => (
            <div key={i} className="px-4 py-3 grid grid-cols-8 gap-3 items-center">
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-28" />
                <Skeleton className="h-2.5 w-16" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-2.5 w-20" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-24" />
                <Skeleton className="h-2.5 w-32" />
              </div>
              <div className="space-y-1">
                <Skeleton className="h-3.5 w-32" />
                <Skeleton className="h-2.5 w-20" />
              </div>
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-5 w-16" />
              <Skeleton className="h-5 w-20" />
              <Skeleton className="h-6 w-6 justify-self-end" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

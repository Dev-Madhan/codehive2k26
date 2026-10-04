import { Skeleton } from "@/components/ui/skeleton";

export default function AdminSettingsLoading() {
  return (
    <div className="space-y-8 font-mono">
      {/* Header */}
      <div className="border-b border-border pb-4 space-y-2">
        <Skeleton className="h-4 w-48" />
        <Skeleton className="h-8 w-64" />
        <Skeleton className="h-3.5 w-full max-w-xl" />
      </div>

      {/* Grid of Settings Modules (4 Cards) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-none border border-border bg-card p-5 space-y-4"
          >
            <div className="flex items-center justify-between border-b border-border pb-3">
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-16" />
            </div>

            <div className="space-y-3">
              {[1, 2, 3].map((row) => (
                <div
                  key={row}
                  className="flex items-center justify-between py-2 border-b border-border/40"
                >
                  <div className="space-y-1">
                    <Skeleton className="h-4 w-36" />
                    <Skeleton className="h-3 w-52" />
                  </div>
                  <Skeleton className="h-5 w-16" />
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

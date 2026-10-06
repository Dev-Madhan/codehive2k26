import { Header } from "@/components/header";
import { Skeleton } from "@/components/ui/skeleton";

export default function RegistrationViewLoading() {
  return (
    <div className="min-h-screen bg-black text-white">
      <Header />
      <div className="max-w-md mx-auto px-4 py-12 font-mono">
        <div className="rounded-none border border-[#262626] bg-[#0F0F0F] p-6 shadow-2xl space-y-6 text-center">
          <div className="border-b border-[#262626] pb-4 flex flex-col items-center space-y-2">
            <Skeleton className="h-5 w-44" />
            <Skeleton className="h-7 w-48" />
          </div>

          {/* QR Box placeholder */}
          <div className="flex justify-center p-4 bg-[#080808] rounded-none border border-[#262626]">
            <Skeleton className="size-48" />
          </div>

          {/* ID Strip placeholder */}
          <div className="border border-[#262626] bg-[#080808] p-3 space-y-1 flex flex-col items-center">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-6 w-36" />
          </div>

          {/* Metadata rows */}
          <div className="space-y-2 pt-2 border-t border-[#262626] text-xs">
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-28" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-32" />
            </div>
            <div className="flex justify-between">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-3 w-24" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

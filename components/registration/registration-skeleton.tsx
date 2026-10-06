import { Skeleton } from "@/components/ui/skeleton";

export function RegistrationFormSkeleton() {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Section 01: Team Configuration */}
      <div className="border border-[#262626] bg-[#0F0F0F] p-3.5 sm:p-5 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0" />
            <Skeleton className="h-3.5 w-44" />
          </div>
          <Skeleton className="h-4 w-24 hidden sm:block" />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 sm:gap-4">
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-20" />
            <Skeleton className="h-11 sm:h-10 w-full" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-11 sm:h-10 w-full" />
          </div>
        </div>
      </div>

      {/* Section 02: Team Leader */}
      <div className="border border-[#262626] bg-[#0F0F0F] p-3.5 sm:p-5 space-y-3.5 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0" />
            <Skeleton className="h-3.5 w-40" />
          </div>
          <Skeleton className="h-3.5 w-36 hidden sm:block" />
        </div>

        {/* Leader Name */}
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-11 sm:h-10 w-full" />
        </div>

        {/* Leader Email + OTP */}
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-28" />
          <div className="flex flex-col sm:flex-row gap-2">
            <Skeleton className="h-11 sm:h-10 flex-1 w-full" />
            <Skeleton className="h-11 sm:h-10 w-full sm:w-28 shrink-0" />
          </div>
        </div>

        {/* Leader Phone */}
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-32" />
          <Skeleton className="h-11 sm:h-10 w-full" />
        </div>

        {/* Academic Info Grid: College, Dept, Year */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div className="space-y-1.5 sm:col-span-2">
            <Skeleton className="h-3 w-28" />
            <Skeleton className="h-11 sm:h-10 w-full" />
          </div>
          <div className="space-y-1.5">
            <Skeleton className="h-3 w-24" />
            <Skeleton className="h-11 sm:h-10 w-full" />
          </div>
        </div>
        <div className="space-y-1.5">
          <Skeleton className="h-3 w-28" />
          <Skeleton className="h-11 sm:h-10 w-full" />
        </div>
      </div>

      {/* Section 03: Team Members */}
      <div className="border border-[#262626] bg-[#0F0F0F] p-3.5 sm:p-5 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0" />
            <Skeleton className="h-3.5 w-48" />
          </div>
          <Skeleton className="h-4 w-28 hidden sm:block" />
        </div>

        <div className="space-y-3">
          {/* Member 02 */}
          <div className="border border-[#222222] bg-[#0A0A0A] p-3 space-y-2.5">
            <Skeleton className="h-3 w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>

          {/* Member 03 */}
          <div className="border border-[#222222] bg-[#0A0A0A] p-3 space-y-2.5">
            <Skeleton className="h-3 w-32" />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
              <Skeleton className="h-10 w-full" />
              <Skeleton className="h-10 w-full" />
            </div>
          </div>
        </div>
      </div>

      {/* Section 04: Vel Tech Bus Transportation */}
      <div className="border border-[#262626] bg-[#0F0F0F] p-3.5 sm:p-5 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0" />
            <Skeleton className="h-3.5 w-56" />
          </div>
          <Skeleton className="h-4 w-28 hidden sm:block" />
        </div>

        {/* Toggle pill */}
        <div className="p-3 border border-[#222222] bg-[#0A0A0A] flex items-center justify-between">
          <div className="space-y-1">
            <Skeleton className="h-3.5 w-48" />
            <Skeleton className="h-3 w-64" />
          </div>
          <Skeleton className="h-6 w-12" />
        </div>
      </div>

      {/* Section 05: Team College ID Cards (Single PDF) */}
      <div className="border border-[#262626] bg-[#0F0F0F] p-3.5 sm:p-5 space-y-3 sm:space-y-4">
        <div className="flex items-center justify-between border-b border-[#262626] pb-3">
          <div className="flex items-center gap-2">
            <Skeleton className="size-4 shrink-0" />
            <Skeleton className="h-3.5 w-52" />
          </div>
          <Skeleton className="h-4 w-32 hidden sm:block" />
        </div>

        <Skeleton className="h-3.5 w-full max-w-xl" />

        {/* PDF Dropzone Box */}
        <div className="border-2 border-dashed border-[#262626] bg-[#080808] p-6 sm:p-8 flex flex-col items-center justify-center space-y-3">
          <Skeleton className="size-12 shrink-0" />
          <Skeleton className="h-4 w-56" />
          <Skeleton className="h-3 w-40" />
        </div>
      </div>

      {/* Submit Action Button */}
      <div className="space-y-2 pt-2 sm:pt-4">
        <Skeleton className="h-12 w-full" />
        <div className="flex justify-center">
          <Skeleton className="h-3 w-64" />
        </div>
      </div>
    </div>
  );
}

export function RegistrationSkeleton() {
  return (
    <div className="relative border border-[#262626] bg-[#0A0A0A] p-3.5 sm:p-7 md:p-8 space-y-4 sm:space-y-6">
      {/* Corner accent brackets */}
      <div className="absolute top-0 right-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-t border-r border-[#333333] pointer-events-none !m-0" />
      <div className="absolute bottom-0 left-0 w-2.5 sm:w-3 h-2.5 sm:h-3 border-b border-l border-[#333333] pointer-events-none !m-0" />

      {/* Header Bar */}
      <div className="border-b border-[#262626] pb-3 sm:pb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2">
        <div className="space-y-1">
          <Skeleton className="h-3 w-20" />
          <Skeleton className="h-6 sm:h-7 w-48 sm:w-64" />
          <Skeleton className="hidden sm:block h-3.5 w-72 mt-1" />
        </div>
        <Skeleton className="h-6 w-32 shrink-0 self-start sm:self-auto" />
      </div>

      <RegistrationFormSkeleton />
    </div>
  );
}

export default RegistrationSkeleton;

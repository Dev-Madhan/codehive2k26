import { cn } from "@/lib/utils";

function Skeleton({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="skeleton"
      className={cn(
        "animate-pulse rounded-none bg-[#081224] border border-[#152A54]/50",
        className
      )}
      {...props}
    />
  );
}

export { Skeleton };

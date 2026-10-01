"use client";

import { Toggle as TogglePrimitive } from "@base-ui/react/toggle";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "cn";

const toggleVariants = cva(
  "group/toggle inline-flex items-center justify-center gap-1 rounded-none text-xs font-mono uppercase tracking-wider transition-colors outline-none focus-visible:border-blue-500 focus-visible:ring-1 focus-visible:ring-blue-500 disabled:pointer-events-none disabled:opacity-50 border cursor-pointer aria-pressed:bg-blue-600 aria-pressed:text-white aria-pressed:border-blue-500 data-pressed:bg-blue-600 data-pressed:text-white data-pressed:border-blue-500 data-[state=on]:bg-blue-600 data-[state=on]:text-white data-[state=on]:border-blue-500",
  {
    variants: {
      variant: {
        default:
          "border-transparent bg-transparent text-slate-400 hover:bg-[#0B162C] hover:text-white",
        outline:
          "border-[#152A54] bg-[#03060E] text-slate-400 hover:bg-[#0B162C] hover:text-white",
      },
      size: {
        default: "h-8 px-3",
        sm: "h-7 px-2.5 text-[11px]",
        lg: "h-9 px-4 text-xs",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Toggle({
  className,
  variant = "default",
  size = "default",
  ...props
}: TogglePrimitive.Props & VariantProps<typeof toggleVariants>) {
  return (
    <TogglePrimitive
      data-slot="toggle"
      className={cn(toggleVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Toggle, toggleVariants };

"use client"

import { useState, useEffect } from "react"
import { Toaster as Sonner, type ToasterProps } from "sonner"
import { CheckIcon, InfoIcon, TriangleAlertIcon, OctagonXIcon, Loader2Icon } from "lucide-react"

const Toaster = ({ position, ...props }: ToasterProps) => {
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 640)
    }
    handleResize()
    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [])

  // Desktop: bottom-right of page
  // Mobile: bottom of screen (centered full-width)
  const resolvedPosition = isMobile ? "bottom-center" : (position || "bottom-right")

  return (
    <Sonner
      theme="dark"
      position={resolvedPosition}
      className="toaster group font-mono"
      closeButton
      gap={10}
      icons={{
        success: (
          <div className="size-6 shrink-0 rounded-none border border-emerald-500/60 bg-emerald-950/40 flex items-center justify-center text-emerald-400 shadow-sm shadow-emerald-950/40">
            <CheckIcon className="size-3.5 stroke-[2.5]" />
          </div>
        ),
        info: (
          <div className="size-6 shrink-0 rounded-none border border-sky-500/60 bg-sky-950/40 flex items-center justify-center text-sky-400 shadow-sm shadow-sky-950/40">
            <InfoIcon className="size-3.5 stroke-[2.5]" />
          </div>
        ),
        warning: (
          <div className="size-6 shrink-0 rounded-none border border-amber-500/60 bg-amber-950/40 flex items-center justify-center text-amber-400 shadow-sm shadow-amber-950/40">
            <TriangleAlertIcon className="size-3.5 stroke-[2.5]" />
          </div>
        ),
        error: (
          <div className="size-6 shrink-0 rounded-none border border-rose-500/60 bg-rose-950/40 flex items-center justify-center text-rose-400 shadow-sm shadow-rose-950/40">
            <OctagonXIcon className="size-3.5 stroke-[2.5]" />
          </div>
        ),
        loading: (
          <div className="size-6 shrink-0 rounded-none border border-sky-500/60 bg-sky-950/40 flex items-center justify-center text-sky-400 shadow-sm shadow-sky-950/40">
            <Loader2Icon className="size-3.5 animate-spin text-sky-400" />
          </div>
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast relative overflow-hidden rounded-none border border-border bg-card text-foreground font-mono shadow-2xl shadow-blue-950/50 p-3.5 sm:p-4",
          title: "!text-xs !font-bold !uppercase !tracking-wider text-sky-400 font-mono !leading-tight",
          description: "!text-[11px] font-mono text-foreground-secondary !mt-0.5 !leading-relaxed",
          actionButton:
            "rounded-none bg-blue-600 hover:bg-blue-700 text-foreground font-mono text-xs uppercase px-3 py-1.5 font-bold border border-blue-500 transition-colors cursor-pointer",
          cancelButton:
            "rounded-none bg-secondary hover:bg-secondary text-foreground-secondary font-mono text-xs uppercase px-3 py-1.5 border border-border transition-colors cursor-pointer",
          closeButton:
            "!top-2.5 !right-2.5 !left-auto !bottom-auto !translate-x-0 !translate-y-0 !w-5.5 !h-5.5 flex items-center justify-center !rounded-none !bg-background hover:!bg-secondary !text-muted-foreground hover:!text-foreground !border !border-border hover:!border-sky-400 transition-colors cursor-pointer",
          success:
            "!border-emerald-500/50 !bg-background [&_[data-title]]:!text-emerald-400",
          error:
            "!border-rose-500/50 !bg-card [&_[data-title]]:!text-rose-400",
          warning:
            "!border-amber-500/50 !bg-card [&_[data-title]]:!text-amber-400",
          info:
            "!border-blue-500/50 !bg-background [&_[data-title]]:!text-sky-400",
          loading:
            "!border-sky-500/50 !bg-background [&_[data-title]]:!text-sky-400",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

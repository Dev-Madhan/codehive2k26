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
          <div className="size-6 shrink-0 rounded-none border border-[#404040] bg-[#161616] flex items-center justify-center text-white shadow-sm">
            <CheckIcon className="size-3.5 stroke-[2.5]" />
          </div>
        ),
        info: (
          <div className="size-6 shrink-0 rounded-none border border-[#404040] bg-[#161616] flex items-center justify-center text-white shadow-sm">
            <InfoIcon className="size-3.5 stroke-[2.5]" />
          </div>
        ),
        warning: (
          <div className="size-6 shrink-0 rounded-none border border-[#404040] bg-[#161616] flex items-center justify-center text-[#E5E5E5] shadow-sm">
            <TriangleAlertIcon className="size-3.5 stroke-[2.5]" />
          </div>
        ),
        error: (
          <div className="size-6 shrink-0 rounded-none border border-[#404040] bg-[#161616] flex items-center justify-center text-white shadow-sm">
            <OctagonXIcon className="size-3.5 stroke-[2.5]" />
          </div>
        ),
        loading: (
          <div className="size-6 shrink-0 rounded-none border border-[#404040] bg-[#161616] flex items-center justify-center text-white shadow-sm">
            <Loader2Icon className="size-3.5 animate-spin text-white" />
          </div>
        ),
      }}
      toastOptions={{
        classNames: {
          toast:
            "group toast relative overflow-hidden rounded-none border border-[#262626] bg-[#0F0F0F] text-white font-mono shadow-2xl p-3.5 sm:p-4",
          title: "!text-xs !font-bold !uppercase !tracking-wider text-white font-mono !leading-tight",
          description: "!text-[11px] font-mono text-[#A3A3A3] !mt-0.5 !leading-relaxed",
          actionButton:
            "rounded-none bg-white hover:bg-[#E5E5E5] text-black font-mono text-xs uppercase px-3 py-1.5 font-bold border border-white transition-colors cursor-pointer",
          cancelButton:
            "rounded-none bg-[#161616] hover:bg-[#1F1F1F] text-[#E5E5E5] font-mono text-xs uppercase px-3 py-1.5 border border-[#262626] transition-colors cursor-pointer",
          closeButton:
            "!top-2.5 !right-2.5 !left-auto !bottom-auto !translate-x-0 !translate-y-0 !w-5.5 !h-5.5 flex items-center justify-center !rounded-none !bg-[#080808] hover:!bg-[#161616] !text-[#A3A3A3] hover:!text-white !border !border-[#404040] hover:!border-white transition-colors cursor-pointer",
          success:
            "!border-[#262626] !bg-[#0F0F0F] [&_[data-title]]:!text-white",
          error:
            "!border-[#262626] !bg-[#0F0F0F] [&_[data-title]]:!text-white",
          warning:
            "!border-[#262626] !bg-[#0F0F0F] [&_[data-title]]:!text-[#E5E5E5]",
          info:
            "!border-[#262626] !bg-[#0F0F0F] [&_[data-title]]:!text-white",
          loading:
            "!border-[#262626] !bg-[#0F0F0F] [&_[data-title]]:!text-white",
        },
      }}
      {...props}
    />
  )
}

export { Toaster }

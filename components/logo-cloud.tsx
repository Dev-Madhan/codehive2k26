import React from "react";
import { cn } from "@/lib/utils";

const PARTNERS = [
  { name: "Sri Vensy Technologies", tag: "Tech Partner" },
  { name: "Business Intelligence Club", tag: "Organizer" },
  { name: "Vel Tech Multi Tech", tag: "Host Institution" },
  { name: "CSBS Department", tag: "Academic Lead" },
  { name: "NBA & NAAC 'A'", tag: "Accreditation" },
];

export function LogoCloud({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4 items-center justify-center py-6 px-4",
        className
      )}
    >
      {PARTNERS.map((partner) => (
        <div
          key={partner.name}
          className="flex flex-col items-center justify-center p-3 rounded-xl border border-border/40 bg-card/40 backdrop-blur-xs hover:border-blue-500/40 transition-colors text-center group"
        >
          <span className="font-mono text-xs font-semibold text-foreground/80 group-hover:text-blue-400 transition-colors">
            {partner.name}
          </span>
          <span className="text-[10px] font-mono text-muted-foreground mt-0.5 uppercase tracking-wider">
            {partner.tag}
          </span>
        </div>
      ))}
    </div>
  );
}

"use client";

import { useRef } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";

const associations = {
  industry: [
    { name: "Sri Vensy Technologies Pvt Ltd", role: "Industry Partner" },
    { name: "Business Intelligence Club", role: "Technical Club Partner" },
  ],
  institution: [
    { name: "Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College", role: "Host Institution (Autonomous)" },
    { name: "Department of Computer Science & Business Systems", role: "Organizing Department" },
  ],
  accreditations: [
    { name: "NBA Accredited", code: "NBA" },
    { name: "NAAC 'A' Grade", code: "NAAC A" },
    { name: "AICTE Approved", code: "AICTE" },
    { name: "Anna University Affiliated", code: "AU" },
  ],
};

export function SponsorsSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.05, once: true });

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 bg-black border-t border-[#152A54]/60 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(21,42,84,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(21,42,84,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={cn(
            "mb-16 text-center transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-blue-500" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-blue-500">
              ASSOCIATION &amp; PARTNERS
            </span>
            <div className="h-px w-8 bg-blue-500" />
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl font-black uppercase tracking-tight text-white">
            IN ASSOCIATION{" "}
            <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
              WITH
            </span>
          </h2>
          <p className="mt-3 text-slate-400 text-sm max-w-xl mx-auto font-sans">
            Powering industry-standard problem statements, technical evaluation, and student excellence.
          </p>
        </div>

        {/* Association Cards */}
        <div
          className={cn(
            "grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 max-w-4xl mx-auto mb-10 transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "150ms" }}
        >
          {associations.industry.map((partner) => (
            <div
              key={partner.name}
              className="relative p-6 border border-blue-500/40 bg-[#060D1A]/80 backdrop-blur-sm hover:border-blue-400 transition-all group"
            >
              <div className="absolute top-0 right-0 w-2.5 h-2.5 border-t border-r border-blue-400" />
              <div className="absolute bottom-0 left-0 w-2.5 h-2.5 border-b border-l border-blue-400" />
              <p className="font-mono text-[10px] uppercase tracking-widest text-sky-400 mb-2">
                ◆ {partner.role} ◆
              </p>
              <h3 className="font-mono text-lg sm:text-xl font-bold uppercase text-white tracking-tight group-hover:text-blue-300 transition-colors">
                {partner.name}
              </h3>
            </div>
          ))}
        </div>

        {/* Institutional & Department Banner */}
        <div
          className={cn(
            "border border-[#152A54]/80 bg-[#03060E]/90 max-w-4xl mx-auto p-6 sm:p-8 mb-10 text-center transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "250ms" }}
        >
          <p className="font-mono text-[11px] uppercase tracking-widest text-blue-400 mb-2">
            ORGANIZED BY
          </p>
          <h4 className="font-mono text-base sm:text-lg font-bold text-white uppercase tracking-tight mb-1">
            Department of Computer Science and Business Systems
          </h4>
          <p className="text-xs sm:text-sm text-slate-400 font-sans max-w-2xl mx-auto">
            Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College
          </p>
          <p className="font-mono text-[11px] text-slate-500 uppercase tracking-wider mt-1">
            An Autonomous Institution • Approved by AICTE, New Delhi &amp; Affiliated to Anna University, Chennai
          </p>
        </div>

        {/* Accreditation Badges */}
        <div
          className={cn(
            "flex flex-wrap items-center justify-center gap-3 max-w-3xl mx-auto transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
          style={{ transitionDelay: "350ms" }}
        >
          {associations.accreditations.map((acc) => (
            <div
              key={acc.name}
              className="inline-flex items-center gap-2 px-3.5 py-1.5 border border-[#152A54] bg-[#060D1A] font-mono text-xs text-slate-300 hover:border-blue-500/50 transition-colors"
            >
              <span className="w-1.5 h-1.5 rounded-none bg-blue-500" />
              <span className="font-bold text-white">{acc.code}</span>
              <span className="text-slate-500 text-[11px]">({acc.name})</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

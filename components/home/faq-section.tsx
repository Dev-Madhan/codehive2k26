"use client";

import { useRef, useState } from "react";
import { useInView } from "@/hooks/use-in-view";
import { cn } from "@/lib/utils";
import { PlusIcon, MinusIcon } from "lucide-react";

const faqs = [
  {
    q: "Who can participate in CodeHive 2K26?",
    a: "Any engineering student or recent graduate from any institution across India. Whether you're a freshman or a final-year student — all builders are welcome.",
  },
  {
    q: "What is the team size?",
    a: "Teams of 1 to 3 members. Solo participation is fully allowed and competitive.",
  },
  {
    q: "Is there a registration fee?",
    a: "No. CodeHive 2K26 is completely free to enter. Just register, qualify, and show up.",
  },
  {
    q: "What events can I participate in?",
    a: "You can register for TECHFORGE (Enterprise Software & Architecture Challenge) or AGENTVIBE (Autonomous AI Agent Challenge). Teams can register directly through our events registry.",
  },
  {
    q: "Will food and accommodation be provided?",
    a: "Yes — meals, snacks, and beverages will be provided throughout the 24-hour on-site hackathon. Accommodation support details will be shared closer to the event date.",
  },
  {
    q: "What tech stack should I use?",
    a: "Any tech stack of your choice. We evaluate on problem-solving quality, innovation, and execution — not the tools you use.",
  },
  {
    q: "How are projects evaluated?",
    a: "Projects go through 4 rounds: Ideation Review, Technical Depth, Live Demo, and Final Pitching. Judges are industry professionals from leading tech companies.",
  },
  {
    q: "When do problem statements release?",
    a: "Official event guidelines and problem statements are published on our events registry. Detailed round directives and surprise scenarios are released at the start of each round.",
  },
];

export function FaqSection() {
  const ref = useRef<HTMLDivElement>(null);
  const inView = useInView(ref, { threshold: 0.05, once: true });
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <section
      ref={ref}
      className="relative py-24 sm:py-32 bg-[#030712] border-t border-[#152A54]/60 overflow-hidden"
    >
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(21,42,84,0.05)_1px,transparent_1px),linear-gradient(90deg,rgba(21,42,84,0.05)_1px,transparent_1px)] bg-[size:60px_60px]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div
          className={cn(
            "mb-16 transition-all duration-700",
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
          )}
        >
          <div className="flex items-center gap-3 mb-4">
            <div className="h-px w-8 bg-blue-500" />
            <span className="font-mono text-[11px] uppercase tracking-widest text-blue-500">
              FAQ
            </span>
          </div>
          <h2 className="font-mono text-3xl sm:text-4xl md:text-5xl font-black uppercase tracking-tight text-white leading-tight">
            FREQUENTLY{" "}
            <span className="bg-gradient-to-r from-blue-400 to-sky-300 bg-clip-text text-transparent">
              ASKED
            </span>
          </h2>
        </div>

        {/* FAQ items */}
        <div className="space-y-2">
          {faqs.map((faq, i) => {
            const isOpen = openIndex === i;
            return (
              <div
                key={i}
                className={cn(
                  "border transition-all duration-700",
                  isOpen
                    ? "border-blue-500/50 bg-[#060D1A]"
                    : "border-[#152A54]/60 bg-[#060D1A]/40 hover:border-[#152A54]",
                  inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
                )}
                style={{ transitionDelay: `${i * 50}ms` }}
              >
                <button
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left cursor-pointer group"
                  onClick={() => setOpenIndex(isOpen ? null : i)}
                >
                  <div className="flex items-start gap-3">
                    <span className="font-mono text-[10px] text-slate-600 uppercase tracking-widest shrink-0 mt-0.5">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-mono text-sm font-semibold uppercase tracking-wide text-white group-hover:text-blue-300 transition-colors">
                      {faq.q}
                    </span>
                  </div>
                  <div className="shrink-0 p-1 border border-[#152A54] group-hover:border-blue-500/40 transition-colors">
                    {isOpen ? (
                      <MinusIcon className="size-3 text-blue-400" />
                    ) : (
                      <PlusIcon className="size-3 text-slate-400 group-hover:text-blue-400 transition-colors" />
                    )}
                  </div>
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-300",
                    isOpen ? "max-h-48 pb-5" : "max-h-0"
                  )}
                >
                  <p className="px-5 pl-[3.25rem] text-sm text-slate-400 leading-relaxed">
                    {faq.a}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

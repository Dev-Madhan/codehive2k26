"use client";

import Link from "next/link";
import { ArrowRightIcon, GlobeIcon, XIcon, Share2Icon, ExternalLinkIcon } from "lucide-react";

const footerLinks = [
  {
    label: "NAVIGATE",
    links: [
      { label: "Home", href: "/" },
      { label: "Events", href: "/events" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    label: "EVENTS",
    links: [
      { label: "TECHFORGE", href: "/events/techforge-2026" },
      { label: "AGENTVIBE", href: "/events/agentvibe-2026" },
      { label: "All Events", href: "/events" },
    ],
  },
  {
    label: "INFO",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Schedule", href: "#timeline" },
      { label: "Contact", href: "mailto:contact@codehive.in" },
    ],
  },
];

const socials = [
  { Icon: GlobeIcon, href: "#", label: "Website" },
  { Icon: XIcon, href: "#", label: "X / Twitter" },
  { Icon: Share2Icon, href: "#", label: "Instagram" },
  { Icon: ExternalLinkIcon, href: "#", label: "LinkedIn" },
];

export function Footer() {
  return (
    <footer className="relative bg-black border-t border-[#152A54]/80 overflow-hidden">
      {/* Grid bg */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(21,42,84,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(21,42,84,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* CTA Banner */}
      <div className="relative border-b border-[#152A54]/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-blue-500 mb-1">
              REGISTRATIONS OPEN
            </p>
            <h3 className="font-mono text-2xl sm:text-3xl font-black uppercase text-white tracking-tight">
              READY TO FORGE YOUR CODE?
            </h3>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider font-bold bg-blue-600 hover:bg-blue-500 text-white border border-blue-400/80 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_28px_rgba(59,130,246,0.6)] shrink-0"
          >
            Register Now <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* Footer content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 lg:gap-12">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="inline-flex items-center gap-1.5 font-mono font-bold text-base tracking-tight text-white hover:opacity-90 transition-opacity mb-3">
              <span className="text-blue-500 font-extrabold">&gt;</span>
              <span>code</span>
              <span className="text-blue-400">hive</span>
              <span className="text-[11px] text-slate-500 font-mono">_2k26</span>
            </Link>
            <p className="text-xs text-slate-500 leading-relaxed mb-4 max-w-[200px]">
              South India&apos;s premier 24-hour national engineering hackathon.
            </p>
            <div className="flex items-center gap-2">
              {socials.map(({ Icon, href, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="p-1.5 border border-[#152A54] hover:border-blue-500/50 text-slate-500 hover:text-white transition-all"
                >
                  <Icon className="size-3.5" />
                </a>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {footerLinks.map((col) => (
            <div key={col.label}>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600 mb-3">
                {col.label}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-mono text-xs text-slate-500 hover:text-white transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-6 border-t border-[#152A54]/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-700">
            © 2026 CODEHIVE. ALL RIGHTS RESERVED.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-700">
            Allrights reserved to Maddy
          </p>
        </div>
      </div>
    </footer>
  );
}

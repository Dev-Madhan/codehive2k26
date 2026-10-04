"use client";

import Link from "next/link";
import { ArrowRightIcon, GlobeIcon, XIcon, Share2Icon, ExternalLinkIcon } from "lucide-react";

const footerLinks = [
  {
    label: "NAVIGATE",
    links: [
      { label: "Home", href: "/" },
      { label: "Events Registry", href: "/events" },
      { label: "Dashboard", href: "/dashboard" },
    ],
  },
  {
    label: "EVENTS",
    links: [
      { label: "TECH FORGE", href: "/events/techforge-2026" },
      { label: "AGENT VIBE", href: "/events/agentvibe-2026" },
      { label: "All Challenges", href: "/events" },
    ],
  },
  {
    label: "INFO & VENUE",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Event Schedule", href: "#timeline" },
      { label: "Palani Murugan Hall of Fame", href: "#" },
    ],
  },
];

const coordinators = [
  { name: "Jagadeesh N", phone: "+91 81100 57344", tel: "+918110057344" },
  { name: "Shanmugapriyan S", phone: "+91 90430 24062", tel: "+919043024062" },
];

export function Footer() {
  return (
    <footer className="relative bg-background border-t border-border/80 overflow-hidden">
      {/* Grid bg */}
      <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(rgba(21,42,84,0.04)_1px,transparent_1px),linear-gradient(90deg,rgba(21,42,84,0.04)_1px,transparent_1px)] bg-[size:60px_60px]" />

      {/* CTA Banner */}
      <div className="relative border-b border-border/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 flex flex-col sm:flex-row items-center justify-between gap-6">
          <div>
            <p className="font-mono text-[11px] uppercase tracking-widest text-blue-500 mb-1">
              NATIONAL LEVEL HACKATHON // 23 &amp; 24 OCT 2026
            </p>
            <h3 className="font-mono text-2xl sm:text-3xl font-black uppercase text-foreground tracking-tight">
              READY TO FORGE YOUR CODE?
            </h3>
            <p className="text-xs text-muted-foreground mt-1 font-sans">
              100% Free Entry • ₹20,000 Prize Pool • Certificates for all participants
            </p>
          </div>
          <Link
            href="/events"
            className="inline-flex items-center gap-2 px-6 py-3 font-mono text-xs uppercase tracking-wider font-bold bg-blue-600 hover:bg-blue-500 text-foreground border border-blue-400/80 transition-all shadow-[0_0_20px_rgba(37,99,235,0.4)] hover:shadow-[0_0_28px_rgba(59,130,246,0.6)] shrink-0"
          >
            Register Now <ArrowRightIcon className="size-3.5" />
          </Link>
        </div>
      </div>

      {/* Footer content */}
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 lg:gap-10">
          {/* Brand & Department */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center gap-1.5 font-mono font-bold text-base tracking-tight text-foreground hover:opacity-90 transition-opacity mb-3">
              <span className="text-blue-500 font-extrabold">&gt;</span>
              <span>code</span>
              <span className="text-blue-400">hive</span>
              <span className="text-[11px] text-sky-400 font-mono">_2k26 2.0</span>
            </Link>
            <p className="text-xs text-muted-foreground leading-relaxed mb-3 max-w-sm font-sans">
              Department of Computer Science and Business Systems, Vel Tech Multi Tech Dr. Rangarajan Dr. Sakunthala Engineering College (Autonomous, NBA &amp; NAAC &apos;A&apos; Grade).
            </p>
            <p className="font-mono text-[11px] text-slate-500 uppercase tracking-wider mb-4">
              In association with Sri Vensy Technologies Pvt Ltd &amp; Business Intelligence Club
            </p>

            <a
              href="https://instagram.com/codehive_2k26"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 border border-border hover:border-pink-500/50 bg-card text-muted-foreground hover:text-foreground font-mono text-xs transition-colors"
            >
              <Share2Icon className="size-3.5 text-pink-400" />
              <span>@codehive_2k26</span>
              <ExternalLinkIcon className="size-3 text-slate-500" />
            </a>
          </div>

          {/* Contact Coordinators Column */}
          <div>
            <p className="font-mono text-[10px] uppercase tracking-widest text-blue-400 mb-3 font-bold">
              CONTACT COORDINATORS
            </p>
            <div className="space-y-3">
              {coordinators.map((c) => (
                <div key={c.name} className="border-l-2 border-blue-500/60 pl-2.5 py-0.5">
                  <p className="font-mono text-xs font-bold text-foreground uppercase">{c.name}</p>
                  <a
                    href={`tel:${c.tel}`}
                    className="font-mono text-xs text-blue-400 hover:text-foreground transition-colors"
                  >
                    {c.phone}
                  </a>
                </div>
              ))}
            </div>
          </div>

          {/* Nav columns */}
          {footerLinks.slice(0, 2).map((col) => (
            <div key={col.label}>
              <p className="font-mono text-[10px] uppercase tracking-widest text-slate-500 mb-3 font-bold">
                {col.label}
              </p>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="font-mono text-xs text-muted-foreground hover:text-foreground transition-colors"
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
        <div className="mt-12 pt-6 border-t border-border/40 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
            © 2026 CODEHIVE 2K26 2.0 • VEL TECH MULTI TECH (CSBS). ALL RIGHTS RESERVED.
          </p>
          <p className="font-mono text-[10px] uppercase tracking-widest text-slate-600">
            IDEAS × CODE × IMPACT
          </p>
        </div>
      </div>
    </footer>
  );
}

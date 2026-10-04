"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  LayoutDashboard,
  LogIn,
  LogOut,
  Menu,
  ShieldCheck,
  X,
} from "lucide-react";
import { DropdownMenuAvatar } from "@/components/dropdown-menu-avatar";
import { useSession, signOut } from "@/lib/auth-client";

export const navLinks = [
  { label: "HOME", href: "/" },
  { label: "ABOUT", href: "/#about" },
  { label: "EVENTS", href: "/events" },
  { label: "SCHEDULE", href: "/#how-it-works" },
  { label: "PRIZES", href: "/#prizes" },
  { label: "CONTACT", href: "/#faq" },
];

interface HeaderProps {
  spacer?: boolean;
}

export function Header({ spacer = true }: HeaderProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>("HOME");
  const [isSigningOut, setIsSigningOut] = useState(false);
  const { data: session, isPending } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const router = useRouter();

  const isAdmin =
    ((session?.user as { role?: string })?.role || "").toUpperCase() === "ADMIN";

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      setIsOpen(false);
      await signOut();
      router.push("/");
      router.refresh();
    } catch (err) {
      console.error("Sign-out failed", err);
    } finally {
      setIsSigningOut(false);
    }
  };

  // Track active link based on pathname & hash / scroll position
  useEffect(() => {
    setIsOpen(false);

    if (pathname === "/events" || pathname.startsWith("/events/")) {
      setActiveSection("EVENTS");
      return;
    }

    if (pathname === "/") {
      const handleHashChange = () => {
        const hash = window.location.hash;
        if (hash === "#about") setActiveSection("ABOUT");
        else if (hash === "#how-it-works" || hash === "#timeline") setActiveSection("SCHEDULE");
        else if (hash === "#prizes") setActiveSection("PRIZES");
        else if (hash === "#faq" || hash === "#contact") setActiveSection("CONTACT");
        else setActiveSection("HOME");
      };

      handleHashChange();
      window.addEventListener("hashchange", handleHashChange);

      // Intersection observer for section tracking on landing page
      const sections = [
        { id: "about", label: "ABOUT" },
        { id: "events-section", label: "EVENTS" },
        { id: "how-it-works", label: "SCHEDULE" },
        { id: "prizes", label: "PRIZES" },
        { id: "faq", label: "CONTACT" },
      ];

      const observers: IntersectionObserver[] = [];

      sections.forEach(({ id, label }) => {
        const el = document.getElementById(id);
        if (el) {
          const observer = new IntersectionObserver(
            ([entry]) => {
              if (entry.isIntersecting) {
                setActiveSection(label);
              }
            },
            { threshold: 0.3 }
          );
          observer.observe(el);
          observers.push(observer);
        }
      });

      return () => {
        window.removeEventListener("hashchange", handleHashChange);
        observers.forEach((obs) => obs.disconnect());
      };
    } else {
      setActiveSection("");
    }
  }, [pathname]);

  // Click outside to close mobile menu
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  // Escape key to close mobile menu
  useEffect(() => {
    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
    }

    if (isOpen) window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen]);

  return (
    <>
      <header
        className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-4 pointer-events-none"
        role="banner"
      >
        <div className="pointer-events-auto relative mx-auto flex w-full max-w-6xl items-center justify-between rounded-full bg-white shadow-[0_12px_36px_rgba(0,0,0,0.14)] border border-neutral-100/90 px-4 py-2 sm:px-5 sm:py-2.5 lg:w-fit lg:max-w-[calc(100vw-3rem)] lg:justify-center lg:gap-8 lg:px-6 transition-all">
          {/* ==============================================================
              LEFT: DIAMOND BRAND MONOGRAM & 2-LINE TITLE
              ============================================================== */}
          <Link
            href="/"
            className="group flex items-center gap-3 transition-transform hover:scale-[1.02] active:scale-[0.98] select-none"
            aria-label="CodeHive 2K26 Home"
            onClick={() => setActiveSection("HOME")}
          >
            <Image
              src="/code%20hive%20logo.svg"
              alt="CodeHive 2K26"
              width={1825}
              height={416}
              priority
              className="h-8 w-auto brightness-0 sm:h-9"
            />
          </Link>

          {/* ==============================================================
              CENTER: NAVIGATION LINKS WITH ACTIVE DOT INDICATOR
              ============================================================== */}
          <nav
            aria-label="Main navigation"
            className="hidden items-center gap-4 lg:flex xl:gap-6"
          >
            {navLinks.map((item) => {
              const isActive = activeSection === item.label;

              return (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setActiveSection(item.label)}
                  className={`relative py-1.5 text-[12px] xl:text-[13px] font-bold tracking-wider uppercase transition-colors font-sans ${
                    isActive
                      ? "text-[#0055b3]"
                      : "text-neutral-500 hover:text-[#0055b3]"
                  }`}
                >
                  {item.label}

                  {/* Active dot indicator directly under text */}
                  {isActive && (
                    <motion.span
                      layoutId="activeNavDot"
                      className="absolute -bottom-1.5 left-1/2 -translate-x-1/2 size-1.5 rounded-full bg-[#0055b3]"
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* ==============================================================
              RIGHT: DESKTOP ACTIONS & MOBILE HAMBURGER TOGGLE
              ============================================================== */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {/* Desktop Only: Logged in avatar */}
            {!isPending && session?.user && (
              <div className="hidden lg:block">
                <DropdownMenuAvatar variant="butter" />
              </div>
            )}

            {/* Desktop Only: Vertical separator */}
            <div className="hidden h-5 w-[1px] bg-neutral-200 lg:block" />

            {/* Desktop Only: Login link */}
            {!session?.user && !isPending && (
              <Link
                href="/auth"
                className="hidden lg:inline-flex h-9 items-center gap-2 rounded-full px-3 text-[12px] font-bold uppercase tracking-wider text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-[#0055b3] sm:h-10 sm:px-4 sm:text-[13px]"
              >
                <LogIn className="size-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Desktop Only: Pill CTA Button */}
            {!isPending && (
              <Link
                href={session?.user ? (isAdmin ? "/dashboard" : "/events") : "/events"}
                className="hidden lg:inline-flex group h-9 sm:h-10 items-center gap-2 rounded-full bg-[#0055b3] hover:bg-[#00479e] active:scale-[0.98] px-4 sm:px-6 text-[12px] sm:text-[13px] font-bold uppercase tracking-wider text-white shadow-md shadow-[#0055b3]/25 transition-all font-sans"
              >
                <span>{session?.user ? (isAdmin ? "Dashboard" : "Browse Events") : "Register"}</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            )}

            {/* Mobile Only: Hamburger Menu Toggle Button */}
            <div ref={menuRef} className="relative lg:hidden">
              <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700 transition-colors hover:bg-neutral-100 focus:outline-none"
                aria-label={isOpen ? "Close navigation menu" : "Open navigation menu"}
                aria-expanded={isOpen}
              >
                {isOpen ? <X className="size-4" /> : <Menu className="size-4" />}
              </button>

              {/* Mobile Drawer Menu */}
              <AnimatePresence>
                {isOpen && (
                  <motion.nav
                    id="site-navigation-menu"
                    aria-label="Mobile navigation"
                    initial={{ opacity: 0, y: -10, scale: 0.96 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: -10, scale: 0.96 }}
                    transition={{ duration: 0.18 }}
                    className="absolute right-0 top-12 w-[min(20rem,calc(100vw-2rem))] max-h-[calc(100vh-5rem)] overflow-y-auto rounded-3xl border border-neutral-100 bg-white p-3.5 shadow-2xl"
                  >
                    {/* Brand Header */}
                    <div className="mb-2 flex items-center justify-between border-b border-neutral-100 pb-2.5 px-1">
                      <Link
                        href="/"
                        onClick={() => {
                          setActiveSection("HOME");
                          setIsOpen(false);
                        }}
                        aria-label="CodeHive 2K26 home"
                      >
                        <Image
                          src="/code%20hive%20logo.svg"
                          alt="CodeHive 2K26"
                          width={1825}
                          height={416}
                          className="h-7 w-auto brightness-0"
                        />
                      </Link>
                      <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">
                        _2K26
                      </span>
                    </div>

                    {/* Logged in User Card */}
                    {session?.user && (
                      <div className="mb-2.5 rounded-2xl bg-neutral-50 p-2.5 border border-neutral-100">
                        <div className="flex items-center gap-2.5">
                          {session.user.image ? (
                            <Image
                              src={session.user.image}
                              alt={session.user.name || "User"}
                              width={36}
                              height={36}
                              className="size-9 rounded-full object-cover border border-[#0055b3]/20"
                            />
                          ) : (
                            <div className="size-9 rounded-full bg-[#0055b3]/10 text-[#0055b3] font-bold text-xs flex items-center justify-center border border-[#0055b3]/20">
                              {(session.user.name || "User").slice(0, 2).toUpperCase()}
                            </div>
                          )}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5">
                              <p className="text-xs font-bold text-neutral-900 truncate">
                                {session.user.name || "Participant"}
                              </p>
                              <span
                                className={`text-[9px] font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-full ${
                                  isAdmin
                                    ? "bg-amber-100 text-amber-800"
                                    : "bg-blue-100 text-[#0055b3]"
                                }`}
                              >
                                {isAdmin ? "Admin" : "Attendee"}
                              </span>
                            </div>
                            <p className="text-[11px] text-neutral-500 truncate font-mono">
                              {session.user.email}
                            </p>
                          </div>
                        </div>

                        {isAdmin && (
                          <div className="mt-2 pt-2 border-t border-neutral-200/60 flex flex-col gap-0.5">
                            <Link
                              href="/dashboard"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-xs font-bold text-[#0055b3] hover:bg-blue-50 transition-colors"
                            >
                              <LayoutDashboard className="size-3.5" />
                              <span>Live Dashboard</span>
                            </Link>
                            <Link
                              href="/admin/dashboard"
                              onClick={() => setIsOpen(false)}
                              className="flex items-center gap-2 rounded-xl px-2 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-100 transition-colors"
                            >
                              <ShieldCheck className="size-3.5" />
                              <span>Admin Console</span>
                            </Link>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Nav Links */}
                    <div className="flex flex-col gap-0.5">
                      {navLinks.map((item) => {
                        const isActive = activeSection === item.label;

                        return (
                          <Link
                            key={item.label}
                            href={item.href}
                            onClick={() => {
                              setActiveSection(item.label);
                              setIsOpen(false);
                            }}
                            className={`flex items-center justify-between rounded-xl px-3 py-2 text-xs font-bold uppercase tracking-wider transition-colors ${
                              isActive
                                ? "bg-blue-50 text-[#0055b3]"
                                : "text-neutral-600 hover:bg-neutral-50 hover:text-neutral-900"
                            }`}
                          >
                            <span>{item.label}</span>
                            {isActive && (
                              <span className="size-2 rounded-full bg-[#0055b3]" />
                            )}
                          </Link>
                        );
                      })}
                    </div>

                    {/* Bottom CTA & Authentication */}
                    <div className="mt-2.5 pt-2 border-t border-neutral-100 flex flex-col gap-1.5">
                      {!session?.user ? (
                        <>
                          <Link
                            href="/auth"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-2 rounded-full border border-neutral-200 bg-neutral-50 py-2.5 text-xs font-bold uppercase tracking-wider text-neutral-700 hover:bg-neutral-100 transition-colors"
                          >
                            <LogIn className="size-3.5 text-[#0055b3]" />
                            <span>Login</span>
                          </Link>
                          <Link
                            href="/events"
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-2 rounded-full bg-[#0055b3] hover:bg-[#00479e] py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#0055b3]/25 transition-all"
                          >
                            <span>Register Now</span>
                            <ArrowRight className="size-3.5" />
                          </Link>
                        </>
                      ) : (
                        <>
                          <Link
                            href={isAdmin ? "/dashboard" : "/events"}
                            onClick={() => setIsOpen(false)}
                            className="flex items-center justify-center gap-2 rounded-full bg-[#0055b3] hover:bg-[#00479e] py-2.5 text-xs font-bold uppercase tracking-wider text-white shadow-md shadow-[#0055b3]/25 transition-all"
                          >
                            <span>{isAdmin ? "Open Dashboard" : "Browse Events"}</span>
                            <ArrowRight className="size-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={handleSignOut}
                            disabled={isSigningOut}
                            className="flex items-center justify-center gap-2 rounded-full border border-red-200 bg-red-50/60 py-2 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-100 transition-colors disabled:opacity-50"
                          >
                            <LogOut className="size-3.5" />
                            <span>{isSigningOut ? "Signing Out..." : "Sign Out"}</span>
                          </button>
                        </>
                      )}
                    </div>
                  </motion.nav>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {spacer && (
        <div
          className="h-[74px] sm:h-[80px] w-full shrink-0 pointer-events-none"
          aria-hidden="true"
        />
      )}
    </>
  );
}

export default Header;

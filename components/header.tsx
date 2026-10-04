"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowRight, LogIn, Menu, X } from "lucide-react";
import { DropdownMenuAvatar } from "@/components/dropdown-menu-avatar";
import { useSession } from "@/lib/auth-client";

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
  const { data: session, isPending } = useSession();
  const menuRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();

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
              RIGHT: DIVIDER, TELEPHONE ICON & CAPSULE CTA BUTTON
              ============================================================== */}
          <div className="flex shrink-0 items-center gap-3 sm:gap-4">
            {/* Logged in avatar */}
            {!isPending && session?.user && (
              <DropdownMenuAvatar variant="butter" />
            )}

            {/* Vertical separator */}
            <div className="hidden h-5 w-[1px] bg-neutral-200 sm:block" />

            {!session?.user && !isPending && (
              <Link
                href="/auth"
                className="inline-flex h-9 items-center gap-2 rounded-full px-3 text-[12px] font-bold uppercase tracking-wider text-neutral-600 transition-colors hover:bg-neutral-100 hover:text-[#0055b3] sm:h-10 sm:px-4 sm:text-[13px]"
              >
                <LogIn className="size-4" />
                <span>Login</span>
              </Link>
            )}

            {/* Pill CTA Button */}
            {!isPending && (
              <Link
                href={session?.user ? "/dashboard" : "/events"}
                className="group inline-flex h-9 sm:h-10 items-center gap-2 rounded-full bg-[#0055b3] hover:bg-[#00479e] active:scale-[0.98] px-4 sm:px-6 text-[12px] sm:text-[13px] font-bold uppercase tracking-wider text-white shadow-md shadow-[#0055b3]/25 transition-all font-sans"
              >
                <span>{session?.user ? "Dashboard" : "Register"}</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-1" />
              </Link>
            )}

            {/* Mobile Hamburger Menu Toggle */}
            <div ref={menuRef} className="relative lg:hidden">
              <button
                type="button"
                onClick={() => setIsOpen((open) => !open)}
                className="grid size-9 place-items-center rounded-full border border-neutral-200 bg-neutral-50 text-neutral-700 transition-colors hover:bg-neutral-100"
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
                    className="absolute right-0 top-12 w-[min(19rem,calc(100vw-2rem))] overflow-hidden rounded-3xl border border-neutral-100 bg-white p-3 shadow-2xl"
                  >
                    <Link
                      href="/"
                      onClick={() => {
                        setActiveSection("HOME");
                        setIsOpen(false);
                      }}
                      className="mb-2 flex justify-center border-b border-neutral-100 px-4 py-3"
                      aria-label="CodeHive 2K26 home"
                    >
                      <Image
                        src="/code%20hive%20logo.svg"
                        alt="CodeHive 2K26"
                        width={1825}
                        height={416}
                        className="h-8 w-auto brightness-0"
                      />
                    </Link>
                    <div className="flex flex-col gap-1">
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
                            className={`flex items-center justify-between rounded-2xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider transition-colors ${
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

                      <div className="my-1.5 h-px bg-neutral-100" />

                      {!session?.user && (
                        <Link
                          href="/auth"
                          onClick={() => setIsOpen(false)}
                          className="flex items-center gap-2.5 rounded-2xl px-4 py-2.5 text-xs font-semibold text-neutral-600 hover:bg-neutral-50 hover:text-[#0055b3]"
                        >
                          <LogIn className="size-3.5 text-[#0055b3]" />
                          <span>Login</span>
                        </Link>
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

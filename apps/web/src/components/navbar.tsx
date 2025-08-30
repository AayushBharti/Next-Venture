"use client";

import { env } from "@workspace/env/client";
import { ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useEffect, useState } from "react";
import useSWR from "swr";

import type { ColumnLink, NavColumn, NavigationData } from "@/types";
import { NavbarAuth } from "./auth/navbar-auth";
import { MenuLink } from "./elements/menu-link";
import { SanityButtons } from "./elements/sanity-buttons";
import { MobileMenu } from "./mobile-menu";
import { ModeToggle } from "./mode-toggle";
import { VentureLogo } from "./venture-logo";

const fetcher = async (url: string): Promise<NavigationData> => {
  const response = await fetch(url);
  if (!response.ok) {
    throw new Error("Failed to fetch navigation data");
  }
  return response.json();
};

function DesktopColumnDropdown({
  column,
}: {
  column: Extract<NavColumn, { type: "column" }>;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div
      className="relative"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        aria-expanded={isOpen}
        aria-haspopup="menu"
        className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-neutral-500 dark:text-white/60 transition-colors hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
        type="button"
      >
        {column.title}
        <ChevronDown
          className={`size-3 transition-transform duration-200 ${isOpen ? "rotate-180" : ""}`}
        />
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 6, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 6, scale: 0.97 }}
            transition={{ duration: 0.18, ease: [0.23, 1, 0.32, 1] }}
            className="absolute top-full left-0 z-50 min-w-80 pt-3"
            role="menu"
          >
            <div className="rounded-2xl border border-neutral-200/70 dark:border-white/10 bg-white dark:bg-neutral-900 p-2 shadow-xl shadow-neutral-900/10 dark:shadow-black/50 ring-1 ring-black/[0.03] dark:ring-white/[0.03]">
              <div className="grid gap-0.5">
                {column.links?.map((link: ColumnLink) => (
                  <MenuLink
                    description={link.description || ""}
                    href={link.href || ""}
                    icon={link.icon}
                    key={link._key}
                    name={link.name || ""}
                  />
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function DesktopColumnLink({
  column,
}: {
  column: Extract<NavColumn, { type: "link" }>;
}) {
  if (!column.href) return null;

  return (
    <Link
      className="rounded-lg px-3 py-1.5 text-sm text-neutral-500 dark:text-white/60 transition-colors hover:bg-neutral-100 dark:hover:bg-white/5 hover:text-neutral-900 dark:hover:text-white"
      href={column.href}
    >
      {column.name}
    </Link>
  );
}

function NavbarSkeleton() {
  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      <div className="mx-auto mt-4 max-w-4xl px-4">
        <div className="flex h-12 items-center justify-between rounded-2xl border border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-neutral-950/70 px-4 backdrop-blur-xl">
          <div className="flex items-center gap-2">
            <div className="size-7 animate-pulse rounded-lg bg-neutral-100 dark:bg-white/5" />
            <div className="h-4 w-24 animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
          </div>
          <div className="h-6 w-20 animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
        </div>
      </div>
    </header>
  );
}

export function Navbar({
  navbarData: initialNavbarData,
  settingsData: initialSettingsData,
}: NavigationData) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { data, error } = useSWR<NavigationData>("/api/navigation", fetcher, {
    fallbackData: {
      navbarData: initialNavbarData,
      settingsData: initialSettingsData,
    },
    revalidateOnFocus: false,
    revalidateOnMount: false,
    revalidateOnReconnect: true,
    refreshInterval: 30_000,
    errorRetryCount: 3,
    errorRetryInterval: 5000,
  });

  const navigationData = data || {
    navbarData: initialNavbarData,
    settingsData: initialSettingsData,
  };
  const { navbarData, settingsData } = navigationData;
  const { columns, buttons } = navbarData || {};

  return (
    <header className="fixed top-0 right-0 left-0 z-50">
      <div className="mx-auto mt-3 max-w-4xl px-4 md:mt-4">
        <nav
          className={`flex items-center justify-between rounded-2xl border px-3 transition-all duration-300 md:px-4 ${
            scrolled
              ? "border-neutral-200 dark:border-white/10 bg-white/80 dark:bg-neutral-950/80 shadow-lg shadow-black/10 dark:shadow-black/20 backdrop-blur-xl"
              : "border-neutral-100 dark:border-white/5 bg-white/50 dark:bg-neutral-950/50 backdrop-blur-md"
          }`}
        >
          {/* Logo */}
          <div className="flex h-12 shrink-0 items-center">
            <VentureLogo />
          </div>

          {/* Desktop Navigation — centered */}
          <div className="hidden items-center gap-0.5 md:flex">
            {columns?.map((column) => {
              if (column.type === "column") {
                return (
                  <DesktopColumnDropdown column={column} key={column._key} />
                );
              }
              if (column.type === "link") {
                return <DesktopColumnLink column={column} key={column._key} />;
              }
              return null;
            })}
          </div>

          {/* Desktop Actions */}
          <div className="hidden items-center gap-1.5 md:flex">
            <ModeToggle />
            {buttons && buttons.length > 0 && (
              <SanityButtons
                buttonClassName="rounded-lg text-xs h-8 px-3"
                buttons={buttons}
                className="flex items-center gap-2"
              />
            )}
            <NavbarAuth />
          </div>

          {/* Mobile Actions */}
          <div className="flex items-center gap-1 md:hidden">
            <ModeToggle />
            <NavbarAuth />
            <MobileMenu navbarData={navbarData} settingsData={settingsData} />
          </div>
        </nav>
      </div>

      {/* Error boundary for SWR */}
      {error && env.NODE_ENV === "development" && (
        <div className="mx-auto mt-2 max-w-4xl px-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-destructive text-xs">
            Navigation data fetch error: {error.message}
          </div>
        </div>
      )}
    </header>
  );
}

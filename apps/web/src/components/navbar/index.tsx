"use client";

import { env } from "@workspace/env/client";
import { cn } from "@workspace/ui/lib/utils";
import { useEffect, useState } from "react";

import type { NavigationData } from "@/types";
import { NavbarAuth } from "../auth/navbar-auth";
import { SanityButtons } from "../elements/sanity-buttons";
import { DesktopNav } from "./desktop-nav";
import { MobileMenu } from "./mobile-menu";
import { ModeToggle } from "./mode-toggle";
import { useNavbarData } from "./use-navbar-data";
import { VentureLogo } from "./venture-logo";

export function Navbar({
  navbarData: initialNavbarData,
  settingsData: initialSettingsData,
}: NavigationData) {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const { data, error } = useNavbarData({
    navbarData: initialNavbarData,
    settingsData: initialSettingsData,
  });
  const { navbarData, settingsData } = data;
  const { columns, buttons } = navbarData || {};

  return (
    <header>
      <nav className="fixed z-50 w-full px-2">
        <div
          className={cn(
            "mx-auto mt-2 max-w-6xl px-6 transition-all duration-300 lg:px-12",
            scrolled &&
              "max-w-4xl rounded-2xl border bg-background/80 shadow-lg shadow-black/5 backdrop-blur-lg dark:bg-background/50 lg:px-5",
          )}
        >
          <div className="relative flex items-center justify-between py-3 lg:py-4">
            <VentureLogo />

            {/* Desktop Navigation — absolutely centered */}
            <div className="absolute inset-0 m-auto hidden size-fit items-center md:flex">
              <DesktopNav columns={columns ?? undefined} />
            </div>

            {/* Desktop Actions */}
            <div className="hidden items-center gap-1.5 md:flex">
              <ModeToggle />
              {buttons && buttons.length > 0 && (
                <SanityButtons
                  buttonClassName={cn(
                    "h-8 rounded-lg px-3 text-xs",
                    scrolled && "lg:hidden",
                  )}
                  buttons={buttons}
                  className="flex items-center gap-1.5"
                />
              )}
              {scrolled && buttons && buttons.length > 0 && (
                <SanityButtons
                  buttonClassName="hidden h-8 rounded-lg px-3 text-xs lg:inline-flex"
                  buttons={buttons.slice(0, 1)}
                  className="flex items-center gap-1.5"
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
          </div>
        </div>
      </nav>

      {error && env.NODE_ENV === "development" && (
        <div className="mx-auto mt-14 max-w-4xl px-4">
          <div className="rounded-lg border border-destructive/20 bg-destructive/10 px-4 py-2 text-destructive text-xs">
            Navigation data fetch error: {error.message}
          </div>
        </div>
      )}
    </header>
  );
}

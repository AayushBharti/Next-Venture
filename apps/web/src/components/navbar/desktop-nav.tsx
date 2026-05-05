"use client";

import { ArrowRight, ChevronDown } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

import type { ColumnLink, NavColumn } from "@/types";
import { SanityIcon } from "../elements/sanity-icon";
import { DesktopColumnLink } from "./desktop-link";

const EASE = [0.22, 1, 0.36, 1] as const;
const CLOSE_DELAY = 150;

/** Featured first link rendered as a big card. */
function FeaturedCard({ link }: { link: ColumnLink }) {
  if (!link.href) return null;

  return (
    <Link
      href={link.href}
      className="group/card relative flex flex-col justify-end overflow-hidden rounded-xl bg-gradient-to-br from-pink-500/10 via-fuchsia-500/10 to-violet-500/10 p-4 transition-colors hover:from-pink-500/15 hover:via-fuchsia-500/15 hover:to-violet-500/15 dark:from-pink-500/5 dark:via-fuchsia-500/5 dark:to-violet-500/5 dark:hover:from-pink-500/10 dark:hover:via-fuchsia-500/10 dark:hover:to-violet-500/10"
    >
      {/* Decorative gradient orb */}
      <div className="absolute -right-4 -top-4 size-24 rounded-full bg-gradient-to-br from-pink-500/20 to-violet-500/20 blur-2xl transition-opacity group-hover/card:opacity-80 dark:from-pink-500/10 dark:to-violet-500/10" />

      <div className="relative">
        {link.icon && (
          <div className="mb-3 flex size-10 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-violet-600 shadow-md shadow-pink-500/20">
            <SanityIcon className="size-5 text-white" icon={link.icon} />
          </div>
        )}
        <div className="text-sm font-semibold text-neutral-900 dark:text-white">
          {link.name}
        </div>
        {link.description && (
          <div className="mt-1 text-xs leading-relaxed text-neutral-500 dark:text-white/50">
            {link.description}
          </div>
        )}
        <span className="mt-3 inline-flex items-center gap-1 text-xs font-medium text-pink-500 transition-all group-hover/card:gap-2">
          Learn more
          <ArrowRight className="size-3" />
        </span>
      </div>
    </Link>
  );
}

/** Standard dropdown link item. */
function DropdownLink({ link }: { link: ColumnLink }) {
  if (!link.href) return null;

  return (
    <Link
      className="group/link flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 hover:bg-neutral-100 dark:hover:bg-white/5"
      href={link.href}
    >
      {link.icon && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 transition-colors group-hover/link:bg-pink-500/10 dark:bg-white/5">
          <SanityIcon
            className="size-4 text-neutral-500 transition-colors group-hover/link:text-pink-500 dark:text-white/50"
            icon={link.icon}
          />
        </div>
      )}
      <div className="grid gap-0.5">
        <div className="text-sm font-medium leading-none text-neutral-900 dark:text-white">
          {link.name}
        </div>
        {link.description && (
          <div className="line-clamp-1 text-xs text-neutral-500 dark:text-white/40">
            {link.description}
          </div>
        )}
      </div>
    </Link>
  );
}

/** Desktop navigation bar with shared flowing dropdown panel. */
export function DesktopNav({ columns }: { columns: NavColumn[] | undefined }) {
  const [activeKey, setActiveKey] = useState<string | null>(null);
  const closeTimer = useRef<ReturnType<typeof setTimeout>>(null);
  const triggerRefs = useRef<Map<string, HTMLButtonElement>>(new Map());
  const containerRef = useRef<HTMLDivElement>(null);
  const [panelLeft, setPanelLeft] = useState(0);

  const open = useCallback((key: string) => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setActiveKey(key);
  }, []);

  const scheduleClose = useCallback(() => {
    closeTimer.current = setTimeout(() => setActiveKey(null), CLOSE_DELAY);
  }, []);

  const cancelClose = useCallback(() => {
    if (closeTimer.current) clearTimeout(closeTimer.current);
  }, []);

  const dropdownColumns = columns?.filter(
    (c): c is Extract<NavColumn, { type: "column" }> => c.type === "column"
  );
  const activeColumn = dropdownColumns?.find((c) => c._key === activeKey);
  const activeTrigger = activeKey ? triggerRefs.current.get(activeKey) : null;

  useEffect(() => {
    if (activeTrigger && containerRef.current) {
      const triggerRect = activeTrigger.getBoundingClientRect();
      const containerRect = containerRef.current.getBoundingClientRect();
      setPanelLeft(triggerRect.left - containerRect.left);
    }
  }, [activeTrigger]);

  // Split links: first becomes featured card, rest are standard links
  // 2nd dropdown column renders all links as standard (no featured card)
  const activeDropdownIndex = activeColumn
    ? (dropdownColumns?.indexOf(activeColumn) ?? 0)
    : 0;
  const isSecondDropdown = activeDropdownIndex === 1;
  const links = activeColumn?.links ?? [];
  const featuredLink = isSecondDropdown ? null : links[0];
  const remainingLinks = isSecondDropdown ? links : links.slice(1);
  const hasMultipleLinks = !isSecondDropdown && links.length > 1;

  return (
    <div ref={containerRef} className="flex items-center gap-1">
      {columns?.map((column) => {
        if (column.type === "column") {
          const isActive = activeKey === column._key;
          return (
            <div
              key={column._key}
              onMouseEnter={() => open(column._key)}
              onMouseLeave={scheduleClose}
            >
              <button
                ref={(el) => {
                  if (el) triggerRefs.current.set(column._key, el);
                }}
                aria-expanded={isActive}
                aria-haspopup="menu"
                className="flex items-center gap-1 rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-accent-foreground"
                type="button"
              >
                {column.title}
                <motion.span
                  animate={{ rotate: isActive ? 180 : 0 }}
                  transition={{ duration: 0.3, ease: EASE }}
                  className="inline-flex"
                >
                  <ChevronDown className="size-3" />
                </motion.span>
              </button>
            </div>
          );
        }
        if (column.type === "link") {
          return <DesktopColumnLink column={column} key={column._key} />;
        }
        return null;
      })}

      {/* Shared flowing dropdown panel */}
      <AnimatePresence>
        {activeColumn && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 4 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 4 }}
            transition={{ duration: 0.35, ease: EASE }}
            className="absolute top-full z-50 pt-3"
            style={{ left: panelLeft }}
            role="menu"
            onMouseEnter={cancelClose}
            onMouseLeave={scheduleClose}
          >
            <motion.div
              className="overflow-hidden rounded-2xl border border-neutral-200/70 bg-popover shadow-lg ring-1 ring-black/[0.03] dark:border-white/10 dark:ring-white/[0.03]"
              layout
              transition={{ duration: 0.35, ease: EASE }}
            >
              <div className="p-2">
                {isSecondDropdown ? (
                  /* Plain link list for 2nd dropdown */
                  <div
                    className="grid content-start gap-0.5"
                    style={{ minWidth: "280px" }}
                  >
                    {remainingLinks.map((link: ColumnLink) => (
                      <DropdownLink key={link._key} link={link} />
                    ))}
                  </div>
                ) : hasMultipleLinks ? (
                  /* Two-column layout: featured card + link list */
                  <div className="flex gap-2" style={{ width: "480px" }}>
                    <div className="w-[200px] shrink-0">
                      {featuredLink && <FeaturedCard link={featuredLink} />}
                    </div>
                    <div className="flex-1 grid content-start gap-0.5">
                      {remainingLinks.map((link: ColumnLink) => (
                        <DropdownLink key={link._key} link={link} />
                      ))}
                    </div>
                  </div>
                ) : (
                  /* Single link: just the featured card */
                  <div style={{ width: "280px" }}>
                    {featuredLink && <FeaturedCard link={featuredLink} />}
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

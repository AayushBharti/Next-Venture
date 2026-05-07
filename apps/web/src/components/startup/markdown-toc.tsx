"use client";

import { cn } from "@workspace/ui/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";

type Heading = {
  text: string;
  slug: string;
  level: number;
};

type MarkdownTocProps = {
  headings: Heading[];
  className?: string;
};

const SPRING_TRANSITION = {
  type: "spring" as const,
  stiffness: 350,
  damping: 30,
  mass: 0.8,
};

/**
 * Section-aware scroll spy.
 * Each heading "owns" the region from itself to the next heading.
 * A heading is active when its section overlaps the viewport.
 */
function useActiveSections(headings: Heading[]) {
  const [activeSlugs, setActiveSlugs] = useState<Set<string>>(new Set());

  useEffect(() => {
    if (headings.length === 0) return;

    const slugs = headings.map((h) => h.slug);
    let rafId = 0;

    function update() {
      const active = new Set<string>();
      const vh = window.innerHeight;

      for (let i = 0; i < slugs.length; i++) {
        const el = document.getElementById(slugs[i]!);
        if (!el) continue;

        const sectionTop = el.getBoundingClientRect().top;

        let sectionBottom: number;
        if (i + 1 < slugs.length) {
          const nextEl = document.getElementById(slugs[i + 1]!);
          sectionBottom = nextEl
            ? nextEl.getBoundingClientRect().top
            : sectionTop + vh;
        } else {
          sectionBottom = Math.max(
            document.documentElement.scrollHeight -
              window.scrollY -
              el.offsetTop +
              sectionTop,
            sectionTop + vh,
          );
        }

        if (sectionTop < vh && sectionBottom > 0) {
          active.add(slugs[i]!);
        }
      }

      setActiveSlugs(active);
    }

    function onScroll() {
      cancelAnimationFrame(rafId);
      rafId = requestAnimationFrame(update);
    }

    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(rafId);
    };
  }, [headings]);

  return activeSlugs;
}

/**
 * Table of contents for markdown-rendered content.
 * Expects headings extracted from the markdown string and
 * matching IDs on the rendered heading elements.
 */
export function MarkdownToc({ headings, className }: MarkdownTocProps) {
  const activeSlugs = useActiveSections(headings);
  const itemRefs = useRef<Map<string, HTMLLIElement>>(new Map());

  const [indicator, setIndicator] = useState({ top: 0, height: 0 });

  const setItemRef = useCallback(
    (slug: string) => (el: HTMLLIElement | null) => {
      if (el) {
        itemRefs.current.set(slug, el);
      } else {
        itemRefs.current.delete(slug);
      }
    },
    [],
  );

  useEffect(() => {
    if (activeSlugs.size === 0) {
      setIndicator({ top: 0, height: 0 });
      return;
    }

    let minTop = Infinity;
    let maxBottom = -Infinity;

    for (const slug of activeSlugs) {
      const el = itemRefs.current.get(slug);
      if (!el) continue;
      minTop = Math.min(minTop, el.offsetTop);
      maxBottom = Math.max(maxBottom, el.offsetTop + el.offsetHeight);
    }

    if (minTop === Infinity) return;
    setIndicator({ top: minTop, height: maxBottom - minTop });
  }, [activeSlugs]);

  if (headings.length === 0) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={cn("flex flex-col gap-4", className)}
    >
      <p className="text-sm font-medium text-foreground">In this Pitch</p>

      <div className="relative border-l border-border">
        <motion.div
          animate={{
            top: indicator.top,
            height: indicator.height,
            opacity: activeSlugs.size > 0 ? 1 : 0,
          }}
          className="absolute -left-px w-[2px] bg-pink-500"
          initial={false}
          transition={SPRING_TRANSITION}
        />

        <ul className="flex flex-col">
          {headings.map((heading) => {
            const isActive = activeSlugs.has(heading.slug);
            return (
              <li key={heading.slug} ref={setItemRef(heading.slug)}>
                <Link
                  className={cn(
                    "block px-6 py-1.5 text-sm leading-snug transition-colors duration-200",
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  href={`#${heading.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById(heading.slug);
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" });
                      window.history.pushState(null, "", `#${heading.slug}`);
                    }
                  }}
                >
                  {heading.text}
                </Link>
              </li>
            );
          })}
        </ul>
      </div>
    </nav>
  );
}

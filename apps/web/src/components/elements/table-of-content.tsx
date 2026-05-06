"use client";

import { cn } from "@workspace/ui/lib/utils";
import { motion } from "motion/react";
import Link from "next/link";
import {
  type FC,
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";

import type { SanityRichTextBlock, SanityRichTextProps } from "@/types";
import { convertToSlug } from "@/utils";

// ==========================================================================
// TYPES
// ==========================================================================

type TableOfContentProps = {
  richText?: SanityRichTextProps;
  className?: string;
  maxDepth?: number;
};

type ProcessedHeading = {
  readonly id: string;
  readonly text: string;
  readonly slug: string;
  readonly href: string;
  readonly level: number;
  readonly style: HeadingStyle;
  readonly _key?: string;
};

type HeadingStyle = "h2" | "h3" | "h4" | "h5" | "h6";

type SanityTextChild = {
  readonly marks?: readonly string[];
  readonly text?: string;
  readonly _type: "span";
  readonly _key: string;
};

type HeadingBlock = Extract<SanityRichTextBlock, { _type: "block" }> & {
  style: HeadingStyle;
  children: readonly SanityTextChild[];
};

// ==========================================================================
// CONSTANTS
// ==========================================================================

const HEADING_LEVELS: Record<HeadingStyle, number> = {
  h2: 2,
  h3: 3,
  h4: 4,
  h5: 5,
  h6: 6,
} as const;

const DEFAULT_MAX_DEPTH = 6;
const MIN_HEADINGS_TO_SHOW = 1;

const SPRING_TRANSITION = {
  type: "spring" as const,
  stiffness: 350,
  damping: 30,
  mass: 0.8,
};

// ==========================================================================
// TYPE GUARDS
// ==========================================================================

function isValidHeadingStyle(style: unknown): style is HeadingStyle {
  return typeof style === "string" && style in HEADING_LEVELS;
}

function isValidTextChild(child: unknown): child is SanityTextChild {
  return (
    typeof child === "object" &&
    child !== null &&
    "_type" in child &&
    child._type === "span" &&
    "text" in child &&
    typeof child.text === "string"
  );
}

function isHeadingBlock(block: unknown): block is HeadingBlock {
  if (
    typeof block !== "object" ||
    block === null ||
    !("_type" in block) ||
    block._type !== "block"
  ) {
    return false;
  }

  const candidate = block as Record<string, unknown>;

  return (
    isValidHeadingStyle(candidate.style) &&
    Array.isArray(candidate.children) &&
    candidate.children.length > 0 &&
    candidate.children.every(isValidTextChild)
  );
}

// ==========================================================================
// PROCESSING
// ==========================================================================

/** Uses the same slug logic as rich-text.tsx (parseChildrenToSlug -> convertToSlug). */
function childrenToSlug(children: readonly SanityTextChild[]): string {
  const raw = children.map((child) => child.text ?? "").join("");
  return convertToSlug(raw) ?? "";
}

function extractText(children: readonly SanityTextChild[]): string {
  return children
    .map((child) => child.text ?? "")
    .join("")
    .trim();
}

function processHeadings(
  richText: SanityRichTextProps,
  maxDepth: number,
): ProcessedHeading[] {
  if (!Array.isArray(richText) || richText.length === 0) return [];

  const headingBlocks = richText.filter(isHeadingBlock);

  return headingBlocks
    .map((block, index): ProcessedHeading | null => {
      const text = extractText(block.children);
      if (!text) return null;
      const level = HEADING_LEVELS[block.style];
      if (level > maxDepth) return null;

      const slug = childrenToSlug(block.children);
      if (!slug) return null;

      return {
        id: `toc-${block._key || slug || `heading-${index}`}`,
        text,
        slug,
        href: `#${slug}`,
        level,
        style: block.style,
        _key: block._key,
      };
    })
    .filter((h): h is ProcessedHeading => h !== null);
}

// ==========================================================================
// HOOKS
// ==========================================================================

/**
 * Section-aware scroll spy.
 * Each heading "owns" the region from itself to the next heading.
 * A heading is active when its section overlaps the viewport.
 */
function useActiveSections(headings: ProcessedHeading[]) {
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

        // Section top = this heading's top
        const sectionTop = el.getBoundingClientRect().top;

        // Section bottom = next heading's top, or viewport bottom + buffer for last
        let sectionBottom: number;
        if (i + 1 < slugs.length) {
          const nextEl = document.getElementById(slugs[i + 1]!);
          sectionBottom = nextEl
            ? nextEl.getBoundingClientRect().top
            : sectionTop + vh;
        } else {
          // Last heading: section extends to end of document
          sectionBottom = Math.max(
            document.documentElement.scrollHeight -
              window.scrollY -
              el.offsetTop +
              sectionTop,
            sectionTop + vh,
          );
        }

        // Section overlaps viewport if it starts before viewport bottom
        // and ends after viewport top
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

// ==========================================================================
// COMPONENT
// ==========================================================================

export const TableOfContent: FC<TableOfContentProps> = ({
  richText,
  className,
  maxDepth = DEFAULT_MAX_DEPTH,
}) => {
  const headings = useMemo(
    () => (richText ? processHeadings(richText, maxDepth) : []),
    [richText, maxDepth],
  );

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

  if (headings.length < MIN_HEADINGS_TO_SHOW) return null;

  return (
    <nav
      aria-label="Table of contents"
      className={cn("flex flex-col gap-4", className)}
    >
      <p className="text-sm font-medium text-foreground">In this Article</p>

      <div className="relative border-l border-border">
        {/* Animated indicator */}
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
              <li key={heading.id} ref={setItemRef(heading.slug)}>
                <Link
                  className={cn(
                    "block px-6 py-1.5 text-sm leading-snug transition-colors duration-200",
                    isActive
                      ? "font-medium text-foreground"
                      : "text-muted-foreground hover:text-foreground",
                  )}
                  href={heading.href}
                  onClick={(e) => {
                    e.preventDefault();
                    const target = document.getElementById(heading.slug);
                    if (target) {
                      target.scrollIntoView({ behavior: "smooth" });
                      window.history.pushState(null, "", heading.href);
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
};

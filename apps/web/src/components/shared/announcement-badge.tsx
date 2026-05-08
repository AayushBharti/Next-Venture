"use client";

import { ArrowRight } from "lucide-react";
import { motion } from "motion/react";

interface AnnouncementBadgeProps {
  text: string;
}

/**
 * Pill-shaped announcement badge with animated arrow.
 * Hover triggers a sliding double-arrow effect.
 */
export function AnnouncementBadge({ text }: AnnouncementBadgeProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="hover:bg-background dark:hover:border-t-border bg-muted group mx-auto flex w-fit items-center gap-4 rounded-full border p-1 pl-4 shadow-md shadow-black/5 transition-all duration-300 dark:border-t-white/5 dark:shadow-zinc-950"
    >
      <span className="text-foreground text-sm">{text}</span>
      <span className="dark:border-background block h-4 w-0.5 border-l bg-white dark:bg-zinc-700" />

      <div className="bg-background group-hover:bg-muted size-6 overflow-hidden rounded-full duration-500">
        <div className="flex w-12 -translate-x-1/2 duration-500 ease-in-out group-hover:translate-x-0">
          <span className="flex size-6">
            <ArrowRight className="m-auto size-3" />
          </span>
          <span className="flex size-6">
            <ArrowRight className="m-auto size-3" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}

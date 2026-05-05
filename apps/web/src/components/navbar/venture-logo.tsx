"use client";

import { motion } from "motion/react";
import Link from "next/link";
import { useState } from "react";

/**
 * VentureDen brand logo — "V" lettermark icon + wordmark.
 */
export function VentureLogo() {
  const [hovered, setHovered] = useState(false);

  return (
    <Link
      href="/"
      className="flex items-center gap-2"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {/* Icon container — no scale, just glow on hover */}
      <motion.div
        className="relative flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 via-fuchsia-500 to-violet-600"
        animate={
          hovered
            ? { boxShadow: "0 0 16px 2px rgba(236,72,153,0.45)" }
            : { boxShadow: "0 4px 6px -1px rgba(236,72,153,0.2)" }
        }
        transition={{ duration: 0.3, ease: "easeOut" }}
      >
        <svg
          viewBox="0 0 32 32"
          fill="none"
          className="size-full p-1"
          aria-hidden="true"
        >
          {/* V shape — brightens on hover */}
          <motion.path
            d="M6 8l10 18L26 8"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            animate={
              hovered
                ? { strokeWidth: 4.5, opacity: 1 }
                : { strokeWidth: 4, opacity: 0.85 }
            }
            transition={{ duration: 0.25, ease: "easeOut" }}
          />
          {/* Vertical line — rises up as rocket trail */}
          <motion.path
            d="M16 26V6"
            stroke="white"
            strokeLinecap="round"
            animate={
              hovered
                ? { opacity: 1, y: -3, strokeWidth: 3.5 }
                : { opacity: 0.35, y: 0, strokeWidth: 3 }
            }
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 12,
              delay: 0.04,
            }}
          />
          {/* Arrow chevron — launches upward */}
          <motion.path
            d="M11 11l5-5 5 5"
            stroke="white"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
            animate={
              hovered
                ? { opacity: 1, y: -5, strokeWidth: 3 }
                : { opacity: 0.35, y: 0, strokeWidth: 2.5 }
            }
            transition={{
              type: "spring",
              stiffness: 350,
              damping: 10,
              delay: 0.08,
            }}
          />

          {/* Spark — tiny dot shoots from arrow tip on hover */}
          <motion.circle
            cx="16"
            cy="6"
            r="1.2"
            fill="white"
            animate={
              hovered
                ? { opacity: 0, y: -8, scale: 0.2 }
                : { opacity: 0, y: 0, scale: 0.5 }
            }
            initial={{ opacity: 0 }}
            transition={{ duration: 0.5, ease: "easeOut", delay: 0.12 }}
          />
          {/* Left spark */}
          <motion.circle
            cx="12"
            cy="8"
            r="0.8"
            fill="white"
            animate={
              hovered
                ? { opacity: 0, y: -6, x: -3, scale: 0.1 }
                : { opacity: 0, y: 0, x: 0, scale: 0.5 }
            }
            initial={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.15 }}
          />
          {/* Right spark */}
          <motion.circle
            cx="20"
            cy="8"
            r="0.8"
            fill="white"
            animate={
              hovered
                ? { opacity: 0, y: -6, x: 3, scale: 0.1 }
                : { opacity: 0, y: 0, x: 0, scale: 0.5 }
            }
            initial={{ opacity: 0 }}
            transition={{ duration: 0.45, ease: "easeOut", delay: 0.18 }}
          />

          {/* Exhaust glow — fades in at bottom of V on hover */}
          <motion.ellipse
            cx="16"
            cy="26"
            rx="4"
            ry="2"
            fill="white"
            animate={hovered ? { opacity: 0.25, ry: 3 } : { opacity: 0, ry: 2 }}
            transition={{ duration: 0.3, ease: "easeOut", delay: 0.06 }}
          />
        </svg>

        {/* Shine overlay — intensifies on hover */}
        <motion.div
          className="absolute inset-0 rounded-lg bg-gradient-to-t from-transparent to-white/15"
          animate={hovered ? { opacity: 1.5 } : { opacity: 1 }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>

      {/* Wordmark */}
      <span className="text-sm font-bold tracking-tight text-neutral-900 dark:text-white">
        Venture
        <span className="bg-gradient-to-r from-pink-500 to-violet-500 bg-clip-text text-transparent">
          Den
        </span>
      </span>
    </Link>
  );
}

"use client";

import { cn } from "@workspace/ui/lib/utils";
import type { CSSProperties, ReactNode } from "react";

interface GlowBorderProps {
  children: ReactNode;
  className?: string;
  /** Border radius in px. Default 16. */
  radius?: number;
  /** Glow border width in px. Default 1.5. */
  borderWidth?: number;
  /** Animation cycle duration in seconds. Default 4. */
  speed?: number;
  /** Whether the glow is active. Default true. */
  active?: boolean;
}

/**
 * Animated hue-cycling border that wraps any content.
 * Uses @property (registered in globals.css) for smooth hue interpolation.
 */
export function GlowBorder({
  children,
  className,
  radius = 16,
  borderWidth = 1.5,
  speed = 4,
  active = true,
}: GlowBorderProps) {
  const innerRadius = radius - borderWidth;

  const wrapStyle: CSSProperties = {
    position: "relative",
    borderRadius: radius,
    padding: borderWidth,
  };

  const borderStyle: CSSProperties = {
    position: "absolute",
    inset: 0,
    borderRadius: radius,
    zIndex: 0,
    background: `
      radial-gradient(
        35% 35% at calc(var(--glow-bg-x) * 1%) calc(var(--glow-bg-y) * 1%),
        hsl(calc(var(--glow-hue) * 1deg) 85% 65%) 0%,
        hsl(calc(var(--glow-hue) * 1deg) 70% 45%) 40%,
        var(--border) 100%
      )
    `,
    animation: `glow-hue-cycle ${speed}s linear infinite, glow-border-orbit ${speed}s linear infinite`,
    opacity: active ? 1 : 0.6,
    transition: "opacity 0.5s ease",
  };

  const innerStyle: CSSProperties = {
    position: "relative",
    borderRadius: innerRadius,
    zIndex: 1,
    overflow: "hidden",
  };

  return (
    <div className={cn(className)} style={wrapStyle}>
      <div style={borderStyle} aria-hidden="true" />
      <div className="bg-background" style={innerStyle}>
        {children}
      </div>
    </div>
  );
}

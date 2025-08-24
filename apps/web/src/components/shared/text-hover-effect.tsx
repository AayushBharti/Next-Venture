"use client";

import { motion, useMotionValue, useSpring } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";

const TEXT_STYLE = {
  fontFamily: "helvetica, Arial, sans-serif",
  fontWeight: 700,
  fontSize: 40,
} as const;

export function TextHoverEffect({
  text,
  viewBox = "0 0 300 50",
  strokeWidth = 0.5,
}: {
  text: string;
  viewBox?: string;
  strokeWidth?: number;
}) {
  const id = useId();
  const gradientId = `textGradient-${id}`;
  const maskGradientId = `revealMask-${id}`;
  const maskId = `textMask-${id}`;

  const svgRef = useRef<SVGSVGElement>(null);
  const [hovered, setHovered] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  const cursorX = useMotionValue(50);
  const cursorY = useMotionValue(50);
  const springX = useSpring(cursorX, { stiffness: 300, damping: 50 });
  const springY = useSpring(cursorY, { stiffness: 300, damping: 50 });

  const [maskCx, setMaskCx] = useState("50%");
  const [maskCy, setMaskCy] = useState("50%");

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth < 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  // Auto-animate gradient on mobile
  useEffect(() => {
    if (!isMobile) {
      return;
    }
    let frame: number;
    let t = 0;
    const loop = () => {
      t += 0.02;
      const cx = 20 + Math.sin(t) * 35;
      const cy = 30 + Math.cos(t * 0.8) * 30;
      setMaskCx(`${cx}%`);
      setMaskCy(`${cy}%`);
      frame = requestAnimationFrame(loop);
    };
    frame = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(frame);
  }, [isMobile]);

  // Track spring values for desktop
  useEffect(() => {
    if (isMobile) {
      return;
    }
    const unsubX = springX.on("change", (v) => setMaskCx(`${v}%`));
    const unsubY = springY.on("change", (v) => setMaskCy(`${v}%`));
    return () => {
      unsubX();
      unsubY();
    };
  }, [springX, springY, isMobile]);

  const handleMouseMove = (e: React.MouseEvent<SVGSVGElement>) => {
    if (!svgRef.current || isMobile) {
      return;
    }
    const rect = svgRef.current.getBoundingClientRect();
    cursorX.set(((e.clientX - rect.left) / rect.width) * 100);
    cursorY.set(((e.clientY - rect.top) / rect.height) * 100);
  };

  const showGradient = hovered || isMobile;

  return (
    <svg
      ref={svgRef}
      width="100%"
      height="100%"
      viewBox={viewBox}
      preserveAspectRatio="xMidYMid meet"
      xmlns="http://www.w3.org/2000/svg"
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onMouseMove={handleMouseMove}
      className="select-none"
    >
      <defs>
        <linearGradient
          id={gradientId}
          gradientUnits="userSpaceOnUse"
          cx="50%"
          cy="50%"
          r="25%"
        >
          {showGradient && (
            <>
              <stop offset="0%" stopColor="#eab308" />
              <stop offset="25%" stopColor="#ef4444" />
              <stop offset="50%" stopColor="#3b82f6" />
              <stop offset="75%" stopColor="#06b6d4" />
              <stop offset="100%" stopColor="#8b5cf6" />
            </>
          )}
        </linearGradient>

        <radialGradient
          id={maskGradientId}
          gradientUnits="userSpaceOnUse"
          r={isMobile ? "40%" : "20%"}
          cx={maskCx}
          cy={maskCy}
        >
          <stop offset="0%" stopColor="white" />
          <stop offset="100%" stopColor="black" />
        </radialGradient>
        <mask id={maskId}>
          <rect
            x="0"
            y="0"
            width="100%"
            height="100%"
            fill={`url(#${maskGradientId})`}
          />
        </mask>
      </defs>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth={strokeWidth}
        className="fill-transparent stroke-neutral-300 dark:stroke-neutral-800"
        style={{ ...TEXT_STYLE, opacity: showGradient ? 0.7 : 0 }}
      >
        {text}
      </text>

      <motion.text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        strokeWidth={strokeWidth}
        className="fill-transparent stroke-neutral-300 dark:stroke-neutral-800"
        style={TEXT_STYLE}
        initial={{ strokeDashoffset: 1000, strokeDasharray: 1000 }}
        animate={{ strokeDashoffset: 0, strokeDasharray: 1000 }}
        transition={{ duration: 4, ease: "easeInOut" }}
      >
        {text}
      </motion.text>

      <text
        x="50%"
        y="50%"
        textAnchor="middle"
        dominantBaseline="middle"
        stroke={`url(#${gradientId})`}
        strokeWidth={strokeWidth}
        mask={`url(#${maskId})`}
        className="fill-transparent"
        style={TEXT_STYLE}
      >
        {text}
      </text>
    </svg>
  );
}

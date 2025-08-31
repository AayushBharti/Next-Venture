"use client";

import {
  motion,
  useAnimate,
  useMotionValue,
  useScroll,
  useSpring,
  useTransform,
} from "motion/react";
import { useEffect, useRef } from "react";

import { SanityButtons } from "@/components/elements/sanity-buttons";
import {
  DecorativePitchCardLeft,
  DecorativePitchCardRight,
} from "@/components/homepage/decorative-pitch-cards";
import { Pointer } from "@/components/shared/pointer";
import type { PagebuilderType } from "@/types";

type HeroProps = PagebuilderType<"heroSection">;

/**
 * Hook for mouse-based parallax offset on the hero section.
 * Returns smoothed x/y motion values normalized to [-1, 1].
 */
function useMouseParallax() {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  useEffect(() => {
    const onMove = (e: MouseEvent) => {
      const x = (e.clientX / window.innerWidth - 0.5) * 2;
      const y = (e.clientY / window.innerHeight - 0.5) * 2;
      mouseX.set(x);
      mouseY.set(y);
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, [mouseX, mouseY]);

  return {
    x: useSpring(mouseX, { stiffness: 50, damping: 20 }),
    y: useSpring(mouseY, { stiffness: 50, damping: 20 }),
  };
}

export function Hero(props: HeroProps) {
  const { badge, title, subtitle, buttons } = props;

  const [leftDesignScope, leftDesignAnimate] = useAnimate();
  const [leftPointerScope, leftPointerAnimate] = useAnimate();
  const [rightDesignScope, rightDesignAnimate] = useAnimate();
  const [rightPointerScope, rightPointerAnimate] = useAnimate();

  const sectionRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end start"],
  });

  const mouse = useMouseParallax();

  // Scroll parallax — cards drift up at different rates
  const leftScrollY = useTransform(scrollYProgress, [0, 1], [0, -120]);
  const rightScrollY = useTransform(scrollYProgress, [0, 1], [0, -80]);

  // Mouse parallax — cards shift with cursor
  const leftMouseX = useTransform(mouse.x, [-1, 1], [-20, 20]);
  const leftMouseY = useTransform(mouse.y, [-1, 1], [-15, 15]);
  const rightMouseX = useTransform(mouse.x, [-1, 1], [15, -15]);
  const rightMouseY = useTransform(mouse.y, [-1, 1], [10, -10]);

  // Pointer parallax — slightly different rate for depth
  const leftPtrX = useTransform(mouse.x, [-1, 1], [-12, 12]);
  const leftPtrY = useTransform(mouse.y, [-1, 1], [-10, 10]);
  const rightPtrX = useTransform(mouse.x, [-1, 1], [10, -10]);
  const rightPtrY = useTransform(mouse.y, [-1, 1], [8, -8]);

  // biome-ignore lint/correctness/useExhaustiveDependencies: intentionally runs once on mount
  useEffect(() => {
    leftDesignAnimate([
      [leftDesignScope.current, { opacity: 1 }, { duration: 0.5 }],
      [leftDesignScope.current, { y: 0, x: 0 }, { duration: 0.5 }],
    ]);

    leftPointerAnimate([
      [leftPointerScope.current, { opacity: 1 }, { duration: 0.5 }],
      [leftPointerScope.current, { y: 0, x: -100 }, { duration: 0.5 }],
      [
        leftPointerScope.current,
        { x: 0, y: [0, 16, 0] },
        { duration: 0.5, ease: "easeInOut" },
      ],
    ]);

    rightDesignAnimate([
      [rightDesignScope.current, { opacity: 1 }, { duration: 0.5, delay: 1.5 }],
      [rightDesignScope.current, { x: 0, y: 0 }, { duration: 0.5 }],
    ]);

    rightPointerAnimate([
      [
        rightPointerScope.current,
        { opacity: 1 },
        { duration: 0.5, delay: 1.5 },
      ],
      [rightPointerScope.current, { x: 175, y: 0 }, { duration: 0.5 }],
      [
        rightPointerScope.current,
        { x: 0, y: [0, 20, 0] },
        { duration: 0.5, ease: "easeInOut" },
      ],
    ]);
  }, []);

  return (
    <section
      ref={sectionRef}
      className="hero-cursor relative mx-auto max-w-screen-2xl overflow-x-clip pt-32"
    >
      <div className="container relative">
        {/* Left decorative card */}
        <motion.div
          ref={leftDesignScope}
          initial={{ opacity: 0, y: 100, x: -100 }}
          drag
          dragConstraints={{
            left: -100,
            top: -300,
            right: 850,
            bottom: 200,
          }}
          style={{
            y: leftScrollY,
            translateX: leftMouseX,
            translateY: leftMouseY,
          }}
          animate={{ rotate: [-1, 1, -1] }}
          transition={{
            rotate: { duration: 6, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -left-44 top-16 z-10 hidden lg:block xl:-left-32"
        >
          <DecorativePitchCardLeft />
        </motion.div>
        <motion.div
          ref={leftPointerScope}
          initial={{ opacity: 0, y: 100, x: -200 }}
          style={{ translateX: leftPtrX, translateY: leftPtrY }}
          className="pointer-events-none absolute left-32 top-96 z-10 hidden lg:block xl:left-48"
        >
          <Pointer name="Andrea" />
        </motion.div>

        {/* Right decorative card */}
        <motion.div
          ref={rightDesignScope}
          initial={{ opacity: 0, x: 100, y: 100 }}
          drag
          dragConstraints={{
            left: -850,
            top: -300,
            right: 150,
            bottom: 200,
          }}
          style={{
            y: rightScrollY,
            translateX: rightMouseX,
            translateY: rightMouseY,
          }}
          animate={{ rotate: [1, -1, 1] }}
          transition={{
            rotate: { duration: 5, repeat: Infinity, ease: "easeInOut" },
          }}
          className="absolute -right-44 -top-4 z-10 hidden lg:block xl:-right-22"
        >
          <DecorativePitchCardRight />
        </motion.div>
        <motion.div
          ref={rightPointerScope}
          initial={{ opacity: 0, x: 275, y: 100 }}
          style={{ translateX: rightPtrX, translateY: rightPtrY }}
          className="pointer-events-none absolute right-48 top-64 z-10 hidden lg:block xl:right-64"
        >
          <Pointer name="Bryan" color="red" />
        </motion.div>

        {/* Hero content — text passes through so cards are interactive */}
        <div className="pointer-events-none relative z-20">
          {badge && (
            <div className="flex justify-center">
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, ease: "easeOut" }}
                className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 px-4 py-1.5 text-sm font-medium text-neutral-900 dark:text-white backdrop-blur-sm"
              >
                {/* Animated shimmer sweep */}
                <span className="absolute inset-0 -translate-x-full animate-[shimmer_3s_ease-in-out_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent" />

                {/* Gradient dot indicator */}
                <span className="relative flex size-2">
                  <span className="absolute inline-flex size-full animate-ping rounded-full bg-purple-400 opacity-75" />
                  <span className="relative inline-flex size-2 rounded-full bg-gradient-to-r from-purple-400 to-pink-400" />
                </span>

                <span className="relative bg-gradient-to-r from-purple-300 via-pink-300 to-purple-300 bg-clip-text text-transparent">
                  {badge}
                </span>
              </motion.div>
            </div>
          )}

          {title && (
            <h1 className="mx-auto mt-6 max-w-4xl text-center text-5xl font-medium md:text-6xl lg:text-8xl">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="mx-auto mt-6 max-w-md text-center text-base text-neutral-500 dark:text-white/50 md:mt-8 md:max-w-2xl md:text-xl">
              {subtitle}
            </p>
          )}

          {buttons && buttons.length > 0 && (
            <SanityButtons
              buttons={buttons}
              size="lg"
              buttonClassName="w-full sm:w-auto"
              className="pointer-events-auto mt-8 flex flex-col items-center justify-center gap-4 md:mt-10 md:flex-row"
            />
          )}
        </div>
      </div>
    </section>
  );
}

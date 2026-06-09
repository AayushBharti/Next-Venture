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
import { AnnouncementBadge } from "@/components/shared/announcement-badge";
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
      className="hero-cursor relative overflow-x-clip pt-24 md:pt-36"
    >
      {/* Decorative light rays */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 z-[2] hidden contain-strict opacity-50 isolate lg:block"
      >
        <div className="absolute left-0 top-0 h-[80rem] w-[35rem] -translate-y-[350px] -rotate-45 rounded-full bg-[radial-gradient(68.54%_68.72%_at_55.02%_31.46%,hsla(0,0%,85%,.08)_0,hsla(0,0%,55%,.02)_50%,hsla(0,0%,45%,0)_80%)]" />
        <div className="absolute left-0 top-0 h-[80rem] w-56 -rotate-45 rounded-full bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.06)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)] [translate:5%_-50%]" />
        <div className="absolute left-0 top-0 h-[80rem] w-56 -translate-y-[350px] -rotate-45 bg-[radial-gradient(50%_50%_at_50%_50%,hsla(0,0%,85%,.04)_0,hsla(0,0%,45%,.02)_80%,transparent_100%)]" />
      </div>

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
            <div className="pointer-events-auto flex justify-center">
              <AnnouncementBadge text={badge} />
            </div>
          )}

          {title && (
            <h1 className="mx-auto mt-8 max-w-4xl text-balance text-center text-4xl font-medium sm:text-5xl md:text-6xl lg:mt-16 lg:text-8xl">
              {title}
            </h1>
          )}

          {subtitle && (
            <p className="mx-auto mt-6 max-w-sm text-balance text-center text-base text-muted-foreground sm:max-w-md md:mt-8 md:max-w-2xl md:text-lg">
              {subtitle}
            </p>
          )}

          {buttons && buttons.length > 0 && (
            <SanityButtons
              buttons={buttons}
              size="lg"
              buttonClassName="min-w-44 sm:w-auto"
              className="pointer-events-auto mt-10 flex flex-col items-center justify-center gap-3 md:mt-12 md:flex-row"
            />
          )}
        </div>
      </div>
    </section>
  );
}

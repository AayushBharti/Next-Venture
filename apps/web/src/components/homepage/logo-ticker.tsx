"use client";

import { motion } from "motion/react";

import { SanityImage } from "@/components/elements/sanity-image";
import type { PagebuilderType } from "@/types";

type LogoTickerProps = PagebuilderType<"logoTickerSection">;

export function LogoTicker({ title, logos, speed = 30 }: LogoTickerProps) {
  if (!logos || logos.length === 0) return null;

  return (
    <section className="overflow-x-clip py-16 md:py-24">
      <div className="container">
        {title && (
          <h3 className="text-center text-sm text-muted-foreground sm:text-base md:text-xl">
            {title}
          </h3>
        )}

        <div className="mt-8 flex overflow-hidden md:mt-12 mask-[linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            animate={{ x: "-50%" }}
            transition={{
              duration: speed,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex flex-none items-center gap-10 pr-16 sm:gap-14 sm:pr-20 md:gap-16 md:pr-24"
          >
            {Array.from({ length: 2 }).map((_, index) => (
              <div
                key={index}
                className="flex items-center gap-10 sm:gap-14 md:gap-16"
              >
                {logos.map((logo) =>
                  logo?.id ? (
                    <SanityImage
                      key={logo.id}
                      image={logo}
                      height={48}
                      className="h-8 w-auto opacity-80 invert sm:h-10 md:h-12 dark:invert-0"
                    />
                  ) : null,
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

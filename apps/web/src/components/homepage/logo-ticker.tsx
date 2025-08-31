"use client";

import { motion } from "motion/react";

import { SanityImage } from "@/components/elements/sanity-image";
import type { PagebuilderType } from "@/types";

type LogoTickerProps = PagebuilderType<"logoTickerSection">;

export function LogoTicker({ title, logos, speed = 30 }: LogoTickerProps) {
  if (!logos || logos.length === 0) return null;

  return (
    <section className="overflow-x-clip py-24">
      <div className="container">
        {title && (
          <h3 className="text-center text-xl text-neutral-500 dark:text-white/50">
            {title}
          </h3>
        )}

        <div className="mt-12 flex overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
          <motion.div
            animate={{ x: "-50%" }}
            transition={{
              duration: speed,
              ease: "linear",
              repeat: Infinity,
            }}
            className="flex flex-none items-center gap-16 pr-24"
          >
            {Array.from({ length: 2 }).map((_, index) => (
              <div key={index} className="flex items-center gap-16">
                {logos.map((logo) =>
                  logo?.id ? (
                    <SanityImage
                      key={logo.id}
                      image={logo}
                      height={48}
                      className="h-12 w-auto opacity-80 invert dark:invert-0"
                    />
                  ) : null
                )}
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

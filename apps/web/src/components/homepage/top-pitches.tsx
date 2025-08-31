"use client";

import type { QueryTopStartupsResult } from "@workspace/sanity/types";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel";
import { useEffect, useState } from "react";

import { Tag } from "@/components/shared/tag";
import {
  StartupCard,
  StartupCardSkeleton,
} from "@/components/startup/startup-card";
import type { PagebuilderType } from "@/types";

type TopPitchesProps = PagebuilderType<"topPitchesSection">;

/**
 * Fetches top startups (by upvotes) from Sanity and renders them in a carousel.
 */
export function TopPitches({ eyebrow, title, count }: TopPitchesProps) {
  const [startups, setStartups] = useState<QueryTopStartupsResult>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/startups/top?count=${count ?? 6}`)
      .then((res) => res.json())
      .then((data) => setStartups(data ?? []))
      .catch(() => setStartups([]))
      .finally(() => setLoading(false));
  }, [count]);

  return (
    <section className="py-16">
      {/* Title — contained */}
      <div className="container flex flex-col items-center">
        {eyebrow && <Tag>{eyebrow}</Tag>}
        <h2 className="my-6 text-center text-6xl font-medium">
          {title ?? (
            <>
              Top Pitches on the <span className="text-pink-400">Rise</span>
            </>
          )}
        </h2>
      </div>

      {/* Carousel — edge-to-edge, left aligned with container */}
      {loading ? (
        <div className="container mt-6">
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <StartupCardSkeleton key={i} />
            ))}
          </div>
        </div>
      ) : startups.length > 0 ? (
        <Carousel opts={{ align: "start" }} className="mt-6 w-full">
          <div className="relative">
            <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-8 bg-gradient-to-r from-background to-transparent sm:w-16" />
            <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-8 bg-gradient-to-l from-background to-transparent sm:w-16" />

            <CarouselContent
              className="ml-0 py-1"
              style={{
                paddingLeft: "max(1rem, calc((100vw - 80rem) / 2 + 1rem))",
              }}
            >
              {startups.map((startup) => (
                <CarouselItem
                  key={startup._id}
                  className="basis-4/5 pl-4 sm:basis-[46%] lg:basis-[31%] 2xl:basis-[28%]"
                >
                  <StartupCard post={startup} />
                </CarouselItem>
              ))}
            </CarouselContent>
          </div>

          <div className="container mt-8 flex items-center justify-end gap-2">
            <CarouselPrevious className="static translate-x-0 translate-y-0 size-10 border-neutral-200/60 dark:border-white/10 bg-neutral-50 shadow-sm dark:bg-neutral-900 dark:shadow-none hover:bg-neutral-100 hover:shadow-md dark:hover:bg-neutral-800 dark:hover:shadow-none" />
            <CarouselNext className="static translate-x-0 translate-y-0 size-10 border-neutral-200/60 dark:border-white/10 bg-neutral-50 shadow-sm dark:bg-neutral-900 dark:shadow-none hover:bg-neutral-100 hover:shadow-md dark:hover:bg-neutral-800 dark:hover:shadow-none" />
          </div>
        </Carousel>
      ) : null}
    </section>
  );
}

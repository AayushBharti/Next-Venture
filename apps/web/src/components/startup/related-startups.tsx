import { sanityFetch } from "@workspace/sanity/live";
import {
  queryRelatedStartups,
  queryTopStartups,
} from "@workspace/sanity/query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel";

import { Tag } from "@/components/shared/tag";
import { StartupCard } from "./startup-card";

type Props = {
  categoryRef: string;
  excludeId: string;
};

const MIN_DISPLAY = 3;
const FETCH_COUNT = 6;

/**
 * Server component showing related startups from the same category.
 * Falls back to top pitches when the category has fewer than 3 others.
 */
export async function RelatedStartups({ categoryRef, excludeId }: Props) {
  const { data: related } = await sanityFetch({
    query: queryRelatedStartups,
    params: { categoryRef, excludeId },
  });

  let startups = related ?? [];
  let heading = "More in this category";
  let tag = "Related";

  if (startups.length < MIN_DISPLAY) {
    const { data: top } = await sanityFetch({
      query: queryTopStartups,
      params: { count: FETCH_COUNT + 1 },
    });

    const existingIds = new Set([excludeId, ...startups.map((s) => s._id)]);
    const backfill = (top ?? []).filter((s) => !existingIds.has(s._id));
    startups = [...startups, ...backfill].slice(0, FETCH_COUNT);

    if ((related ?? []).length === 0) {
      heading = "Top Pitches";
      tag = "Trending";
    }
  }

  if (startups.length === 0) {
    return null;
  }

  return (
    <section className="pt-20">
      {/* Title — contained */}
      <div className="container flex flex-col items-center">
        <Tag>{tag}</Tag>
        <h2 className="my-6 text-center text-3xl font-bold tracking-tight md:text-4xl">
          {heading}
        </h2>
      </div>

      {/* Carousel — edge-to-edge with container-aligned left edge */}
      <Carousel opts={{ align: "start" }} className="mt-2 w-full">
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
          <CarouselPrevious className="static size-10 translate-x-0 translate-y-0 border-neutral-200/60 bg-neutral-50 shadow-sm hover:bg-neutral-100 hover:shadow-md dark:border-white/10 dark:bg-neutral-900 dark:shadow-none dark:hover:bg-neutral-800 dark:hover:shadow-none" />
          <CarouselNext className="static size-10 translate-x-0 translate-y-0 border-neutral-200/60 bg-neutral-50 shadow-sm hover:bg-neutral-100 hover:shadow-md dark:border-white/10 dark:bg-neutral-900 dark:shadow-none dark:hover:bg-neutral-800 dark:hover:shadow-none" />
        </div>
      </Carousel>
    </section>
  );
}

import { sanityFetch } from "@workspace/sanity/live";
import { queryPlaylistBySlug } from "@workspace/sanity/query";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@workspace/ui/components/carousel";

import { Tag } from "@/components/shared/tag";
import { StartupCard } from "./startup-card";

/**
 * Server component that fetches the "editors-picks" playlist from Sanity
 * and renders the startups in a carousel.
 * Returns null when the playlist is empty or not found.
 */
export async function EditorPicks() {
  const { data: playlist } = await sanityFetch({
    query: queryPlaylistBySlug,
    params: { slug: "editors-picks" },
  });

  const picks = playlist?.select;

  if (!picks || picks.length === 0) {
    return null;
  }

  return (
    <section className="mx-auto w-full max-w-5xl px-6 pt-20">
      <div className="mb-8 border-t border-neutral-200 dark:border-white/10 pt-12">
        <Tag>Editor Picks</Tag>
        <h2 className="mt-4 text-3xl font-bold tracking-tight">
          More pitches you might like
        </h2>
      </div>

      <Carousel opts={{ align: "start", loop: true }} className="w-full">
        <CarouselContent className="-ml-4">
          {picks.map((pick) => (
            <CarouselItem
              key={pick._id}
              className="basis-full pl-4 sm:basis-1/2 lg:basis-1/3"
            >
              <StartupCard post={pick} />
            </CarouselItem>
          ))}
        </CarouselContent>
        <CarouselPrevious className="left-0 size-10 border-neutral-200/60 dark:border-white/10 bg-neutral-50 shadow-sm dark:bg-neutral-900 dark:shadow-none hover:bg-neutral-100 hover:shadow-md dark:hover:bg-neutral-800 dark:hover:shadow-none" />
        <CarouselNext className="right-0 size-10 border-neutral-200/60 dark:border-white/10 bg-neutral-50 shadow-sm dark:bg-neutral-900 dark:shadow-none hover:bg-neutral-100 hover:shadow-md dark:hover:bg-neutral-800 dark:hover:shadow-none" />
      </Carousel>
    </section>
  );
}

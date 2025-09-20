import type {
  QueryPlaylistBySlugResult,
  QueryStartupsByAuthorResult,
  QueryStartupsByCategoryResult,
  QueryStartupsByUpvotesResult,
  QueryStartupsByViewsResult,
  QueryStartupsResult,
  QueryTopStartupsResult,
} from "@workspace/sanity/types";
import { Skeleton } from "@workspace/ui/components/skeleton";
import { Eye, Flame } from "lucide-react";
import Link from "next/link";

import { SanityImage } from "@/components/elements/sanity-image";

/** Single startup item from any of the list queries. */
export type StartupCardItem =
  | QueryStartupsResult[number]
  | QueryStartupsByAuthorResult[number]
  | QueryStartupsByCategoryResult[number]
  | QueryStartupsByUpvotesResult[number]
  | QueryStartupsByViewsResult[number]
  | QueryTopStartupsResult[number]
  | NonNullable<NonNullable<QueryPlaylistBySlugResult>["select"]>[number];

/**
 * Card for a single startup pitch.
 * Cover image with gradient overlay, category badge, stats, and author row.
 */
export function StartupCard({ post }: { post: StartupCardItem }) {
  const { _id, title, category, description, image } = post;

  const createdAt = "_createdAt" in post ? (post._createdAt as string) : null;
  const author = "author" in post ? post.author : null;
  const views = "views" in post ? (post.views as number | null) : null;
  const upvotes = "upvotes" in post ? (post.upvotes as number | null) : null;

  const formattedDate = createdAt
    ? new Date(createdAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <article className="group relative h-full overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200/80 transition duration-300 hover:ring-pink-300/60 hover:shadow-lg hover:shadow-pink-500/5 dark:bg-neutral-900 dark:ring-white/10 dark:hover:ring-pink-500/30 dark:hover:shadow-pink-500/10">
      <Link href={`/startup/${_id}`} className="flex h-full flex-col">
        {/* Cover image */}
        <div className="relative aspect-video w-full overflow-hidden">
          <SanityImage
            image={image}
            className="size-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
            alt={title}
          />

          {/* Dark gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

          {/* Category badge */}
          {category && (
            <span className="absolute top-3 left-3 rounded-full bg-pink-500/90 px-2.5 py-0.5 text-xs font-semibold text-white backdrop-blur-sm">
              {category}
            </span>
          )}

          {/* Stats row on image */}
          {(views != null || upvotes != null) && (
            <div className="absolute top-3 right-3 flex items-center gap-2">
              {upvotes != null && (
                <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                  <Flame className="size-3" fill="currentColor" />
                  {upvotes}
                </span>
              )}
              {views != null && (
                <span className="flex items-center gap-1 rounded-full bg-black/40 px-2 py-0.5 text-xs font-medium text-white backdrop-blur-sm">
                  <Eye className="size-3" />
                  {views}
                </span>
              )}
            </div>
          )}

          {/* Title on image */}
          <div className="absolute inset-x-0 bottom-0 px-4 pb-3">
            <h3 className="text-lg font-bold leading-snug tracking-tight text-white drop-shadow-sm">
              {title}
            </h3>
          </div>
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col px-4 pt-3 pb-4">
          {/* Description */}
          {description && (
            <p className="line-clamp-2 text-sm leading-relaxed text-neutral-500 dark:text-white/50">
              {description}
            </p>
          )}

          {/* Author + Date */}
          <div className="mt-auto flex items-center justify-between pt-3">
            {author ? (
              <div className="flex items-center gap-2">
                <div className="size-6 shrink-0 overflow-hidden rounded-full ring-1 ring-neutral-200 dark:ring-white/10">
                  {author.image ? (
                    <SanityImage
                      image={author.image}
                      className="size-full object-cover"
                      alt={author.name}
                    />
                  ) : (
                    <div className="flex size-full items-center justify-center bg-neutral-100 text-xs font-medium text-neutral-500 dark:bg-neutral-800 dark:text-white/50">
                      {author.name?.charAt(0)}
                    </div>
                  )}
                </div>
                <span className="text-xs font-medium text-neutral-600 dark:text-white/60">
                  {author.name}
                </span>
              </div>
            ) : (
              <span />
            )}
            {formattedDate && (
              <span className="text-xs text-neutral-400 dark:text-white/30">
                {formattedDate}
              </span>
            )}
          </div>
        </div>
      </Link>
    </article>
  );
}

/** Skeleton placeholder while startup cards are loading. */
export function StartupCardSkeleton() {
  return (
    <div className="overflow-hidden rounded-2xl bg-white ring-1 ring-neutral-200/80 dark:bg-neutral-900 dark:ring-white/10">
      <Skeleton className="aspect-video w-full rounded-none bg-neutral-100 dark:bg-white/5" />
      <div className="p-4">
        <Skeleton className="h-4 w-full bg-neutral-100 dark:bg-white/5" />
        <Skeleton className="mt-1.5 h-4 w-3/4 bg-neutral-100 dark:bg-white/5" />
        <div className="mt-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Skeleton className="size-6 rounded-full bg-neutral-100 dark:bg-white/5" />
            <Skeleton className="h-3 w-16 bg-neutral-100 dark:bg-white/5" />
          </div>
          <Skeleton className="h-3 w-16 bg-neutral-100 dark:bg-white/5" />
        </div>
      </div>
    </div>
  );
}

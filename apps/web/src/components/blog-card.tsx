import { ArrowRight, Clock } from "lucide-react";
import Link from "next/link";

import type { Blog } from "@/types";
import { SanityImage } from "./elements/sanity-image";

type BlogCardProps = {
  blog: Blog;
};

/** Estimate reading time from description length. */
function readingTime(description: string | null): string {
  const words = (description ?? "").split(/\s+/).length;
  const mins = Math.max(3, Math.ceil(words / 40));
  return `${mins} min read`;
}

/**
 * Blog card — editorial style with image, metadata pill, title hover effect.
 */
export function BlogCard({ blog }: BlogCardProps) {
  if (!blog) {
    return (
      <article className="overflow-hidden rounded-2xl border border-neutral-200/60 bg-gradient-to-b from-neutral-50 to-white shadow-sm dark:border-white/10 dark:bg-neutral-900 dark:from-neutral-900 dark:to-neutral-900 dark:shadow-none">
        <div className="aspect-video w-full animate-pulse bg-neutral-100 dark:bg-white/5" />
        <div className="p-5">
          <div className="h-3 w-24 animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
          <div className="mt-3 h-5 w-full animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
          <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
        </div>
      </article>
    );
  }

  const { title, publishedAt, slug, description, image } = blog;

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
      })
    : null;

  return (
    <article className="group relative flex flex-col overflow-hidden rounded-2xl border border-neutral-200/60 bg-white/80 shadow-sm backdrop-blur-sm transition duration-300 hover:border-pink-500/20 hover:shadow-md hover:bg-neutral-50/80 dark:border-white/10 dark:bg-neutral-900/60 dark:shadow-none dark:hover:bg-neutral-800/60 dark:hover:shadow-none">
      <Link href={slug ?? "#"} className="flex flex-1 flex-col">
        {/* Cover image */}
        <div className="relative aspect-video w-full overflow-hidden">
          {image?.id ? (
            <SanityImage
              alt={title ?? "Blog post image"}
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              image={image}
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-pink-500/10 to-violet-500/10" />
          )}
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-white via-white/20 to-transparent opacity-80 transition-opacity duration-300 group-hover:opacity-60 dark:from-neutral-900 dark:via-neutral-900/20" />

          {/* Date pill floating on image */}
          {formattedDate && (
            <div className="absolute top-3 left-3 rounded-full border border-neutral-200 bg-black/30 px-3 py-1 text-xs font-medium text-neutral-500 backdrop-blur-md dark:border-white/10 dark:bg-black/50 dark:text-white/70">
              {formattedDate}
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-1 flex-col px-5 pt-4 pb-5">
          {/* Title */}
          <h3 className="text-lg font-semibold leading-snug tracking-tight text-neutral-800 transition duration-300 group-hover:text-pink-400 dark:text-white/90">
            {title}
          </h3>

          {/* Description */}
          {description && (
            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-neutral-400 dark:text-white/40">
              {description}
            </p>
          )}

          {/* Footer */}
          <div className="mt-4 flex items-center justify-between border-t border-neutral-100 pt-3 dark:border-white/5">
            <span className="inline-flex items-center gap-1.5 text-xs text-neutral-300 dark:text-white/25">
              <Clock className="size-3" />
              {readingTime(description)}
            </span>
            <span className="inline-flex items-center gap-1 text-xs font-medium text-neutral-300 transition duration-300 group-hover:text-pink-400 dark:text-white/25">
              Read
              <ArrowRight className="size-3 transition-transform duration-300 group-hover:translate-x-0.5" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

/**
 * Featured blog card — wide editorial layout, no author.
 */
export function FeaturedBlogCard({ blog }: BlogCardProps) {
  const { title, publishedAt, slug, description, image } = blog ?? {};

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric",
      })
    : null;

  return (
    <article className="group relative overflow-hidden rounded-2xl border border-neutral-200/60 bg-white/80 shadow-sm backdrop-blur-sm transition duration-300 hover:border-pink-500/20 hover:shadow-md hover:bg-neutral-50/80 dark:border-white/10 dark:bg-neutral-900/60 dark:shadow-none dark:hover:bg-neutral-800/60 dark:hover:shadow-none">
      <Link href={slug ?? "#"} className="grid grid-cols-1 lg:grid-cols-2">
        {/* Cover image */}
        <div className="relative aspect-video w-full overflow-hidden lg:aspect-auto lg:min-h-72">
          {image?.id ? (
            <SanityImage
              alt={title ?? "Blog post image"}
              className="size-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
              image={image}
            />
          ) : (
            <div className="size-full bg-gradient-to-br from-pink-500/10 to-violet-500/10" />
          )}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-transparent to-white/90 max-lg:hidden dark:to-neutral-900/90" />
          <div className="absolute inset-0 bg-gradient-to-t from-white/50 to-transparent lg:hidden dark:from-neutral-900/50" />
        </div>

        {/* Content */}
        <div className="flex flex-col justify-center p-6 lg:p-8">
          <div className="flex items-center gap-3 text-xs text-neutral-400 dark:text-white/40">
            <span className="rounded-full border border-pink-500/30 bg-pink-500/10 px-2.5 py-0.5 font-medium text-pink-400">
              Featured
            </span>
            {formattedDate && (
              <time dateTime={publishedAt ?? ""}>{formattedDate}</time>
            )}
          </div>
          <h2 className="mt-4 text-2xl font-bold leading-tight tracking-tight text-neutral-800 transition duration-300 group-hover:text-pink-400 lg:text-3xl dark:text-white/90">
            {title}
          </h2>
          {description && (
            <p className="mt-3 line-clamp-3 text-sm leading-relaxed text-neutral-400 lg:text-base dark:text-white/40">
              {description}
            </p>
          )}
          <div className="mt-6">
            <span className="inline-flex items-center gap-2 text-sm font-medium text-neutral-300 transition duration-300 group-hover:text-pink-400 dark:text-white/30">
              Read Article
              <ArrowRight className="size-4 transition-transform duration-300 group-hover:translate-x-1" />
            </span>
          </div>
        </div>
      </Link>
    </article>
  );
}

export function BlogHeader({
  title,
  description,
}: {
  title: string | null;
  description: string | null;
}) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h1 className="text-5xl font-bold tracking-tight md:text-6xl">
        {title ?? (
          <>
            The <span className="text-pink-400">Blog</span>
          </>
        )}
      </h1>
      {description && (
        <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-500 dark:text-white/50">
          {description}
        </p>
      )}
    </div>
  );
}

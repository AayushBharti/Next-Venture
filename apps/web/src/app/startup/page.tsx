import type { Metadata } from "next";

import { sanityFetch } from "@workspace/sanity/live";
import {
  queryAllCategoriesWithCount,
  queryStartups,
  queryStartupsByUpvotes,
  queryStartupsByViews,
} from "@workspace/sanity/query";
import { Rocket } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

import { getSEOMetadata } from "@/lib/seo";
import { Tag } from "@/components/shared/tag";
import { StartupSearch } from "@/components/startup/startup-search";

export function generateMetadata(): Metadata {
  return getSEOMetadata({
    title: "All Startup Pitches",
    description:
      "Browse innovative startup pitches from founders across every industry. Filter by category or search for something specific.",
    slug: "/startup",
  });
}

type Props = {
  searchParams: Promise<{ sort?: string; query?: string }>;
};

/**
 * All startups page with category filters, sorting, and fuzzy search.
 */
export default async function StartupsPage({ searchParams }: Props) {
  const { sort = "recent" } = await searchParams;

  const startupsQuery =
    sort === "upvotes"
      ? queryStartupsByUpvotes
      : sort === "views"
        ? queryStartupsByViews
        : queryStartups;

  const [{ data: startups }, { data: categories }] = await Promise.all([
    sanityFetch({ query: startupsQuery }),
    sanityFetch({ query: queryAllCategoriesWithCount }),
  ]);

  return (
    <main className="min-h-screen pb-24">
      {/* ── Hero ── */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-pink-500/5 via-transparent to-transparent" />
        <div className="mx-auto max-w-5xl px-6 text-center">
          <Tag>All Pitches</Tag>
          <h1 className="mt-6 text-5xl font-bold tracking-tight md:text-6xl">
            Discover Startup <span className="text-pink-400">Pitches</span>
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-neutral-500 dark:text-white/50">
            Browse innovative ideas from founders across every industry. Filter
            by category or search for something specific.
          </p>
        </div>
      </section>

      {/* ── Categories ── */}
      <section className="mx-auto max-w-5xl px-6 pb-12">
        <div className="flex flex-wrap justify-center gap-3">
          <Link
            href="/startup"
            className="inline-flex items-center gap-2 rounded-full border border-neutral-200/60 dark:border-white/10 bg-neutral-50 shadow-sm dark:bg-white/5 dark:shadow-none px-4 py-2 text-sm font-medium text-neutral-600 dark:text-white/80 transition hover:border-pink-500/30 hover:bg-pink-500/10 hover:text-pink-400 hover:shadow-md dark:hover:shadow-none"
          >
            <Rocket className="size-4" />
            All
            <span className="ml-1 text-xs text-neutral-300 dark:text-white/30">
              {startups.length}
            </span>
          </Link>
          {categories.map((cat) => (
            <Link
              key={cat._id}
              href={`/category/${cat.slug}`}
              className="inline-flex items-center gap-2 rounded-full border border-neutral-200/60 dark:border-white/10 bg-neutral-50 shadow-sm dark:bg-white/5 dark:shadow-none px-4 py-2 text-sm font-medium text-neutral-600 dark:text-white/80 transition hover:border-pink-500/30 hover:bg-pink-500/10 hover:text-pink-400 hover:shadow-md dark:hover:shadow-none"
            >
              {cat.title}
              {cat.count > 0 && (
                <span className="text-xs text-neutral-300 dark:text-white/30">
                  {cat.count}
                </span>
              )}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Sort ── */}
      <section className="mx-auto max-w-5xl px-6 pb-8">
        <div className="flex items-center justify-center gap-2">
          {[
            { value: "recent", label: "Recent" },
            { value: "upvotes", label: "Most Upvoted" },
            { value: "views", label: "Most Viewed" },
          ].map((option) => (
            <Link
              key={option.value}
              href={`/startup?sort=${option.value}`}
              className={`rounded-full px-4 py-1.5 text-sm font-medium transition ${
                sort === option.value
                  ? "bg-pink-500/20 text-pink-400 ring-1 ring-pink-500/30"
                  : "text-neutral-400 hover:text-pink-400 dark:text-white/40 dark:hover:text-pink-400"
              }`}
            >
              {option.label}
            </Link>
          ))}
        </div>
      </section>

      {/* ── Search + Grid ── */}
      <section className="mx-auto max-w-6xl px-6">
        <Suspense>
          <StartupSearch startups={startups} />
        </Suspense>
      </section>
    </main>
  );
}

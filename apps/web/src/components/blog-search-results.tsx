"use client";

import { cn } from "@workspace/ui/lib/utils";

import { BlogList } from "@/components/blog-list";
import type { Blog } from "@/types";

type BlogSearchResultsProps = {
  className?: string;
  results: Blog[];
  isSearching: boolean;
  hasQuery: boolean;
  searchQuery: string;
  error?: Error | null;
};

function SearchResultsHeader({
  query,
  count,
}: {
  query: string;
  count: number;
}) {
  return (
    <div className="mb-6">
      <h2 className="text-lg font-semibold">
        Search Results for &ldquo;{query}&rdquo;
      </h2>
      <p className="text-sm text-neutral-400 dark:text-white/40">
        {count === 0
          ? "No articles found"
          : `${count} article${count === 1 ? "" : "s"} found`}
      </p>
    </div>
  );
}

function EmptySearchState({ query }: { query: string }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 dark:border-white/10 py-24">
      <p className="text-lg font-medium text-neutral-400 dark:text-white/40">
        No articles matching &ldquo;{query}&rdquo;
      </p>
      <p className="mt-2 text-sm text-neutral-300 dark:text-white/25">
        Try different keywords or more general terms
      </p>
    </div>
  );
}

function ErrorState({ query }: { query: string }) {
  return (
    <div className="py-12 text-center">
      <div className="mx-auto max-w-md">
        <h3 className="mb-2 font-medium text-destructive text-lg">
          Search failed
        </h3>
        <p className="mb-4 text-muted-foreground">
          We encountered an error while searching for "{query}". Please try
          again.
        </p>
        <div className="text-muted-foreground text-sm">
          <p>If the problem persists:</p>
          <ul className="mt-2 space-y-1">
            <li>• Check your internet connection</li>
            <li>• Refresh the page</li>
            <li>• Try again in a few moments</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

const LOADING_SKELETONS = [
  "skeleton-1",
  "skeleton-2",
  "skeleton-3",
  "skeleton-4",
  "skeleton-5",
  "skeleton-6",
] as const;

function LoadingState() {
  return (
    <div className="space-y-6">
      <div className="mb-6">
        <div className="mb-2 h-6 w-48 animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
        <div className="h-4 w-32 animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
      </div>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {LOADING_SKELETONS.map((id) => (
          <div
            className="overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-white/10 bg-gradient-to-b from-neutral-50 to-white shadow-sm dark:from-neutral-900 dark:to-neutral-900 dark:shadow-none"
            key={id}
          >
            <div className="aspect-video w-full animate-pulse bg-neutral-100 dark:bg-white/5" />
            <div className="p-5">
              <div className="h-3 w-24 animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
              <div className="mt-3 h-5 w-full animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function BlogSearchResults({
  className,
  results,
  isSearching,
  hasQuery,
  searchQuery,
  error,
}: BlogSearchResultsProps) {
  if (!hasQuery) {
    return null;
  }

  if (isSearching) {
    return (
      <section className={cn("mt-8", className)}>
        <LoadingState />
      </section>
    );
  }

  return (
    <section className={cn("mt-8", className)}>
      <SearchResultsHeader count={results.length} query={searchQuery} />

      {error ? (
        <ErrorState query={searchQuery} />
      ) : results.length === 0 ? (
        <EmptySearchState query={searchQuery} />
      ) : (
        <BlogList blogs={results} />
      )}
    </section>
  );
}

"use client";

import type { QueryBlogIndexPageDataResult } from "@workspace/sanity/types";
import { Search, X } from "lucide-react";

import { BlogHeader } from "@/components/blog-card";
import { BlogPagination } from "@/components/blog-pagination";
import { BlogSearchResults } from "@/components/blog-search-results";
import { BlogSection } from "@/components/blog-section";
import { PageBuilder } from "@/components/pagebuilder";
import { Tag } from "@/components/shared/tag";
import { useBlogSearch } from "@/hooks/use-blog-search";
import type { Blog } from "@/types";
import type { PaginationMetadata } from "@/utils";

type BlogPageContentProps = {
  indexPageData: NonNullable<QueryBlogIndexPageDataResult>;
  blogs: Blog[];
  paginationMetadata: PaginationMetadata;
};

export function BlogPageContent({
  indexPageData,
  blogs,
  paginationMetadata,
}: BlogPageContentProps) {
  const {
    title,
    description,
    pageBuilder = [],
    _id,
    _type,
    featuredBlogsCount,
    displayFeaturedBlogs,
  } = indexPageData;

  const { searchQuery, setSearchQuery, results, isSearching, hasQuery, error } =
    useBlogSearch();

  const validFeaturedBlogsCount = featuredBlogsCount
    ? Number.parseInt(featuredBlogsCount, 10)
    : 0;

  const shouldDisplayFeaturedBlogs =
    displayFeaturedBlogs &&
    validFeaturedBlogsCount > 0 &&
    paginationMetadata.currentPage === 1 &&
    !hasQuery;

  const featuredBlogs = shouldDisplayFeaturedBlogs
    ? blogs.slice(0, validFeaturedBlogsCount)
    : [];

  const remainingBlogs = shouldDisplayFeaturedBlogs
    ? blogs.slice(validFeaturedBlogsCount)
    : blogs;

  return (
    <main className="min-h-screen pb-24">
      {/* Hero */}
      <section className="relative overflow-hidden pt-32 pb-16">
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-pink-500/5 via-transparent to-transparent" />
        <div className="pointer-events-none absolute inset-0 opacity-5 [background-image:linear-gradient(to_right,white_1px,transparent_1px),linear-gradient(to_bottom,white_1px,transparent_1px)] [background-size:4rem_4rem]" />

        <div className="relative mx-auto max-w-5xl px-6 text-center">
          <Tag>Blog</Tag>
          <div className="mt-6">
            <BlogHeader description={description} title={title} />
          </div>

          {/* Search */}
          <div className="mx-auto mt-8 max-w-lg">
            <div className="relative">
              <Search className="pointer-events-none absolute top-1/2 left-4 size-4 -translate-y-1/2 text-neutral-300 dark:text-white/30" />
              <input
                className="h-12 w-full rounded-xl border border-neutral-200 dark:border-white/10 bg-neutral-100 dark:bg-white/5 pr-10 pl-11 text-sm text-neutral-900 dark:text-white placeholder:text-neutral-300 dark:placeholder:text-white/30 outline-none backdrop-blur-sm transition focus:border-pink-500/30 focus:bg-white dark:focus:bg-white/10 focus:ring-1 focus:ring-pink-500/20"
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search articles..."
                value={searchQuery}
              />
              {searchQuery && (
                <button
                  aria-label="Clear search"
                  className="absolute top-1/2 right-3 -translate-y-1/2 rounded-sm p-1 text-neutral-300 dark:text-white/30 transition-colors hover:text-neutral-900 dark:hover:text-white"
                  onClick={() => setSearchQuery("")}
                  type="button"
                >
                  <X className="size-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="mx-auto max-w-6xl px-6">
        {hasQuery ? (
          <BlogSearchResults
            error={error}
            hasQuery={hasQuery}
            isSearching={isSearching}
            results={results}
            searchQuery={searchQuery}
          />
        ) : (
          <>
            <BlogSection
              blogs={featuredBlogs}
              isFeatured
              title="Featured Posts"
            />
            <BlogSection blogs={remainingBlogs} title="All Posts" />
            {paginationMetadata?.totalPages > 1 && (
              <BlogPagination
                className="mt-12 flex justify-center"
                currentPage={paginationMetadata.currentPage}
                hasNextPage={paginationMetadata.hasNextPage}
                hasPreviousPage={paginationMetadata.hasPreviousPage}
                totalPages={paginationMetadata.totalPages}
              />
            )}
          </>
        )}
      </section>

      {pageBuilder && pageBuilder.length > 0 && (
        <PageBuilder id={_id} pageBuilder={pageBuilder} type={_type} />
      )}
    </main>
  );
}

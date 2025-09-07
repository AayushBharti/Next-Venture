import { BlogCard } from "@/components/blog-card";
import type { Blog } from "@/types";

export type BlogListProps = {
  blogs: Blog[];
  isLoading?: boolean;
};

export function BlogList({ blogs, isLoading = false }: BlogListProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {Array.from({ length: 6 }).map((_, index) => (
          <article
            className="overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-white/10 bg-gradient-to-b from-neutral-50 to-white shadow-sm dark:from-neutral-900 dark:to-neutral-900 dark:shadow-none"
            key={`skeleton-${index.toString()}`}
          >
            <div className="aspect-video w-full animate-pulse bg-neutral-100 dark:bg-white/5" />
            <div className="p-5">
              <div className="h-3 w-24 animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
              <div className="mt-3 h-5 w-full animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
              <div className="mt-2 h-4 w-3/4 animate-pulse rounded bg-neutral-100 dark:bg-white/5" />
            </div>
          </article>
        ))}
      </div>
    );
  }

  if (blogs.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-3xl border border-dashed border-neutral-200 dark:border-white/10 py-24">
        <p className="text-lg font-medium text-neutral-400 dark:text-white/40">
          No blog posts available yet
        </p>
        <p className="mt-2 text-sm text-neutral-300 dark:text-white/25">
          Check back soon for new articles
        </p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {blogs.map((blog) => (
        <BlogCard blog={blog} key={blog._id} />
      ))}
    </div>
  );
}

import { Logger } from "@workspace/logger";
import { client } from "@workspace/sanity/client";
import { sanityFetch } from "@workspace/sanity/live";
import { queryBlogPaths, queryBlogSlugPageData } from "@workspace/sanity/query";
import { ArrowLeft, Clock } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { RichText } from "@/components/elements/rich-text";
import { SanityImage } from "@/components/elements/sanity-image";
import { TableOfContent } from "@/components/elements/table-of-content";
import { ArticleJsonLd } from "@/components/json-ld";
import { getSEOMetadata } from "@/lib/seo";

const logger = new Logger("BlogSlug");

async function fetchBlogSlugPageData(slug: string) {
  return await sanityFetch({
    query: queryBlogSlugPageData,
    params: { slug },
  });
}

async function fetchBlogPaths() {
  try {
    const slugs = await client.fetch(queryBlogPaths);

    if (!Array.isArray(slugs) || slugs.length === 0) {
      return [];
    }

    const paths: { slug: string }[] = [];
    for (const slug of slugs) {
      if (!slug) {
        continue;
      }
      const [, , path] = slug.split("/");
      if (path) {
        paths.push({ slug: path });
      }
    }
    return paths;
  } catch (error) {
    logger.error("Error fetching blog paths", error);
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugString = `/blog/${slug}`;
  const { data } = await fetchBlogSlugPageData(slugString);
  return getSEOMetadata({
    title: data?.title ?? data?.seoTitle,
    description: data?.description ?? data?.seoDescription,
    slug: slugString,
    contentId: data?._id,
    contentType: data?._type,
    pageType: "article",
  });
}

export async function generateStaticParams() {
  const paths = await fetchBlogPaths();
  return paths;
}

export const dynamicParams = true;

export default async function BlogSlugPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const slugString = `/blog/${slug}`;
  const { data } = await fetchBlogSlugPageData(slugString);
  if (!data) {
    return notFound();
  }

  const { title, description, image, richText, publishedAt } = data ?? {};

  const formattedDate = publishedAt
    ? new Date(publishedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : null;

  return (
    <main className="min-h-screen pb-24">
      <ArticleJsonLd article={data} />

      <div className="mx-auto max-w-6xl px-6 pt-28">
        <div className="flex gap-10 lg:gap-16">
          {/* Left sidebar — ToC (sticky) */}
          <aside className="hidden w-56 shrink-0 lg:block">
            <div className="sticky top-28">
              <Link
                href="/blog"
                className="mb-8 inline-flex items-center gap-1.5 text-sm text-neutral-400 transition hover:text-pink-400 dark:text-white/40"
              >
                <ArrowLeft className="size-3.5" />
                Back to Blog
              </Link>
              <TableOfContent richText={richText ?? []} />
            </div>
          </aside>

          {/* Main content column */}
          <div className="min-w-0 flex-1">
            {/* Mobile back link */}
            <Link
              href="/blog"
              className="mb-6 inline-flex items-center gap-1.5 text-sm text-neutral-400 transition hover:text-pink-400 dark:text-white/40 lg:hidden"
            >
              <ArrowLeft className="size-3.5" />
              Back to Blog
            </Link>

            {/* Date */}
            <div className="flex items-center gap-4 text-sm text-neutral-400 dark:text-white/40">
              {formattedDate && (
                <time dateTime={publishedAt ?? ""}>{formattedDate}</time>
              )}
              <span className="inline-flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {Math.max(
                  3,
                  Math.ceil((description ?? "").split(/\s+/).length / 40)
                )}{" "}
                min read
              </span>
            </div>

            {/* Title */}
            <h1 className="mt-4 text-3xl font-bold leading-tight tracking-tight sm:text-4xl lg:text-5xl">
              {title}
            </h1>

            {/* Description */}
            {description && (
              <p className="mt-5 text-base leading-relaxed text-neutral-500 sm:text-lg dark:text-white/50">
                {description}
              </p>
            )}

            {/* Cover image */}
            {image && (
              <div className="mt-8 overflow-hidden rounded-2xl">
                <SanityImage
                  alt={title}
                  className="aspect-video w-full object-cover"
                  image={image}
                  loading="eager"
                />
              </div>
            )}

            {/* Divider */}
            <div className="mt-10 h-px bg-neutral-200 dark:bg-white/10" />

            {/* Article body */}
            <article className="mt-10">
              <RichText
                richText={richText}
                className="prose-lg dark:prose-invert prose-headings:font-bold prose-headings:tracking-tight prose-h2:text-2xl prose-h2:mt-10 prose-h2:mb-4 prose-h2:border-none prose-h3:text-xl prose-h3:mt-8 prose-p:text-neutral-600 prose-p:leading-relaxed dark:prose-p:text-white/60 prose-a:text-pink-500 dark:prose-a:text-pink-400 prose-a:no-underline hover:prose-a:underline prose-strong:text-neutral-800 dark:prose-strong:text-white/80 prose-blockquote:border-l-pink-500/40 prose-blockquote:text-neutral-500 dark:prose-blockquote:text-white/45 prose-blockquote:not-italic prose-code:text-pink-600 dark:prose-code:text-pink-300 prose-code:bg-neutral-100 dark:prose-code:bg-white/5 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:before:content-none prose-code:after:content-none prose-li:text-neutral-600 dark:prose-li:text-white/60 prose-li:marker:text-pink-400/60 prose-hr:border-neutral-200 dark:prose-hr:border-white/10"
              />
            </article>
          </div>
        </div>
      </div>
    </main>
  );
}

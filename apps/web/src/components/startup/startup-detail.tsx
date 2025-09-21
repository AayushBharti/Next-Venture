import type { QueryStartupByIdResult } from "@workspace/sanity/types";
import { Calendar, Clock, Eye } from "lucide-react";
import markdownit from "markdown-it";
import Link from "next/link";

import { SanityImage } from "@/components/elements/sanity-image";
import { AiAnalysisPanel } from "./ai-analysis-panel";
import { ShareButton } from "./share-button";
import { UpvoteButton } from "./upvote-button";

const md = markdownit({
  html: false,
  linkify: true,
  typographer: true,
});

type Startup = NonNullable<QueryStartupByIdResult>;
type Author = NonNullable<Startup["author"]>;

type Props = {
  startup: Startup;
  children?: React.ReactNode;
};

// ── Prose class string (extracted to keep JSX readable) ──

const PROSE_CLASSES =
  "prose prose-lg dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-h2:mt-14 prose-h2:mb-5 prose-h2:text-2xl prose-h3:mt-10 prose-h3:mb-4 prose-p:leading-relaxed prose-p:text-neutral-600 dark:prose-p:text-white/65 prose-a:text-pink-500 prose-a:underline prose-a:decoration-pink-500/30 prose-a:underline-offset-2 hover:prose-a:decoration-pink-500 prose-strong:text-neutral-800 dark:prose-strong:text-white prose-ul:text-neutral-600 dark:prose-ul:text-white/65 prose-ol:text-neutral-600 dark:prose-ol:text-white/65 prose-li:marker:text-pink-400/50 prose-code:rounded-md prose-code:bg-neutral-100 dark:prose-code:bg-white/8 prose-code:px-1.5 prose-code:py-0.5 prose-code:text-sm prose-code:text-pink-500 dark:prose-code:text-pink-400 prose-code:before:content-none prose-code:after:content-none prose-pre:rounded-xl prose-pre:border prose-pre:border-neutral-200 dark:prose-pre:border-white/10 prose-pre:bg-neutral-50 dark:prose-pre:bg-neutral-900 prose-blockquote:not-italic prose-blockquote:border-l-2 prose-blockquote:border-pink-500/50 prose-blockquote:pl-5 prose-blockquote:text-neutral-500 dark:prose-blockquote:text-white/50 prose-hr:border-neutral-200 dark:prose-hr:border-white/10 prose-img:rounded-xl";

// ── Sub-components ──

/** Author avatar — Sanity image with gradient initial fallback. */
function AuthorAvatar({
  author,
  size,
}: {
  author: Author;
  size: "sm" | "lg";
}) {
  const sizeClass = size === "sm" ? "size-7" : "size-14";
  const textClass = size === "sm" ? "text-xs" : "text-lg";

  return (
    <div className={`${sizeClass} overflow-hidden rounded-full`}>
      {author.image ? (
        <SanityImage
          image={author.image}
          className="size-full object-cover"
          alt={author.name}
        />
      ) : (
        <div
          className={`flex size-full items-center justify-center bg-gradient-to-br from-pink-500 to-orange-400 ${textClass} font-bold text-white`}
        >
          {author.name?.charAt(0)}
        </div>
      )}
    </div>
  );
}

/** Pill-shaped author chip for the metadata bar. */
function AuthorChip({ author }: { author: Author }) {
  return (
    <Link
      href={`/user/${author._id}`}
      className="group flex items-center gap-2 rounded-full bg-neutral-50 py-1 pl-1 pr-3.5 ring-1 ring-neutral-200/70 transition hover:ring-pink-300/50 dark:bg-white/5 dark:ring-white/10 dark:hover:ring-pink-500/30"
    >
      <AuthorAvatar author={author} size="sm" />
      <span className="text-sm font-medium text-neutral-700 transition group-hover:text-pink-500 dark:text-white/70 dark:group-hover:text-pink-400">
        {author.name}
      </span>
    </Link>
  );
}

/** Sticky sidebar card for the pitch author. */
function AuthorSidebar({ author }: { author: Author }) {
  return (
    <aside className="lg:w-72 lg:shrink-0">
      <div className="sticky top-28 overflow-hidden rounded-2xl border border-neutral-200/60 dark:border-white/10">
        {/* Gradient accent bar */}
        <div className="h-1 bg-gradient-to-r from-pink-500 via-orange-400 to-pink-500" />

        <div className="bg-gradient-to-b from-neutral-50/80 to-white p-6 dark:from-white/[0.04] dark:to-transparent">
          <p className="mb-5 text-xs font-semibold uppercase tracking-widest text-neutral-400 dark:text-white/25">
            Pitched by
          </p>

          <Link href={`/user/${author._id}`} className="group block">
            <div className="mb-4 ring-2 ring-neutral-200 transition group-hover:ring-pink-400/50 dark:ring-white/10 dark:group-hover:ring-pink-500/40 rounded-full w-fit">
              <AuthorAvatar author={author} size="lg" />
            </div>

            <p className="text-base font-semibold text-neutral-900 transition group-hover:text-pink-500 dark:text-white">
              {author.name}
            </p>
            {author.username && (
              <p className="mt-0.5 text-sm text-neutral-400 dark:text-white/35">
                @{author.username}
              </p>
            )}
          </Link>

          {author.bio && (
            <p className="mt-3 text-sm leading-relaxed text-neutral-500 dark:text-white/45">
              {author.bio}
            </p>
          )}

          <Link
            href={`/user/${author._id}`}
            className="mt-5 inline-flex text-sm font-medium text-pink-500 transition hover:text-pink-600 dark:text-pink-400 dark:hover:text-pink-300"
          >
            View all pitches &rarr;
          </Link>
        </div>
      </div>
    </aside>
  );
}

/** Builds the AiAnalysisPanel props from raw startup data. */
function AiAnalysisSection({ startup }: { startup: Startup }) {
  const ai = startup.aiAnalysis;
  if (ai?.overallScore == null) return null;

  return (
    <div className="mb-12">
      <AiAnalysisPanel
        analysis={{
          overallScore: ai.overallScore,
          clarity: {
            score: ai.clarity?.score ?? 0,
            feedback: ai.clarity?.feedback ?? "",
          },
          marketPositioning: {
            score: ai.marketPositioning?.score ?? 0,
            feedback: ai.marketPositioning?.feedback ?? "",
          },
          uniqueness: {
            score: ai.uniqueness?.score ?? 0,
            feedback: ai.uniqueness?.feedback ?? "",
          },
          suggestions:
            ai.suggestions?.filter(
              (s): s is string => typeof s === "string"
            ) ?? [],
          analyzedAt: ai.analyzedAt ?? "",
        }}
      />
    </div>
  );
}

/** Thin vertical separator for metadata items. */
function MetaSeparator() {
  return (
    <span className="hidden h-4 w-px bg-neutral-200 sm:block dark:bg-white/10" />
  );
}

// ── Main component ──

/**
 * Full detail view for a single startup pitch.
 * Editorial layout — contained hero, integrated author chip, refined typography.
 */
export function StartupDetail({ startup, children }: Props) {
  const { title, description, category, image, pitch, author, _createdAt } =
    startup;

  const formattedDate = new Date(_createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const parsedPitch = pitch ? md.render(pitch) : "";

  const wordCount = pitch ? pitch.split(/\s+/).length : 0;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  return (
    <article>
      {/* ── Contained Hero ── */}
      <section className="container px-6 pt-6 md:px-10">
        <div className="relative overflow-hidden rounded-2xl md:rounded-3xl">
          <div className="relative aspect-video w-full">
            <SanityImage
              image={image}
              className="size-full object-cover"
              alt={title}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-black/5" />
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-transparent" />

            <div className="absolute inset-x-0 bottom-0 z-10 p-5 md:p-10 lg:p-14">
              {category && (
                <span className="mb-3 inline-block rounded-full bg-white/15 px-3.5 py-1 text-xs font-bold uppercase tracking-widest text-white backdrop-blur-md md:mb-4">
                  {category}
                </span>
              )}
              <h1 className="max-w-4xl text-2xl font-extrabold leading-tight tracking-tight text-white sm:text-3xl md:text-5xl lg:text-6xl">
                {title}
              </h1>
              {description && (
                <p className="mt-3 max-w-2xl text-sm leading-relaxed text-white/65 md:mt-4 md:text-lg">
                  {description}
                </p>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* ── Metadata Strip ── */}
      <section className="container px-6 md:px-10">
        <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 py-5 dark:border-white/5">
          <div className="flex flex-wrap items-center gap-3">
            {author && <AuthorChip author={author} />}
            <MetaSeparator />
            <span className="inline-flex items-center gap-1.5 text-sm text-neutral-400 dark:text-white/30">
              <Calendar className="size-3.5" />
              {formattedDate}
            </span>
            {startup.views != null && (
              <>
                <MetaSeparator />
                <span className="inline-flex items-center gap-1.5 text-sm text-neutral-400 dark:text-white/30">
                  <Eye className="size-3.5" />
                  {startup.views.toLocaleString()} views
                </span>
              </>
            )}
            {wordCount > 0 && (
              <>
                <MetaSeparator />
                <span className="inline-flex items-center gap-1.5 text-sm text-neutral-400 dark:text-white/30">
                  <Clock className="size-3.5" />
                  {readingTime} min read
                </span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2.5">
            <ShareButton />
            <UpvoteButton
              startupId={startup._id}
              initialCount={startup.upvotes ?? 0}
            />
          </div>
        </div>
      </section>

      {/* ── Content Area ── */}
      <section className="container px-6 pt-10 md:px-10 md:pt-14">
        <div className="flex flex-col gap-14 lg:flex-row">
          <div className="min-w-0 flex-1">
            <AiAnalysisSection startup={startup} />

            {parsedPitch ? (
              <div
                className={PROSE_CLASSES}
                dangerouslySetInnerHTML={{ __html: parsedPitch }}
              />
            ) : (
              <div className="flex items-center justify-center rounded-xl border border-dashed border-neutral-200 py-20 text-neutral-300 dark:border-white/10 dark:text-white/20">
                No pitch details provided yet
              </div>
            )}

            {children}
          </div>

          {author && <AuthorSidebar author={author} />}
        </div>
      </section>
    </article>
  );
}

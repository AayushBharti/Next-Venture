import { SANITY_BASE_URL } from "@workspace/sanity/image";
import { sanityFetch } from "@workspace/sanity/live";
import {
  queryAuthorById,
  queryRecentActivityByAuthor,
  queryStartupsByAuthor,
} from "@workspace/sanity/query";
import { Calendar, MessageCircle, Rocket } from "lucide-react";
import Link from "next/link";
import { notFound } from "next/navigation";

import { auth } from "@/auth";
import { StartupCard } from "@/components/startup/startup-card";
import { UserProfileHero } from "@/components/user/user-profile-hero";
import { getSEOMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const { data: author } = await sanityFetch({
    query: queryAuthorById,
    params: { id },
  });

  return getSEOMetadata({
    title: author?.name ?? "User Profile",
    description:
      author?.bio ??
      `View ${author?.name ?? "this founder"}'s startup pitches on VentureDen.`,
    slug: `/user/${id}`,
  });
}

/**
 * Public profile page for an author.
 * Hero card with avatar, stats bar, recent activity, and startup grid.
 */
export default async function UserProfilePage({ params }: Props) {
  const { id } = await params;
  const session = await auth();
  const sessionId = (session as { id?: string })?.id;

  const [{ data: author }, { data: startups }, { data: activity }] =
    await Promise.all([
      sanityFetch({ query: queryAuthorById, params: { id } }),
      sanityFetch({ query: queryStartupsByAuthor, params: { id } }),
      sanityFetch({ query: queryRecentActivityByAuthor, params: { id } }),
    ]);

  if (!author) {
    notFound();
  }

  const isOwner = sessionId === author._id;

  // Resolve Sanity image asset ref to a CDN URL (e.g. "image-abc-1200x800-jpg" → URL)
  const imageUrl = author.image?.id
    ? `${SANITY_BASE_URL}${(author.image.id as string).replace("image-", "").replace(/-([^-]+)$/, ".$1")}`
    : null;

  const totalViews =
    startups?.reduce(
      (sum, s) => sum + (("views" in s ? (s.views as number) : 0) ?? 0),
      0
    ) ?? 0;
  const totalUpvotes =
    startups?.reduce(
      (sum, s) => sum + (("upvotes" in s ? (s.upvotes as number) : 0) ?? 0),
      0
    ) ?? 0;

  return (
    <main className="min-h-screen pb-16">
      {/* ── Hero banner ── */}
      <UserProfileHero
        author={{
          name: author.name,
          position: author.position ?? null,
          bio: author.bio ?? null,
          imageUrl,
          username: author.username ?? null,
        }}
        isOwner={isOwner}
      />

      {/* ── Stats strip ── */}
      <div className="border-b border-neutral-200 bg-neutral-50/80 dark:border-white/5 dark:bg-white/[0.02]">
        <div className="container flex items-center justify-center gap-8 px-6 py-4 sm:justify-start md:gap-12 md:px-10">
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {startups?.length ?? 0}
            </p>
            <p className="text-xs font-medium text-neutral-500 dark:text-white/40">
              Pitches
            </p>
          </div>
          <div className="h-8 w-px bg-neutral-200 dark:bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {totalUpvotes.toLocaleString()}
            </p>
            <p className="text-xs font-medium text-neutral-500 dark:text-white/40">
              Upvotes
            </p>
          </div>
          <div className="h-8 w-px bg-neutral-200 dark:bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {totalViews.toLocaleString()}
            </p>
            <p className="text-xs font-medium text-neutral-500 dark:text-white/40">
              Views
            </p>
          </div>
          <div className="h-8 w-px bg-neutral-200 dark:bg-white/10" />
          <div className="text-center">
            <p className="text-2xl font-bold text-neutral-900 dark:text-white">
              {activity?.length ?? 0}
            </p>
            <p className="text-xs font-medium text-neutral-500 dark:text-white/40">
              Comments
            </p>
          </div>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="container px-6 pt-10 md:px-10 md:pt-14">
        <div className="flex flex-col gap-14 lg:flex-row">
          {/* Main: Startups */}
          <div className="min-w-0 flex-1">
            <div className="mb-6 flex items-center gap-2.5">
              <div className="flex size-8 items-center justify-center rounded-lg bg-pink-500/10">
                <Rocket className="size-4 text-pink-500" />
              </div>
              <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                Startup Pitches
              </h2>
              {startups && startups.length > 0 && (
                <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold text-neutral-600 dark:bg-white/5 dark:text-white/40">
                  {startups.length}
                </span>
              )}
            </div>

            {startups && startups.length > 0 ? (
              <ul className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                {startups.map((startup) => (
                  <li key={startup._id}>
                    <StartupCard post={startup} />
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-xl border border-dashed border-neutral-200 py-16 text-center dark:border-white/10">
                <Rocket className="mx-auto mb-3 size-8 text-neutral-200 dark:text-white/10" />
                <p className="text-sm text-neutral-400 dark:text-white/30">
                  No pitches yet
                </p>
              </div>
            )}
          </div>

          {/* Sidebar: Recent Activity */}
          <aside className="lg:w-80 lg:shrink-0">
            <div className="sticky top-28">
              <div className="mb-6 flex items-center gap-2.5">
                <div className="flex size-8 items-center justify-center rounded-lg bg-blue-500/10">
                  <MessageCircle className="size-4 text-blue-500" />
                </div>
                <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
                  Recent Activity
                </h2>
              </div>

              {activity && activity.length > 0 ? (
                <div className="space-y-1">
                  {activity.map((item) => {
                    const timeAgo = getTimeAgo(item._createdAt);
                    return (
                      <Link
                        key={item._id}
                        href={`/startup/${item.startup?._id}`}
                        className="group block rounded-xl px-3 py-3 transition hover:bg-neutral-50 dark:hover:bg-white/[0.03]"
                      >
                        <p className="line-clamp-2 text-sm leading-relaxed text-neutral-700 dark:text-white/60">
                          &ldquo;{item.content}&rdquo;
                        </p>
                        <div className="mt-1.5 flex items-center gap-1.5">
                          <span className="text-xs text-neutral-400 dark:text-white/25">
                            on
                          </span>
                          <span className="truncate text-xs font-medium text-pink-500 transition group-hover:text-pink-600 dark:text-pink-400 dark:group-hover:text-pink-300">
                            {item.startup?.title}
                          </span>
                          <span className="text-xs text-neutral-300 dark:text-white/15">
                            &middot;
                          </span>
                          <span className="shrink-0 text-xs text-neutral-400 dark:text-white/25">
                            <Calendar className="mr-0.5 inline size-3" />
                            {timeAgo}
                          </span>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              ) : (
                <div className="rounded-xl border border-dashed border-neutral-200 py-12 text-center dark:border-white/10">
                  <MessageCircle className="mx-auto mb-3 size-8 text-neutral-200 dark:text-white/10" />
                  <p className="text-sm text-neutral-400 dark:text-white/30">
                    No comments yet
                  </p>
                </div>
              )}
            </div>
          </aside>
        </div>
      </div>
    </main>
  );
}

/** Format a date as relative time. */
function getTimeAgo(date: string): string {
  const seconds = Math.floor((Date.now() - new Date(date).getTime()) / 1000);
  if (seconds < 60) return "just now";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `${minutes}m ago`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `${days}d ago`;
  const months = Math.floor(days / 30);
  return `${months}mo ago`;
}

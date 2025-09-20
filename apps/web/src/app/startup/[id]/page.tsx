import { sanityFetch } from "@workspace/sanity/live";
import {
  queryCommentsByStartup,
  queryStartupById,
} from "@workspace/sanity/query";
import { notFound } from "next/navigation";
import { Suspense } from "react";

import { auth } from "@/auth";
import { CommentSection } from "@/components/startup/comment-section";
import { RelatedStartups } from "@/components/startup/related-startups";
import { StartupDetail } from "@/components/startup/startup-detail";
import { ViewsBadge } from "@/components/startup/views-badge";
import { getSEOMetadata } from "@/lib/seo";

type Props = {
  params: Promise<{ id: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { id } = await params;
  const { data: startup } = await sanityFetch({
    query: queryStartupById,
    params: { id },
  });

  return getSEOMetadata({
    title: startup?.title ?? "Startup Pitch",
    description: startup?.description ?? undefined,
    slug: `/startup/${id}`,
    contentId: startup?._id,
    contentType: startup?._type,
  });
}

/**
 * Dynamic route for a single startup pitch.
 * Renders StartupDetail hero + pitch body, followed by related startups.
 * Returns 404 when the startup is not found.
 */
export default async function StartupPage({ params }: Props) {
  const { id } = await params;

  const [{ data: startup }, { data: comments }, session] = await Promise.all([
    sanityFetch({ query: queryStartupById, params: { id } }),
    sanityFetch({ query: queryCommentsByStartup, params: { id } }),
    auth(),
  ]);

  if (!startup) {
    notFound();
  }

  const currentUserId = (session as { id?: string })?.id;

  return (
    <main className="min-h-screen pb-12">
      <StartupDetail startup={startup}>
        <CommentSection
          startupId={id}
          initialComments={comments}
          currentUserId={currentUserId}
        />
      </StartupDetail>
      <Suspense fallback={null}>
        <ViewsBadge id={id} />
      </Suspense>

      {startup.categoryRef && (
        <Suspense fallback={null}>
          <RelatedStartups categoryRef={startup.categoryRef} excludeId={id} />
        </Suspense>
      )}
    </main>
  );
}

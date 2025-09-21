"use client";

import type { QueryCommentsByStartupResult } from "@workspace/sanity/types";
import { MessageCircle } from "lucide-react";
import { useCallback, useState } from "react";

import { CommentCard } from "@/components/startup/comment-card";
import { CommentForm } from "@/components/startup/comment-form";
import { deleteComment } from "@/lib/actions";

interface CommentSectionProps {
  startupId: string;
  initialComments: QueryCommentsByStartupResult;
  currentUserId?: string;
}

/**
 * Full comment section: count header, form, and comment list.
 * Manages optimistic state for creates and deletes.
 */
export function CommentSection({
  startupId,
  initialComments,
  currentUserId,
}: CommentSectionProps) {
  const [comments, setComments] =
    useState<QueryCommentsByStartupResult>(initialComments);

  const handleCommentAdded = useCallback(
    (optimistic: QueryCommentsByStartupResult[number]) => {
      setComments((prev) => [optimistic, ...prev]);
    },
    []
  );

  const handleDelete = useCallback(
    async (commentId: string) => {
      const prev = comments;
      setComments((c) => c.filter((item) => item._id !== commentId));

      const result = await deleteComment(commentId);
      if (!result.ok) {
        setComments(prev);
      }
    },
    [comments]
  );

  return (
    <section className="mt-16 pt-10">
      {/* Divider with label */}
      <div className="mb-10 flex items-center gap-4">
        <div className="h-px flex-1 bg-gradient-to-r from-transparent via-neutral-200 to-transparent dark:via-white/10" />
        <div className="flex items-center gap-2.5">
          <div className="flex size-8 items-center justify-center rounded-lg bg-pink-500/10">
            <MessageCircle className="size-4 text-pink-500" />
          </div>
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">
            Discussion
          </h2>
          <span className="rounded-full bg-neutral-100 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-neutral-500 dark:bg-white/5 dark:text-white/40">
            {comments.length}
          </span>
        </div>
        <div className="h-px flex-1 bg-gradient-to-l from-transparent via-neutral-200 to-transparent dark:via-white/10" />
      </div>

      {/* Form */}
      <div className="mb-10">
        <CommentForm
          startupId={startupId}
          onCommentAdded={handleCommentAdded}
        />
      </div>

      {/* List */}
      {comments.length > 0 ? (
        <div className="space-y-1">
          {comments.map((comment) => (
            <CommentCard
              key={comment._id}
              comment={comment}
              currentUserId={currentUserId}
              onDelete={handleDelete}
            />
          ))}
        </div>
      ) : (
        <div className="rounded-2xl border border-dashed border-neutral-200 py-14 text-center dark:border-white/10">
          <MessageCircle className="mx-auto mb-3 size-8 text-neutral-200 dark:text-white/10" />
          <p className="text-sm text-neutral-400 dark:text-white/30">
            No comments yet. Be the first to share your thoughts!
          </p>
        </div>
      )}
    </section>
  );
}

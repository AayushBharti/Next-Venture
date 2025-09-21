"use client";

import type { QueryCommentsByStartupResult } from "@workspace/sanity/types";
import { Trash2 } from "lucide-react";

import { SanityImage } from "@/components/elements/sanity-image";

type Comment = QueryCommentsByStartupResult[number];

interface CommentCardProps {
  comment: Comment;
  currentUserId?: string;
  onDelete: (commentId: string) => void;
}

/** Format a date as relative time (e.g. "2h ago", "3d ago"). */
function timeAgo(date: string): string {
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

/**
 * Single comment card with author avatar, name, timestamp, content,
 * and a delete button visible only to the comment author.
 */
export function CommentCard({
  comment,
  currentUserId,
  onDelete,
}: CommentCardProps) {
  const isOwner = currentUserId && comment.author?._id === currentUserId;

  return (
    <div className="group flex gap-3.5 rounded-xl px-3 py-4 transition-colors hover:bg-neutral-50 dark:hover:bg-white/[0.02]">
      {/* Avatar */}
      <div className="size-10 shrink-0 overflow-hidden rounded-full bg-neutral-100 ring-1 ring-neutral-200 dark:bg-white/10 dark:ring-white/10">
        {comment.author?.image ? (
          <SanityImage
            image={comment.author.image}
            className="size-full object-cover"
            alt={comment.author.name || ""}
          />
        ) : comment.author?.username ? (
          <img
            src={`https://avatars.githubusercontent.com/${comment.author.username}`}
            alt={comment.author.name || ""}
            className="size-full object-cover"
          />
        ) : (
          <div className="flex size-full items-center justify-center bg-gradient-to-br from-pink-500 to-orange-400 text-xs font-bold text-white">
            {comment.author?.name?.charAt(0) || "?"}
          </div>
        )}
      </div>

      {/* Body */}
      <div className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <span className="text-sm font-semibold text-neutral-900 dark:text-white">
            {comment.author?.name || "Anonymous"}
          </span>
          <span className="text-xs text-neutral-400 dark:text-white/20">
            &middot;
          </span>
          <span className="text-xs text-neutral-400 dark:text-white/30">
            {comment._createdAt ? timeAgo(comment._createdAt) : ""}
          </span>
          {isOwner && (
            <button
              type="button"
              onClick={() => onDelete(comment._id)}
              className="ml-auto rounded-md p-1 text-neutral-400 opacity-0 transition-all hover:bg-red-50 hover:text-red-500 group-hover:opacity-100 dark:text-white/20 dark:hover:bg-red-500/10 dark:hover:text-red-400"
              aria-label="Delete comment"
            >
              <Trash2 className="size-3.5" />
            </button>
          )}
        </div>
        <p className="mt-1 break-words text-sm leading-relaxed text-neutral-600 dark:text-white/60">
          {comment.content}
        </p>
      </div>
    </div>
  );
}

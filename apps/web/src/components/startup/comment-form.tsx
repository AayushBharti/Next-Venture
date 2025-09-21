"use client";

import { signIn, useSession } from "next-auth/react";
import { useState, useTransition } from "react";

import { createComment } from "@/lib/actions";

interface CommentFormProps {
  startupId: string;
  onCommentAdded: (comment: {
    _id: string;
    _createdAt: string;
    content: string;
    author: { _id: string; name: string; username: string | null; image: null };
  }) => void;
}

const MAX_LENGTH = 200;

/**
 * Comment form with character counter.
 * Shows sign-in prompt for unauthenticated users.
 */
export function CommentForm({ startupId, onCommentAdded }: CommentFormProps) {
  const { data: session } = useSession();
  const sessionId = (session as { id?: string })?.id;
  const [content, setContent] = useState("");
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);

  const charCount = content.length;
  const isOverLimit = charCount > MAX_LENGTH;
  const canSubmit = content.trim().length > 0 && !isOverLimit && !isPending;

  if (!session) {
    return (
      <div className="flex items-center justify-center rounded-2xl border border-dashed border-neutral-200 p-8 dark:border-white/10">
        <div className="text-center">
          <p className="mb-3 text-sm text-neutral-500 dark:text-white/50">
            Sign in to join the conversation
          </p>
          <button
            type="button"
            onClick={() => signIn("github")}
            className="inline-flex items-center gap-2 rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white transition hover:bg-neutral-800 dark:bg-white dark:text-neutral-900 dark:hover:bg-white/90"
          >
            <svg
              aria-label="GitHub"
              className="size-4"
              fill="currentColor"
              viewBox="0 0 24 24"
            >
              <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
            </svg>
            Sign in with GitHub
          </button>
        </div>
      </div>
    );
  }

  function handleSubmit() {
    if (!canSubmit || !sessionId) return;
    setError(null);

    const optimisticComment = {
      _id: `temp-${Date.now()}`,
      _createdAt: new Date().toISOString(),
      content: content.trim(),
      author: {
        _id: sessionId,
        name: session?.user?.name ?? "",
        username: null,
        image: null as null,
      },
    };

    onCommentAdded(optimisticComment);
    const submittedContent = content.trim();
    setContent("");

    startTransition(async () => {
      const result = await createComment(startupId, submittedContent);
      if (!result.ok) {
        setError(result.error);
      }
    });
  }

  return (
    <div className="space-y-2">
      <div className="relative">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Share your thoughts on this pitch..."
          rows={3}
          maxLength={MAX_LENGTH + 10}
          className="w-full resize-none rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3.5 text-sm text-neutral-900 transition-colors placeholder:text-neutral-400 focus:border-pink-400 focus:bg-white focus:outline-none focus:ring-1 focus:ring-pink-400 dark:border-white/10 dark:bg-white/[0.03] dark:text-white dark:placeholder:text-white/30 dark:focus:border-pink-500/50 dark:focus:bg-white/5 dark:focus:ring-pink-500/50"
          disabled={isPending}
        />
        <span
          className={`absolute right-3 bottom-3 text-xs ${
            isOverLimit
              ? "text-red-500"
              : charCount > MAX_LENGTH * 0.8
                ? "text-amber-500"
                : "text-neutral-400 dark:text-white/30"
          }`}
        >
          {charCount}/{MAX_LENGTH}
        </span>
      </div>

      <div className="flex items-center justify-between">
        {error ? <p className="text-xs text-red-500">{error}</p> : <span />}
        <button
          type="button"
          onClick={handleSubmit}
          disabled={!canSubmit}
          className="ml-auto rounded-lg bg-pink-500 px-5 py-2 text-sm font-semibold text-white shadow-sm shadow-pink-500/20 transition hover:bg-pink-600 hover:shadow-md hover:shadow-pink-500/25 disabled:opacity-50 disabled:shadow-none disabled:hover:bg-pink-500"
        >
          {isPending ? "Posting..." : "Comment"}
        </button>
      </div>
    </div>
  );
}

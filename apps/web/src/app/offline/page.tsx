export const dynamic = "force-static";

import { RetryButton } from "./retry-button";

export default function OfflinePage() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center px-4 text-center">
      <div className="mb-6 flex size-16 items-center justify-center rounded-2xl bg-linear-to-br from-pink-500 to-purple-600 shadow-lg shadow-pink-500/20">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-8 text-white"
          aria-hidden="true"
        >
          <path d="M12 2L8 10h8l-4-8z" fill="currentColor" opacity="0.9" />
          <path d="M10 10l-2 6 4-3 4 3-2-6H10z" fill="currentColor" />
          <path
            d="M9.5 18l2.5-2 2.5 2-1 3h-3l-1-3z"
            fill="currentColor"
            opacity="0.7"
          />
        </svg>
      </div>
      <h1 className="mb-3 text-2xl font-bold tracking-tight text-neutral-900 dark:text-white">
        You&apos;re offline
      </h1>
      <p className="mb-8 max-w-sm text-neutral-600 dark:text-neutral-400">
        This page isn&apos;t available offline. Check your connection and try
        again.
      </p>
      <RetryButton />
    </div>
  );
}

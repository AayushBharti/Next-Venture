"use client";

/**
 * Reloads the page to retry the failed navigation.
 */
export function RetryButton() {
  return (
    <button
      type="button"
      onClick={() => window.location.reload()}
      className="rounded-lg bg-linear-to-r from-pink-500 to-purple-600 px-6 py-2.5 text-sm font-medium text-white shadow-md shadow-pink-500/20 transition-shadow hover:shadow-lg hover:shadow-pink-500/30"
    >
      Try again
    </button>
  );
}

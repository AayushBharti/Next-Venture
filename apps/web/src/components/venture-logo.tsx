import Link from "next/link";

/**
 * VentureDen brand logo — rocket icon + wordmark.
 */
export function VentureLogo() {
  return (
    <Link href="/" className="group flex items-center gap-2">
      <div className="flex size-7 items-center justify-center rounded-lg bg-gradient-to-br from-pink-500 to-purple-600 shadow-md shadow-pink-500/20 transition-shadow group-hover:shadow-pink-500/30">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="size-4 text-white"
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
      <span className="text-sm font-semibold tracking-tight text-neutral-900 dark:text-white">
        Venture<span className="text-pink-400 ml-1">Pitch</span>
      </span>
    </Link>
  );
}

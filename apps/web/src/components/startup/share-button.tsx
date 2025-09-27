"use client";

import { Check, Link2 } from "lucide-react";
import { useState } from "react";

/** Copy-link share button with success feedback. */
export function ShareButton() {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm justify-center transition ${
        copied
          ? "bg-emerald-50 text-emerald-600 ring-1 ring-emerald-200/60 dark:bg-emerald-500/10 dark:text-emerald-400 dark:ring-emerald-500/20"
          : "bg-white text-neutral-600 shadow-sm ring-1 ring-neutral-200 hover:ring-neutral-300 hover:text-neutral-800 dark:bg-white/5 dark:text-white/50 dark:ring-white/10 dark:hover:ring-white/20 dark:hover:text-white/70 dark:shadow-none"
      }`}
    >
      {copied ? (
        <>
          <Check className="size-4" />
          Copied!
        </>
      ) : (
        <>
          <Link2 className="size-4" />
          Share
        </>
      )}
    </button>
  );
}

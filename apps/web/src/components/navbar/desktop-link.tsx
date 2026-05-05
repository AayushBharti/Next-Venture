import Link from "next/link";

import type { NavColumn } from "@/types";

/** Single top-level nav link (non-dropdown). */
export function DesktopColumnLink({
  column,
}: {
  column: Extract<NavColumn, { type: "link" }>;
}) {
  if (!column.href) return null;

  return (
    <Link
      className="rounded-lg px-3 py-1.5 text-sm text-muted-foreground transition-colors duration-150 hover:text-accent-foreground"
      href={column.href}
    >
      {column.name}
    </Link>
  );
}

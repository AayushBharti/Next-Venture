import Link from "next/link";

import type { MenuLinkProps } from "@/types";
import { SanityIcon } from "./sanity-icon";

export function MenuLink({
  name,
  href,
  description,
  icon,
  onClick,
}: MenuLinkProps) {
  if (!href) return null;

  return (
    <Link
      className="group flex items-center gap-3 rounded-xl px-3 py-2.5 transition-all duration-150 hover:bg-neutral-100 dark:hover:bg-white/5"
      href={href}
      onClick={onClick}
    >
      {icon && (
        <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-neutral-100 dark:bg-white/5 transition-colors group-hover:bg-pink-500/10 group-hover:text-pink-500">
          <SanityIcon
            className="size-4 text-neutral-500 dark:text-white/50 transition-colors group-hover:text-pink-500"
            icon={icon}
          />
        </div>
      )}
      <div className="grid gap-0.5">
        <div className="text-sm font-medium text-neutral-900 dark:text-white leading-none">
          {name}
        </div>
        {description && (
          <div className="line-clamp-1 text-xs text-neutral-500 dark:text-white/40">
            {description}
          </div>
        )}
      </div>
    </Link>
  );
}

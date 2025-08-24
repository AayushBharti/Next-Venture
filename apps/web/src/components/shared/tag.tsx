import { cn } from "@workspace/ui/lib/utils";
import type { HTMLAttributes } from "react";

/**
 * Category pill badge component.
 * Renders children inside a styled pill with a star prefix.
 */
export function Tag(props: HTMLAttributes<HTMLDivElement>) {
  const { className, children, ...otherProps } = props;
  return (
    <div
      className={cn(
        "inline-flex items-center gap-2 rounded-full border border-pink-600/40 px-3 py-1 uppercase text-pink-400",
        className
      )}
      {...otherProps}
    >
      <span>&#10038;</span>
      <span className="text-sm">{children}</span>
    </div>
  );
}

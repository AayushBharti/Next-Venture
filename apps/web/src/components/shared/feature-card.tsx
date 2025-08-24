import { cn } from "@workspace/ui/lib/utils";
import type { ReactNode } from "react";

/**
 * Glass-morphism card container for feature items.
 * Accepts optional children for the visual preview area.
 */
export function FeatureCard(props: {
  title: string;
  description: string;
  children?: ReactNode;
  className?: string;
}) {
  const { title, description, children, className } = props;
  return (
    <div
      className={cn(
        "rounded-3xl border border-neutral-200/60 dark:border-white/10 bg-gradient-to-b from-neutral-50 to-white shadow-sm dark:from-neutral-900 dark:to-neutral-900 dark:shadow-none p-6",
        className
      )}
    >
      <div className="aspect-video">{children}</div>
      <div>
        <h3 className="mt-6 text-3xl font-medium">{title}</h3>
        <p className="mt-2 text-neutral-500 dark:text-white/50">
          {description}
        </p>
      </div>
    </div>
  );
}

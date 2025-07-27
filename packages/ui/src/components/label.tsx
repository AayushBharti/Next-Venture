import { cn } from "@workspace/ui/lib/utils";
import type * as React from "react";

function Label({ className, ...props }: React.ComponentProps<"label">) {
  return (
    // biome-ignore lint/a11y/noLabelWithoutControl: Generic UI primitive — consumer provides htmlFor or wraps input
    <label
      className={cn(
        "text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70",
        className
      )}
      data-slot="label"
      {...props}
    />
  );
}

export { Label };

import { cn } from "@workspace/ui/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { Slot } from "radix-ui";
import type * as React from "react";

const buttonVariants = cva(
  [
    "inline-flex shrink-0 items-center justify-center gap-2 rounded-xl text-sm font-medium whitespace-nowrap",
    "outline-none transition-all duration-200 ease-out",
    "active:scale-95",
    "focus-visible:ring-2 focus-visible:ring-pink-500/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "disabled:pointer-events-none disabled:opacity-40",
    "aria-invalid:border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40",
    "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
  ].join(" "),
  {
    variants: {
      variant: {
        default: [
          "bg-gradient-to-r from-pink-500 to-purple-600 text-white shadow-lg shadow-pink-500/25",
          "hover:from-pink-400 hover:to-purple-500 hover:shadow-xl hover:shadow-pink-500/30",
        ].join(" "),
        destructive: [
          "bg-gradient-to-b from-red-500 to-red-700 text-white shadow-lg shadow-red-500/25",
          "hover:from-red-400 hover:to-red-600 hover:shadow-xl hover:shadow-red-500/35",
        ].join(" "),
        outline: [
          "border border-pink-500/40 bg-transparent text-pink-600 dark:text-pink-300",
          "hover:border-pink-500/60 hover:bg-pink-500/10 hover:text-pink-700 dark:hover:text-pink-200",
        ].join(" "),
        secondary: [
          "bg-purple-500/10 text-purple-700 border border-purple-500/25 dark:text-purple-200 dark:border-purple-500/20",
          "hover:bg-purple-500/20 hover:text-purple-800 hover:border-purple-500/40 dark:hover:text-purple-100 dark:hover:border-purple-500/30",
        ].join(" "),
        ghost: [
          "text-neutral-600 dark:text-white/60",
          "hover:bg-pink-500/10 hover:text-pink-600 dark:hover:text-pink-300",
        ].join(" "),
        link: "text-pink-500 dark:text-pink-400 underline-offset-4 hover:underline hover:text-pink-600 dark:hover:text-pink-300",
        gradient: [
          "bg-gradient-to-r from-fuchsia-500 via-pink-500 to-rose-500 text-white shadow-lg shadow-fuchsia-500/25",
          "hover:from-fuchsia-400 hover:via-pink-400 hover:to-rose-400 hover:shadow-xl hover:shadow-fuchsia-500/35",
        ].join(" "),
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        xs: "h-6 gap-1 rounded-lg px-2 text-xs has-[>svg]:px-1.5 [&_svg:not([class*='size-'])]:size-3",
        sm: "h-8 gap-1.5 rounded-lg px-3 has-[>svg]:px-2.5",
        lg: "h-11 rounded-xl px-6 text-base has-[>svg]:px-4",
        icon: "size-9 rounded-xl",
        "icon-xs": "size-6 rounded-lg [&_svg:not([class*='size-'])]:size-3",
        "icon-sm": "size-8 rounded-lg",
        "icon-lg": "size-10 rounded-xl",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

function Button({
  className,
  variant = "default",
  size = "default",
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean;
  }) {
  const Comp = asChild ? Slot.Root : "button";

  return (
    <Comp
      data-slot="button"
      data-variant={variant}
      data-size={size}
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  );
}

export { Button, buttonVariants };

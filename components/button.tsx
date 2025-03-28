import { cva } from "class-variance-authority"
import React, { ButtonHTMLAttributes } from "react"

const classes = cva("h-12 rounded-full border px-6 font-medium", {
  variants: {
    variant: {
      primary: "border-pink-400 bg-pink-400 text-neutral-950",
      secondary: "border-white bg-transparent text-white",
    },
    size: {
      sm: "h-10",
    },
  },
})

export default function Button(
  props: {
    variant: "primary" | "secondary"
    size?: "sm"
  } & ButtonHTMLAttributes<HTMLButtonElement>,
) {
  const { variant, className, size, ...otherProps } = props
  return (
    <button
      className={classes({
        variant,
        size,
        className,
      })}
      {...otherProps}
    />
  )
}

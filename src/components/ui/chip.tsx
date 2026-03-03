import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const chipVariants = cva(
  "inline-flex items-center justify-center font-medium",
  {
    variants: {
      variant: {
        gray: "bg-gray-200 text-gray-800",
        red: "bg-red-500 text-white",
        yellow: "bg-yellow-400 text-white",
        orange: "bg-orange-500 text-white",
        green: "bg-green-500 text-white",
        blue: "bg-blue-500 text-white",
        primary: "bg-primary text-primary-foreground",
      },
      shape: {
        square: "rounded-md",
        pill: "rounded-full",
      },
      size: {
        sm: "h-6 px-2 text-xs",
        md: "h-7 px-3 text-sm",
      },
    },
    defaultVariants: {
      variant: "gray",
      shape: "square",
      size: "sm",
    },
  }
)

interface ChipProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof chipVariants> {}

const Chip = React.forwardRef<HTMLSpanElement, ChipProps>(
  ({ className, variant, size, shape, ...props }, ref) => {
    return (
      <span ref={ref} className={cn(chipVariants({ variant, size, shape, className }))} {...props} />
    )
  }
)
Chip.displayName = "Chip"

export { Chip }

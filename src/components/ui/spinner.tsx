import * as React from "react"
import { Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"

type SpinnerProps = React.HTMLAttributes<SVGElement> & {
  size?: "sm" | "md" | "lg"
}

const sizeMap: Record<NonNullable<SpinnerProps["size"]>, string> = {
  sm: "h-4 w-4",
  md: "h-5 w-5",
  lg: "h-6 w-6",
}

const Spinner = React.forwardRef<SVGSVGElement, SpinnerProps>(
  ({ className, size = "md", ...props }, ref) => {
    return (
      <Loader2
        ref={ref}
        className={cn("animate-spin text-primary", sizeMap[size], className)}
        {...props}
      />
    )
  }
)
Spinner.displayName = "Spinner"

export { Spinner }

import * as React from "react"

type Status = "completed" | "scheduled" | "failed" | "in-progress"

interface StatusChipProps {
  status: Status
  size?: "sm" | "md"
  shape?: "square" | "pill"
}

const StatusChip: React.FC<StatusChipProps> = ({ status, size = "sm", shape = "square" }) => {
  const base = "inline-flex items-center font-medium"
  const sizes = size === "md" ? "h-7 px-3 text-sm" : "h-6 px-2 text-xs"
  const rounded = shape === "square" ? "rounded-sm" : "rounded-full"

  const styles =
    status === "completed"
      ? "bg-green-100 text-green-600 border border-green-200"
      : status === "scheduled"
        ? "bg-gray-100 text-gray-600 border border-gray-200"
        : status === "in-progress"
          ? "bg-blue-100 text-blue-600 border border-blue-200"
          : "bg-red-100 text-red-600 border border-red-200"

  const label = status === "in-progress" ? "In Progress" : status.charAt(0).toUpperCase() + status.slice(1)

  return <span className={[base, sizes, rounded, styles].join(" ")}>{label}</span>
}

export { StatusChip }

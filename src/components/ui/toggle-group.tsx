
import * as React from "react"
import { cva } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { toggleVariants } from "./toggle"

const toggleGroupVariants = cva("flex items-center justify-center gap-1", {
  variants: {
    variant: {
      default: "bg-transparent",
      outline: "border border-input bg-transparent",
    },
  },
  defaultVariants: {
    variant: "default",
  },
})

type ToggleGroupContextType = {
  type: "single" | "multiple"
  value?: string | string[]
  onValueChange?: (value: string | string[]) => void
}

const ToggleGroupContext = React.createContext<ToggleGroupContextType | undefined>(undefined)

const ToggleGroup = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement> & {
    type?: "single" | "multiple"
    value?: string | string[]
    onValueChange?: (value: string | string[]) => void
    variant?: "default" | "outline"
  }
>(({ 
  className, 
  type = "single", 
  value, 
  onValueChange, 
  variant,
  children, 
  ...props 
}, ref) => {
  const contextValue = React.useMemo(() => ({
    type,
    value,
    onValueChange
  }), [type, value, onValueChange])

  return (
    <ToggleGroupContext.Provider value={contextValue}>
      <div
        ref={ref}
        className={cn(toggleGroupVariants({ variant }), className)}
        {...props}
      >
        {children}
      </div>
    </ToggleGroupContext.Provider>
  )
})
ToggleGroup.displayName = "ToggleGroup"

const useToggleGroupContext = () => {
  const context = React.useContext(ToggleGroupContext)
  if (!context) {
    throw new Error("useToggleGroupContext must be used within a ToggleGroupProvider")
  }
  return context
}

interface ToggleGroupItemProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  value: string
  className?: string
}

const ToggleGroupItem = React.forwardRef<
  HTMLButtonElement,
  ToggleGroupItemProps
>(({ children, className, value, ...props }, ref) => {
  const { type, value: groupValue, onValueChange } = useToggleGroupContext()

  const isSelected = type === "single"
    ? groupValue === value
    : Array.isArray(groupValue) && groupValue.includes(value)

  const handleClick = () => {
    if (!onValueChange) return

    if (type === "single") {
      onValueChange(value)
    } else {
      const newValue = Array.isArray(groupValue)
        ? isSelected
          ? groupValue.filter(v => v !== value)
          : [...groupValue, value]
        : [value]
      onValueChange(newValue)
    }
  }

  return (
    <button
      ref={ref}
      className={cn(
        toggleVariants({ variant: "default" }),
        isSelected && "bg-accent text-accent-foreground",
        className
      )}
      aria-pressed={isSelected}
      onClick={handleClick}
      {...props}
    >
      {children}
    </button>
  )
})
ToggleGroupItem.displayName = "ToggleGroupItem"

export { ToggleGroup, ToggleGroupItem }

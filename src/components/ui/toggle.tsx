import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const toggleVariants = cva(
  "relative inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-6 w-10",
        sm: "h-5 w-9",
        lg: "h-7 w-12",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface NativeToggleProps extends VariantProps<typeof toggleVariants> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  id?: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, NativeToggleProps>(
  ({ checked, defaultChecked, onCheckedChange, variant, size, className, id = "toggle-" + Math.random(), ...props }, ref) => {
    return (
      <label
        htmlFor={id}
        className={cn(toggleVariants({ variant, size, className }), "cursor-pointer")}
      >
        <input
          ref={ref}
          id={id}
          type="checkbox"
          role="switch"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={(e) => {
            onCheckedChange?.(e.target.checked);
            if (navigator.vibrate) navigator.vibrate(50); // Android fallback
          }}
          className="absolute

import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

// Define toggle switch variants for styling consistency
const toggleVariants = cva(
  "relative inline-flex items-center justify-center rounded-md transition-colors select-none ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 px-3",
        sm: "h-9 px-2.5",
        lg: "h-11 px-5",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ToggleProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, "size">,
    VariantProps<typeof toggleVariants> {
  checked?: boolean;
  defaultChecked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  className?: string;
  id?: string;
  "aria-label"?: string;
}

export const Toggle = React.forwardRef<HTMLInputElement, ToggleProps>(
  (
    {
      checked,
      defaultChecked,
      onCheckedChange,
      variant,
      size,
      className,
      disabled,
      id,
      "aria-label": ariaLabel,
      ...props
    },
    ref
  ) => {
    // Android fallback: trigger vibration if supported
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Call user handler first
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
      // Optional: fallback vibration for Android
      const ua = typeof navigator !== "undefined" ? navigator.userAgent : "";
      if (/android/i.test(ua) && "vibrate" in navigator) {
        try { navigator.vibrate && navigator.vibrate(50); } catch {}
      }
      // If user supplied onChange, call that too
      if (props.onChange) props.onChange(e);
    };

    return (
      <label
        className={cn(
          toggleVariants({ variant, size }),
          "cursor-pointer group relative",
          className
        )}
      >
        <input
          ref={ref}
          type="checkbox"
          role="switch"
          id={id}
          aria-label={ariaLabel}
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={handleChange}
          disabled={disabled}
          className={cn(
            // Hide input but keep it visually present & accessible!
            "peer sr-only"
          )}
          {...props}
        />
        {/* Custom slider/track */}
        <span
          aria-hidden="true"
          className={cn(
            // track background
            "block w-11 h-6 rounded-full transition-colors duration-200",
            "bg-muted peer-checked:bg-primary peer-disabled:bg-muted-foreground/40",
            // focus style
            "peer-focus-visible:ring-2 peer-focus-visible:ring-ring peer-focus-visible:ring-offset-2"
          )}
        ></span>
        {/* Slider knob */}
        <span
          aria-hidden="true"
          className={cn(
            "absolute left-0 top-0.5 transition-transform duration-200 pointer-events-none",
            "ml-0.5",
            "w-5 h-5 rounded-full bg-white shadow",
            // move right when checked
            "peer-checked:translate-x-5 peer-checked:bg-primary-foreground",
            "peer-disabled:bg-gray-200"
          )}
        ></span>
      </label>
    );
  }
);

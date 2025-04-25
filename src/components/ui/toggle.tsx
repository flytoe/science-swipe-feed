
import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

export const toggleVariants = cva(
  "inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors hover:bg-muted hover:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default: "bg-transparent",
        outline: "border border-input bg-transparent hover:bg-accent hover:text-accent-foreground",
      },
      size: {
        default: "h-10 w-16",
        sm: "h-8 w-14",
        lg: "h-12 w-20",
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
  (
    {
      checked,
      defaultChecked,
      onCheckedChange,
      variant,
      size,
      className,
      id = "toggle-" + Math.random().toString(36).substring(2),
      ...props
    },
    _ref
  ) => {
    const inputRef = React.useRef<HTMLInputElement>(null);

    React.useEffect(() => {
      if (inputRef.current) {
        inputRef.current.setAttribute("switch", "");
      }
    }, []);

    return (
      <label
        htmlFor={id}
        className={cn(
          "relative inline-flex items-center cursor-pointer select-none",
          toggleVariants({ variant, size, className })
        )}
      >
        <input
          id={id}
          ref={inputRef}
          type="checkbox"
          checked={checked}
          defaultChecked={defaultChecked}
          onChange={(e) => {
            onCheckedChange?.(e.target.checked);
            if ("vibrate" in navigator) {
              navigator.vibrate(50); // Android fallback
            }
          }}
          className="absolute inset-0 w-full h-full opacity-0 z-10 cursor-pointer"
          {...props}
        />
        <span className="w-full h-full bg-muted rounded-full relative transition-colors pointer-events-none peer-checked:bg-accent">
          <span className="absolute left-1 top-1 w-4 h-4 bg-white rounded-full transition-transform pointer-events-none translate-x-0 peer-checked:translate-x-6" />
        </span>
      </label>
    );
  }
);

Toggle.displayName = "Toggle";


import React from 'react';
import { cn } from "@/lib/utils";

interface NativeSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
  className?: string;
}

const NativeSwitch = React.forwardRef<HTMLInputElement, NativeSwitchProps>(
  ({ className, onCheckedChange, checked, ...props }, ref) => {
    return (
      <input
        type="checkbox"
        role="switch"
        ref={ref}
        checked={checked}
        onChange={(e) => onCheckedChange?.(e.target.checked)}
        className={cn(
          "relative w-[51px] h-[31px] bg-gray-200 checked:bg-primary rounded-full appearance-none cursor-pointer",
          "before:content-[''] before:absolute before:top-[2px] before:left-[2px]",
          "before:w-[27px] before:h-[27px] before:rounded-full before:bg-white before:shadow",
          "checked:before:translate-x-[20px] before:transition-transform",
          "outline-none border-none",
          className
        )}
        {...props}
      />
    );
  }
);

NativeSwitch.displayName = "NativeSwitch";

export { NativeSwitch };

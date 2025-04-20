
import React, { useRef, useEffect } from 'react';
import { cn } from "@/lib/utils";

interface NativeSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  onCheckedChange?: (checked: boolean) => void;
  checked?: boolean;
  className?: string;
  enableHaptics?: boolean;
}

const NativeSwitch = React.forwardRef<HTMLInputElement, NativeSwitchProps>(
  ({ className, onCheckedChange, checked, enableHaptics = true, ...props }, ref) => {
    const inputRef = useRef<HTMLInputElement>(null);
    
    // Forward the ref
    useEffect(() => {
      if (ref && typeof ref === 'function') {
        if (inputRef.current) ref(inputRef.current);
      } else if (ref) {
        ref.current = inputRef.current;
      }
    }, [ref]);

    return (
      <input
        type="checkbox"
        role="switch"
        ref={inputRef}
        checked={checked}
        onChange={(e) => {
          if (onCheckedChange) {
            onCheckedChange(e.target.checked);
          }
        }}
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

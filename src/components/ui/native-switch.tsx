
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
      if (ref) {
        if (typeof ref === 'function') {
          if (inputRef.current) ref(inputRef.current);
        } else {
          ref.current = inputRef.current;
        }
      }
    }, [ref]);

    // Setup direct vibration on click
    useEffect(() => {
      const input = inputRef.current;
      if (!input || !enableHaptics) return;
      
      const triggerHaptic = () => {
        if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
          console.log('Native switch triggering vibration');
          try {
            // Direct call to the Vibration API
            navigator.vibrate(15);
          } catch (error) {
            console.error('Error triggering vibration:', error);
          }
        }
      };
      
      input.addEventListener('click', triggerHaptic);
      
      return () => {
        input.removeEventListener('click', triggerHaptic);
      };
    }, [enableHaptics]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onCheckedChange) {
        onCheckedChange(e.target.checked);
      }
    };

    return (
      <input
        type="checkbox"
        role="switch"
        ref={inputRef}
        checked={checked}
        onChange={handleChange}
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

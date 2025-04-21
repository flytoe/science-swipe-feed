import React, { useRef, useEffect } from "react";
import { cn } from "@/lib/utils";

/**
 * HapticSwitch
 * - Fully accessible switch using a real <input type="checkbox" role="switch" />
 * - Triggers iOS haptic feedback natively (iOS 18+ Safari)
 * - Triggers Android haptic fallback via navigator.vibrate
 * - Controlled/Uncontrolled compatible via checked/defaultChecked
 */

interface HapticSwitchProps extends React.InputHTMLAttributes<HTMLInputElement> {
  checked?: boolean;
  onCheckedChange?: (checked: boolean) => void;
  enableHaptics?: boolean;
  className?: string;
  id?: string;
}

export const HapticSwitch = React.forwardRef<HTMLInputElement, HapticSwitchProps>(({
  checked,
  onCheckedChange,
  className,
  enableHaptics = true,
  ...props
}, ref) => {
  const innerRef = useRef<HTMLInputElement>(null);

  // Compose external ref
  useEffect(() => {
    if (!ref) return;
    if (typeof ref === "function") {
      if (innerRef.current) ref(innerRef.current);
    } else {
      ref.current = innerRef.current;
    }
  }, [ref]);

  // Only trigger vibration on physical toggle action
  const handleHaptic = (evt: React.ChangeEvent<HTMLInputElement>) => {
    if (!enableHaptics) return;

    // iOS: handled natively due to real checkbox
    // Android: use fallback if available (~100ms strong vibration)
    const ua = navigator.userAgent || "";
    if (/android/i.test(ua) || (/chrome/i.test(ua) && "vibrate" in navigator)) {
      try {
        navigator.vibrate && navigator.vibrate(100);
      } catch (e) { /* ignore */ }
    }
    // Let external onCheckedChange update their state
    if (onCheckedChange) onCheckedChange(evt.target.checked);
    // Let other onChange fire if present
    if (props.onChange) props.onChange(evt);
  };

  return (
    <label className={cn("inline-flex items-center cursor-pointer select-none", className)}>
      <input
        role="switch"
        aria-checked={checked}
        aria-label={props["aria-label"]}
        tabIndex={props.tabIndex}
        ref={innerRef}
        type="checkbox"
        checked={checked}
        onChange={handleHaptic}
        disabled={props.disabled}
        id={props.id}
        className={cn(
          // Hide raw default, but keep it visually accessible for haptics!
          "peer w-[52px] h-[32px] appearance-none bg-gray-200 checked:bg-primary rounded-full transition-colors relative outline-none border-none disabled:cursor-not-allowed disabled:opacity-50",
        )}
        // Don't spread onCheckedChange to <input>
        {...Object.fromEntries(Object.entries(props).filter(([k]) => k !== "onCheckedChange"))}
      />
      {/* The "thumb" */}
      <span
        className={cn(
          "pointer-events-none absolute left-0 top-0 h-[32px] w-[52px] rounded-full transition-colors duration-200",
          "after:content-[''] after:block after:absolute after:top-[2.5px] after:left-[2.5px] after:w-[27px] after:h-[27px] after:rounded-full after:bg-white after:shadow",
          "peer-checked:bg-primary peer-checked:after:bg-white peer-checked:after:translate-x-[20px]",
          "after:transition-transform after:duration-200"
        )}
        aria-hidden="true"
      />
    </label>
  );
});
HapticSwitch.displayName = "HapticSwitch";

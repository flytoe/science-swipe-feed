
import { useRef, useEffect } from 'react';

export const useHapticFeedback = () => {
  const switchesRef = useRef<HTMLDivElement | null>(null);
  const switchPoolRef = useRef<HTMLInputElement[]>([]);
  const isVibrationSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;
  
  useEffect(() => {
    // Create hidden switches container with proper styling
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    container.style.visibility = 'hidden';
    container.style.zIndex = '-1';
    document.body.appendChild(container);
    switchesRef.current = container;
    
    // Pre-create a pool of switches
    const poolSize = 10;
    const switches = Array.from({ length: poolSize }, () => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.role = 'switch';
      input.style.margin = '0';
      input.style.appearance = 'none';
      input.style.width = '44px'; // iOS standard touch target
      input.style.height = '26px';
      container.appendChild(input);
      return input;
    });
    switchPoolRef.current = switches;
    
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  const toggleSwitch = async (switchEl: HTMLInputElement, duration: number = 20) => {
    switchEl.checked = true;
    await new Promise(resolve => setTimeout(resolve, duration));
    switchEl.checked = false;
  };

  const tapVibration = async () => {
    if (isVibrationSupported) {
      navigator.vibrate(20);
    } else if (switchPoolRef.current.length > 0) {
      await toggleSwitch(switchPoolRef.current[0]);
    }
  };

  const startHoldVibration = async () => {
    if (isVibrationSupported) {
      navigator.vibrate([30, 50, 20]);
    } else if (switchPoolRef.current.length >= 2) {
      const [switch1, switch2] = switchPoolRef.current;
      await toggleSwitch(switch1, 30);
      await toggleSwitch(switch2, 30);
    }
  };

  const explosionVibration = async (holdDuration: number) => {
    if (isVibrationSupported) {
      const intensity = Math.min(holdDuration / 1000, 1);
      const baseVibration = Math.floor(100 * intensity);
      navigator.vibrate([baseVibration, 30, Math.floor(baseVibration * 0.7), 20, Math.floor(baseVibration * 0.4)]);
    } else {
      const switchCount = Math.min(Math.floor(holdDuration / 200) + 3, 8);
      const switches = switchPoolRef.current.slice(0, switchCount);
      
      // Create a more intense pattern for longer holds
      for (const switchEl of switches) {
        await toggleSwitch(switchEl, 40);
      }
    }
  };

  return {
    tapVibration,
    startHoldVibration,
    explosionVibration,
  };
};

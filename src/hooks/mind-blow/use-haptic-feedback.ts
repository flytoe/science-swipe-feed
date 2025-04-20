
import { useRef, useEffect } from 'react';

export const useHapticFeedback = () => {
  const switchesRef = useRef<HTMLDivElement | null>(null);
  const isVibrationSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;
  
  useEffect(() => {
    // Create hidden switches container
    const container = document.createElement('div');
    container.style.position = 'fixed';
    container.style.opacity = '0';
    container.style.pointerEvents = 'none';
    container.style.visibility = 'hidden';
    document.body.appendChild(container);
    switchesRef.current = container;
    
    return () => {
      document.body.removeChild(container);
    };
  }, []);

  const createSwitch = () => {
    const input = document.createElement('input');
    input.type = 'checkbox';
    input.role = 'switch';
    return input;
  };

  const toggleSwitches = async (count: number, interval: number) => {
    if (!switchesRef.current) return;
    
    const switches = Array.from({ length: count }, createSwitch);
    switches.forEach(s => switchesRef.current?.appendChild(s));
    
    // Toggle switches with delay for haptic effect
    for (const s of switches) {
      s.checked = true;
      await new Promise(resolve => setTimeout(resolve, interval));
      s.checked = false;
      switchesRef.current?.removeChild(s);
    }
  };

  const tapVibration = () => {
    if (isVibrationSupported) {
      navigator.vibrate(20);
    } else {
      toggleSwitches(1, 20);
    }
  };

  const startHoldVibration = () => {
    if (isVibrationSupported) {
      navigator.vibrate([30, 50, 20]);
    } else {
      toggleSwitches(2, 30);
    }
  };

  const explosionVibration = (holdDuration: number) => {
    if (isVibrationSupported) {
      const intensity = Math.min(holdDuration / 1000, 1);
      const baseVibration = Math.floor(100 * intensity);
      navigator.vibrate([baseVibration, 30, Math.floor(baseVibration * 0.7), 20, Math.floor(baseVibration * 0.4)]);
    } else {
      const switchCount = Math.min(Math.floor(holdDuration / 200) + 3, 8);
      toggleSwitches(switchCount, 40);
    }
  };

  return {
    tapVibration,
    startHoldVibration,
    explosionVibration,
  };
};

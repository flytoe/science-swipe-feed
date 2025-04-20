
import { useRef, useEffect } from 'react';

export const useHapticFeedback = () => {
  const switchesRef = useRef<HTMLDivElement | null>(null);
  const switchPoolRef = useRef<HTMLInputElement[]>([]);
  const isVibrationSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;
  
  useEffect(() => {
    // Create hidden switches container with iOS-specific styling
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      opacity: 0;
      pointer-events: none;
      visibility: hidden;
      z-index: -1;
      width: 0;
      height: 0;
      overflow: hidden;
    `;
    document.body.appendChild(container);
    switchesRef.current = container;
    
    // Pre-create switches with iOS-specific attributes
    const poolSize = 10;
    const switches = Array.from({ length: poolSize }, () => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.setAttribute('role', 'switch');
      input.setAttribute('aria-checked', 'false');
      input.setAttribute('aria-label', 'Haptic feedback switch');
      input.style.cssText = `
        appearance: none;
        -webkit-appearance: none;
        margin: 0;
        outline: none;
        border: none;
        width: 51px;
        height: 31px;
        border-radius: 16px;
        background-color: rgba(120,120,128,0.16);
        transition: background-color 0.2s;
        position: relative;
      `;
      container.appendChild(input);
      return input;
    });
    switchPoolRef.current = switches;
    
    return () => {
      if (switchesRef.current) {
        document.body.removeChild(switchesRef.current);
      }
    };
  }, []);

  const toggleSwitch = async (switchEl: HTMLInputElement, duration: number = 20) => {
    return new Promise<void>(resolve => {
      switchEl.checked = true;
      switchEl.setAttribute('aria-checked', 'true');
      setTimeout(() => {
        switchEl.checked = false;
        switchEl.setAttribute('aria-checked', 'false');
        resolve();
      }, duration);
    });
  };

  const tapVibration = async () => {
    if (isVibrationSupported) {
      navigator.vibrate(10);
    } else if (switchPoolRef.current.length > 0) {
      await toggleSwitch(switchPoolRef.current[0], 15);
    }
  };

  const startHoldVibration = async () => {
    if (isVibrationSupported) {
      navigator.vibrate([20, 30, 10]);
    } else if (switchPoolRef.current.length >= 2) {
      const [switch1, switch2] = switchPoolRef.current;
      await toggleSwitch(switch1, 20);
      await new Promise(resolve => setTimeout(resolve, 30));
      await toggleSwitch(switch2, 20);
    }
  };

  const explosionVibration = async (holdDuration: number) => {
    if (isVibrationSupported) {
      const intensity = Math.min(holdDuration / 1000, 1);
      const baseVibration = Math.floor(50 * intensity);
      navigator.vibrate([baseVibration, 20, Math.floor(baseVibration * 0.7), 10]);
    } else {
      const switchCount = Math.min(Math.floor(holdDuration / 300) + 2, 6);
      const switches = switchPoolRef.current.slice(0, switchCount);
      
      for (const switchEl of switches) {
        await toggleSwitch(switchEl, 25);
        await new Promise(resolve => setTimeout(resolve, 20));
      }
    }
  };

  return {
    tapVibration,
    startHoldVibration,
    explosionVibration,
  };
};

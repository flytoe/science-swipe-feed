
import { useRef, useEffect, useState } from 'react';

export const useHapticFeedback = () => {
  const switchesRef = useRef<HTMLDivElement | null>(null);
  const switchPoolRef = useRef<HTMLInputElement[]>([]);
  const isVibrationSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;
  
  useEffect(() => {
    // Create hidden switches container with iOS-specific styling
    const container = document.createElement('div');
    container.style.cssText = `
      position: fixed;
      top: -100vh;
      left: -100vw;
      width: 0;
      height: 0;
      pointer-events: none;
      opacity: 0;
      overflow: hidden;
      z-index: -1000;
    `;
    document.body.appendChild(container);
    switchesRef.current = container;
    
    // Pre-create switches with iOS-specific attributes
    const poolSize = 10;
    const switches = Array.from({ length: poolSize }, () => {
      const input = document.createElement('input');
      input.type = 'checkbox';
      input.className = 'haptic-switch';
      input.setAttribute('role', 'switch');
      input.setAttribute('aria-checked', 'false');
      input.setAttribute('aria-label', 'Haptic feedback switch');
      input.style.cssText = `
        -webkit-appearance: none;
        appearance: none;
        margin: 0;
        outline: none;
        border: none;
        width: 51px;
        height: 31px;
        border-radius: 16px;
        background-color: rgba(120,120,128,0.16);
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

  const toggleSwitch = async (switchEl: HTMLInputElement) => {
    return new Promise<void>(resolve => {
      if (!switchEl) {
        console.warn('Switch element is null or undefined');
        resolve();
        return;
      }
      
      switchEl.checked = true;
      switchEl.setAttribute('aria-checked', 'true');
      
      // Trigger a quick toggle for haptic feedback
      setTimeout(() => {
        switchEl.checked = false;
        switchEl.setAttribute('aria-checked', 'false');
        resolve();
      }, 10);
    });
  };

  const tapVibration = async () => {
    if (isVibrationSupported) {
      navigator.vibrate(10);
    } else if (switchPoolRef.current.length > 0) {
      const switchEl = switchPoolRef.current[0];
      await toggleSwitch(switchEl);
    }
  };

  const startHoldVibration = async () => {
    if (isVibrationSupported) {
      navigator.vibrate([20, 30, 10]);
    } else if (switchPoolRef.current.length >= 2) {
      const switches = switchPoolRef.current.slice(0, 2);
      for (const switchEl of switches) {
        await toggleSwitch(switchEl);
        await new Promise(resolve => setTimeout(resolve, 20));
      }
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
        await toggleSwitch(switchEl);
        await new Promise(resolve => setTimeout(resolve, 15));
      }
    }
  };

  const testHapticFeedback = async () => {
    console.log('Testing haptic feedback...');
    
    if (isVibrationSupported) {
      console.log('Using vibration API');
      navigator.vibrate([20, 40, 20]);
    } else if (switchPoolRef.current.length > 0) {
      console.log('Using switch pool fallback');
      for (let i = 0; i < Math.min(3, switchPoolRef.current.length); i++) {
        await toggleSwitch(switchPoolRef.current[i]);
        await new Promise(resolve => setTimeout(resolve, 20));
      }
    } else {
      console.log('No haptic feedback method available');
    }
  };

  return {
    tapVibration,
    startHoldVibration,
    explosionVibration,
    testHapticFeedback
  };
};

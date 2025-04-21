
import { useCallback } from 'react';

/**
 * IMPORTANT: iOS 18 Haptic Feedback Requirements:
 * - Only works with real <input type="checkbox"> elements
 * - Element must be visible (not display:none or visibility:hidden)
 * - Element cannot be disabled
 * - Must be triggered by direct user interaction (not JavaScript)
 * 
 * Direct programmatic vibration no longer works in iOS Safari.
 * See MindBlowButton.tsx for implementation of iOS 18 compatible haptics.
 */
export const useHapticFeedback = () => {
  // Simple function that directly calls the Vibration API
  // NOTE: This will not work on iOS 18+ Safari!
  const vibrate = useCallback((pattern: number | number[]) => {
    if (typeof navigator !== 'undefined' && 'vibrate' in navigator) {
      try {
        console.log('Directly vibrating with pattern:', pattern);
        navigator.vibrate(pattern);
        return true;
      } catch (error) {
        console.error('Error triggering vibration:', error);
        return false;
      }
    } else {
      console.warn('Vibration API not supported in this browser/device');
      return false;
    }
  }, []);

  const isVibrationSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const tapVibration = useCallback(() => {
    console.log('Executing tap vibration');
    return vibrate(15);
  }, [vibrate]);

  const startHoldVibration = useCallback(() => {
    console.log('Executing hold vibration');
    return vibrate([20, 30, 20]);
  }, [vibrate]);

  const explosionVibration = useCallback((holdDuration: number = 0) => {
    console.log('Executing explosion vibration, duration:', holdDuration);
    const intensity = Math.min(holdDuration / 1000, 1);
    const baseVibration = Math.floor(50 * intensity) || 50; // Minimum of 50ms
    return vibrate([baseVibration, 20, Math.floor(baseVibration * 0.7), 10]);
  }, [vibrate]);

  return {
    vibrate,
    tapVibration,
    startHoldVibration,
    explosionVibration,
    isVibrationSupported
  };
};

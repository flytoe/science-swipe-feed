
import { useCallback } from 'react';

export const useHapticFeedback = () => {
  // Check if vibration is supported in the current browser/device
  const isVibrationSupported = typeof window !== 'undefined' && 
                               'navigator' in window && 
                               'vibrate' in navigator;

  const tapVibration = useCallback(() => {
    console.log('Executing tap vibration, supported:', isVibrationSupported);
    if (isVibrationSupported) {
      try {
        // Simple short vibration for tap
        window.navigator.vibrate(15);
        console.log('Tap vibration executed successfully');
      } catch (error) {
        console.error('Error triggering vibration:', error);
      }
    }
  }, [isVibrationSupported]);

  const startHoldVibration = useCallback(() => {
    console.log('Executing hold vibration, supported:', isVibrationSupported);
    if (isVibrationSupported) {
      try {
        // Pattern for hold feedback
        window.navigator.vibrate([20, 30, 20]);
        console.log('Hold vibration executed successfully');
      } catch (error) {
        console.error('Error triggering vibration:', error);
      }
    }
  }, [isVibrationSupported]);

  const explosionVibration = useCallback((holdDuration: number = 0) => {
    console.log('Executing explosion vibration, supported:', isVibrationSupported, 'duration:', holdDuration);
    if (isVibrationSupported) {
      try {
        // Stronger pattern for explosion, scales with hold duration
        const intensity = Math.min(holdDuration / 1000, 1);
        const baseVibration = Math.floor(50 * intensity) || 50; // Minimum of 50ms
        window.navigator.vibrate([baseVibration, 20, Math.floor(baseVibration * 0.7), 10]);
        console.log('Explosion vibration executed successfully with base duration:', baseVibration);
      } catch (error) {
        console.error('Error triggering vibration:', error);
      }
    }
  }, [isVibrationSupported]);

  return {
    tapVibration,
    startHoldVibration,
    explosionVibration,
    isVibrationSupported
  };
};

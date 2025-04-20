
import { useCallback } from 'react';

export const useHapticFeedback = () => {
  const isVibrationSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;

  const tapVibration = useCallback(() => {
    if (isVibrationSupported) {
      navigator.vibrate(10);
    }
  }, [isVibrationSupported]);

  const startHoldVibration = useCallback(() => {
    if (isVibrationSupported) {
      navigator.vibrate([20, 30, 10]);
    }
  }, [isVibrationSupported]);

  const explosionVibration = useCallback((holdDuration: number) => {
    if (isVibrationSupported) {
      const intensity = Math.min(holdDuration / 1000, 1);
      const baseVibration = Math.floor(50 * intensity);
      navigator.vibrate([baseVibration, 20, Math.floor(baseVibration * 0.7), 10]);
    }
  }, [isVibrationSupported]);

  return {
    tapVibration,
    startHoldVibration,
    explosionVibration
  };
};

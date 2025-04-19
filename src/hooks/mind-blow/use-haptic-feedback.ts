
export const useHapticFeedback = () => {
  const isVibrationSupported = typeof navigator !== 'undefined' && 'vibrate' in navigator;
  
  const tapVibration = () => {
    if (isVibrationSupported) {
      navigator.vibrate(20); // Short tap feedback
    }
  };

  const startHoldVibration = () => {
    if (isVibrationSupported) {
      navigator.vibrate([30, 50, 20]); // Initial hold pattern
    }
  };

  const explosionVibration = (holdDuration: number) => {
    if (isVibrationSupported) {
      // Scale vibration intensity with hold duration
      const intensity = Math.min(holdDuration / 1000, 1);
      const baseVibration = Math.floor(100 * intensity);
      
      // Create a more complex pattern for the explosion
      navigator.vibrate([
        baseVibration, // Initial strong vibration
        30, // Pause
        Math.floor(baseVibration * 0.7), // Second burst
        20, // Short pause
        Math.floor(baseVibration * 0.4) // Final burst
      ]);
    }
  };

  return {
    tapVibration,
    startHoldVibration,
    explosionVibration,
  };
};

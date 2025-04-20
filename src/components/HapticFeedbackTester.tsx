
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { NativeSwitch } from '@/components/ui/native-switch';
import { useHapticFeedback } from '@/hooks/mind-blow/use-haptic-feedback';
import { Button } from '@/components/ui/button';

const HapticFeedbackTester = () => {
  const { tapVibration, startHoldVibration, explosionVibration, isVibrationSupported } = useHapticFeedback();
  const [isEnabled, setIsEnabled] = useState(true);
  const [tapTest, setTapTest] = useState(false);
  const [holdTest, setHoldTest] = useState(false);
  const [explosionTest, setExplosionTest] = useState(false);

  useEffect(() => {
    // Log if vibration is supported on this device
    console.log(`Vibration API supported: ${isVibrationSupported}`);
  }, [isVibrationSupported]);

  const handleTapTest = (checked: boolean) => {
    setTapTest(checked);
    if (isEnabled && checked) {
      console.log('Triggering tap vibration');
      tapVibration();
    }
  };

  const handleHoldTest = (checked: boolean) => {
    setHoldTest(checked);
    if (isEnabled && checked) {
      console.log('Triggering hold vibration');
      startHoldVibration();
    }
  };

  const handleExplosionTest = (checked: boolean) => {
    setExplosionTest(checked);
    if (isEnabled && checked) {
      console.log('Triggering explosion vibration');
      explosionVibration(2000); // Simulate a 2-second hold
    }
  };

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    console.log('Haptic feedback enabled:', checked);
  };

  const testAllFeedback = () => {
    if (!isEnabled) return;
    
    // Execute all vibration patterns in sequence
    setTimeout(() => {
      console.log('Testing tap vibration');
      tapVibration();
    }, 0);
    
    setTimeout(() => {
      console.log('Testing hold vibration');
      startHoldVibration();
    }, 1000);
    
    setTimeout(() => {
      console.log('Testing explosion vibration');
      explosionVibration(2000);
    }, 2000);
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Label className="text-sm font-medium">Haptic Feedback</Label>
        {!isVibrationSupported && (
          <span className="text-xs text-red-500">
            (Vibration not supported on this device)
          </span>
        )}
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="haptic-enabled" className="text-sm">Enable Haptics</Label>
          <NativeSwitch
            id="haptic-enabled"
            checked={isEnabled}
            onCheckedChange={handleToggle}
          />
        </div>

        {isEnabled && (
          <>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label htmlFor="tap-test" className="text-sm">Test Tap Feedback</Label>
                <NativeSwitch
                  id="tap-test"
                  checked={tapTest}
                  onCheckedChange={handleTapTest}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="hold-test" className="text-sm">Test Hold Feedback</Label>
                <NativeSwitch
                  id="hold-test"
                  checked={holdTest}
                  onCheckedChange={handleHoldTest}
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="explosion-test" className="text-sm">Test Explosion Feedback</Label>
                <NativeSwitch
                  id="explosion-test"
                  checked={explosionTest}
                  onCheckedChange={handleExplosionTest}
                />
              </div>

              <Button 
                onClick={testAllFeedback}
                className="w-full mt-2"
                variant="outline"
              >
                Test All Feedback
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HapticFeedbackTester;

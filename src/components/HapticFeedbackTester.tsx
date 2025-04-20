
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { NativeSwitch } from '@/components/ui/native-switch';
import { useHapticFeedback } from '@/hooks/mind-blow/use-haptic-feedback';

const HapticFeedbackTester = () => {
  const { tapVibration, startHoldVibration, explosionVibration } = useHapticFeedback();
  const [isEnabled, setIsEnabled] = useState(true);

  const handleTapTest = (checked: boolean) => {
    if (isEnabled && checked) {
      console.log('Triggering tap vibration');
      tapVibration();
    }
  };

  const handleHoldTest = (checked: boolean) => {
    if (isEnabled && checked) {
      console.log('Triggering hold vibration');
      startHoldVibration();
    }
  };

  const handleExplosionTest = (checked: boolean) => {
    if (isEnabled && checked) {
      console.log('Triggering explosion vibration');
      explosionVibration(2000); // Simulate a 2-second hold
    }
  };

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    console.log('Haptic feedback enabled:', checked);
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Label className="text-sm font-medium">Haptic Feedback</Label>
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
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <Label htmlFor="tap-test" className="text-sm">Test Tap Feedback</Label>
              <NativeSwitch
                id="tap-test"
                onCheckedChange={handleTapTest}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="hold-test" className="text-sm">Test Hold Feedback</Label>
              <NativeSwitch
                id="hold-test"
                onCheckedChange={handleHoldTest}
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="explosion-test" className="text-sm">Test Explosion Feedback</Label>
              <NativeSwitch
                id="explosion-test"
                onCheckedChange={handleExplosionTest}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default HapticFeedbackTester;

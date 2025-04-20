
import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { useHapticFeedback } from '@/hooks/mind-blow/use-haptic-feedback';

const HapticFeedbackTester = () => {
  const { tapVibration, startHoldVibration, explosionVibration } = useHapticFeedback();
  const [isEnabled, setIsEnabled] = useState(true);

  const handleTapTest = () => {
    if (isEnabled) tapVibration();
  };

  const handleHoldTest = () => {
    if (isEnabled) startHoldVibration();
  };

  const handleExplosionTest = () => {
    if (isEnabled) explosionVibration(2000); // Simulate a 2-second hold
  };

  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Label className="text-sm font-medium">Haptic Feedback</Label>
      </div>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Label htmlFor="haptic-enabled" className="text-sm">Enable Haptics</Label>
          <Switch
            id="haptic-enabled"
            checked={isEnabled}
            onCheckedChange={setIsEnabled}
            className="ios-switch"
          />
        </div>

        {isEnabled && (
          <>
            <div className="flex items-center justify-between">
              <Label htmlFor="tap-test" className="text-sm">Test Tap Feedback</Label>
              <Switch
                id="tap-test"
                onCheckedChange={handleTapTest}
                checked={false}
                className="ios-switch"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="hold-test" className="text-sm">Test Hold Feedback</Label>
              <Switch
                id="hold-test"
                onCheckedChange={handleHoldTest}
                checked={false}
                className="ios-switch"
              />
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="explosion-test" className="text-sm">Test Explosion Feedback</Label>
              <Switch
                id="explosion-test"
                onCheckedChange={handleExplosionTest}
                checked={false}
                className="ios-switch"
              />
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HapticFeedbackTester;


import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/mind-blow/use-haptic-feedback';

const HapticFeedbackTester = () => {
  const { tapVibration, startHoldVibration, explosionVibration, testHapticFeedback } = useHapticFeedback();
  const [isEnabled, setIsEnabled] = useState(true);

  const handleTapTest = () => {
    if (isEnabled) {
      console.log('Triggering tap vibration');
      tapVibration();
    }
  };

  const handleHoldTest = () => {
    if (isEnabled) {
      console.log('Triggering hold vibration');
      startHoldVibration();
    }
  };

  const handleExplosionTest = () => {
    if (isEnabled) {
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
          <Switch
            id="haptic-enabled"
            checked={isEnabled}
            onCheckedChange={handleToggle}
          />
        </div>

        {isEnabled && (
          <div className="space-y-3 mt-4">
            <Button 
              variant="outline" 
              className="w-full justify-start text-left font-normal" 
              onClick={handleTapTest}
            >
              Test Tap Feedback
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start text-left font-normal" 
              onClick={handleHoldTest}
            >
              Test Hold Feedback
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start text-left font-normal" 
              onClick={handleExplosionTest}
            >
              Test Explosion Feedback
            </Button>

            <Button 
              variant="outline" 
              className="w-full justify-start text-left font-normal" 
              onClick={testHapticFeedback}
            >
              Test All Feedback
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default HapticFeedbackTester;

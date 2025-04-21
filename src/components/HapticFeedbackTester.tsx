
import React, { useState, useEffect } from 'react';
import { Label } from '@/components/ui/label';
import { NativeSwitch } from '@/components/ui/native-switch';
import { Button } from '@/components/ui/button';

const HapticFeedbackTester = () => {
  const [isEnabled, setIsEnabled] = useState(true);
  const [isVibrationSupported, setIsVibrationSupported] = useState(false);

  useEffect(() => {
    // Check if vibration is supported
    setIsVibrationSupported(typeof navigator !== 'undefined' && 'vibrate' in navigator);
  }, []);

  const handleToggle = (checked: boolean) => {
    setIsEnabled(checked);
    console.log('Haptic feedback enabled:', checked);
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
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="hold-test" className="text-sm">Test Hold Feedback</Label>
                <NativeSwitch
                  id="hold-test"
                />
              </div>

              <div className="flex items-center justify-between">
                <Label htmlFor="explosion-test" className="text-sm">Test Explosion Feedback</Label>
                <NativeSwitch
                  id="explosion-test"
                />
              </div>
              
              <div className="text-xs text-gray-500 mt-6">
                <p className="font-semibold">iOS 18 Haptic Feedback Requirements:</p>
                <ul className="list-disc pl-5 mt-1 space-y-1">
                  <li>Only works with real <code>&lt;input type="checkbox"&gt;</code> elements</li>
                  <li>Element must be visible (not display:none or visibility:hidden)</li>
                  <li>Element cannot be disabled</li>
                  <li>Must be triggered by direct user interaction (not JavaScript)</li>
                </ul>
                <p className="font-semibold mt-3">Device Support:</p>
                <p>iOS: Must use Safari and be in PWA/standalone mode</p>
                <p>Android: Chrome/Firefox/Safari should work directly</p>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HapticFeedbackTester;

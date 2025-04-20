
import React from 'react';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { useHapticFeedback } from '@/hooks/mind-blow/use-haptic-feedback';

const HapticFeedbackTester = () => {
  const { testHapticFeedback } = useHapticFeedback();
  
  return (
    <div className="p-4 border-b border-gray-200">
      <div className="flex items-center gap-2 mb-3">
        <Label className="text-sm font-medium">Haptic Feedback Test</Label>
      </div>
      
      <p className="text-xs text-gray-500 mb-3">
        Test haptic feedback on this device by clicking the button below
      </p>
      
      <Button 
        onClick={testHapticFeedback}
        variant="outline" 
        size="sm"
        className="w-full"
      >
        Test Haptic Feedback
      </Button>
    </div>
  );
};

export default HapticFeedbackTester;

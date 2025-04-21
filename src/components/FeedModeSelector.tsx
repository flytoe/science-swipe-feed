
import React from 'react';
import { useFeedModeStore } from '@/hooks/use-feed-mode';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Label } from '@/components/ui/label';
import { HapticSwitch } from '@/components/ui/haptic-switch';

const FeedModeSelector: React.FC = () => {
  const { currentMode, setMode } = useFeedModeStore();

  const modes = [
    { label: 'Newest', value: 'newest' },
    { label: 'Mind Blow', value: 'mindblown' },
    { label: 'Surprise', value: 'surprise' }
  ];

  const handleModeChange = (value: string) => {
    setMode(value as 'newest' | 'mindblown' | 'surprise');
  };

  return (
    <div className="flex flex-col space-y-3 px-1">
      <div className="flex items-center justify-between space-x-8">
        {modes.map((mode) => (
          <div key={mode.value} className="flex flex-col items-center gap-1.5">
            <Label htmlFor={`mode-${mode.value}`} className="text-xs font-medium cursor-pointer">
              {mode.label}
            </Label>
            <HapticSwitch
              id={`mode-${mode.value}`}
              checked={currentMode === mode.value}
              onCheckedChange={(checked) => {
                if (checked) handleModeChange(mode.value);
              }}
              enableHaptics={true}
              className="mx-auto"
              aria-label={`Switch to ${mode.label} mode`}
            />
          </div>
        ))}
      </div>
    </div>
  );
};

export default FeedModeSelector;

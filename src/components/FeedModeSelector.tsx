
import React from 'react';
import { useFeedModeStore } from '@/hooks/use-feed-mode';
import { Button } from '@/components/ui/button';

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
      <div className="flex items-center justify-between space-x-2">
        {modes.map((mode) => (
          <Button
            key={mode.value}
            variant={currentMode === mode.value ? "default" : "outline"}
            onClick={() => handleModeChange(mode.value)}
            className="flex-1 text-sm py-2 h-9"
          >
            {mode.label}
          </Button>
        ))}
      </div>
    </div>
  );
};

export default FeedModeSelector;

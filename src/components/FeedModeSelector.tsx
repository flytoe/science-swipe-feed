
import React from 'react';
import { useFeedModeStore } from '@/hooks/use-feed-mode';
import { Button } from './ui/button';

const FeedModeSelector: React.FC = () => {
  const { currentMode, setMode } = useFeedModeStore();

  const modes = [
    { label: 'Newest', value: 'newest' },
    { label: 'Mind Blow', value: 'mindblown' },
    { label: 'Surprise', value: 'surprise' }
  ];

  return (
    <div className="flex items-center space-x-2">
      {modes.map((mode) => (
        <Button
          key={mode.value}
          variant={currentMode === mode.value ? 'default' : 'outline'}
          size="sm"
          onClick={() => setMode(mode.value as 'newest' | 'mindblown' | 'surprise')}
        >
          {mode.label}
        </Button>
      ))}
    </div>
  );
};

export default FeedModeSelector;

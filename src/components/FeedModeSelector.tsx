
import React from 'react';
import { useFeedModeStore } from '@/hooks/use-feed-mode';
import { Button } from '@/components/ui/button';
import { Calendar, Sparkles, Zap, Tag } from 'lucide-react';

const FeedModeSelector: React.FC = () => {
  const { currentMode, setMode } = useFeedModeStore();

  const modes = [
    { label: 'Newest', value: 'newest', icon: Calendar },
    { label: 'Mind Blow', value: 'mindblown', icon: Zap },
    { label: 'Surprise', value: 'surprise', icon: Sparkles },
    { label: 'By Type', value: 'bytype', icon: Tag }
  ];

  const handleModeChange = (value: string) => {
    setMode(value as 'newest' | 'mindblown' | 'surprise' | 'bytype');
  };

  return (
    <div className="flex flex-col space-y-3 px-1">
      <div className="grid grid-cols-4 gap-2">
        {modes.map((mode) => {
          const Icon = mode.icon;
          return (
            <Button
              key={mode.value}
              variant={currentMode === mode.value ? "default" : "outline"}
              onClick={() => handleModeChange(mode.value)}
              className="flex flex-col items-center justify-center py-2 h-auto text-xs"
            >
              <Icon className="h-4 w-4 mb-1" />
              {mode.label}
            </Button>
          );
        })}
      </div>
    </div>
  );
};

export default FeedModeSelector;

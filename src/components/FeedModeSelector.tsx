
import React from 'react';
import { motion } from 'framer-motion';
import { useFeedModeStore, FeedMode } from '@/hooks/use-feed-mode';
import { Sparkles, Clock, Zap } from 'lucide-react';

const FeedModeSelector: React.FC = () => {
  const { currentMode, setMode } = useFeedModeStore();
  
  const modes: { id: FeedMode; label: string; icon: React.ReactNode }[] = [
    { 
      id: 'newest', 
      label: 'Newest', 
      icon: <Clock size={16} />
    },
    { 
      id: 'mindblown', 
      label: 'Mind Blown', 
      icon: <span className="text-base">🤯</span>
    },
    { 
      id: 'surprise', 
      label: 'Surprise Me', 
      icon: <Sparkles size={16} />
    },
  ];

  return (
    <div className="flex items-center justify-center gap-2 p-2 bg-black/80 backdrop-blur-sm rounded-full border border-white/10">
      {modes.map((mode) => (
        <motion.button
          key={mode.id}
          onClick={() => setMode(mode.id)}
          className={`
            flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium transition-colors
            ${currentMode === mode.id 
              ? 'bg-white/20 text-white' 
              : 'bg-transparent text-white/60 hover:text-white/90 hover:bg-white/10'}
          `}
          whileTap={{ scale: 0.97 }}
        >
          {mode.icon}
          {mode.label}
        </motion.button>
      ))}
    </div>
  );
};

export default FeedModeSelector;

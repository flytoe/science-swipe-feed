
import React, { useRef } from 'react';
import { Button } from '../ui/button';
import { Textarea } from '../ui/textarea';
import { X } from 'lucide-react';
import { motion } from 'framer-motion';
import QuickTagSelector from './QuickTagSelector';

interface ReasonOverlayProps {
  reason: string;
  selectedTags: string[];
  isLoading: boolean;
  onReasonChange: (value: string) => void;
  onToggleTag: (tag: string) => void;
  onSubmit: () => void;
  onClose: () => void;
}

const ReasonOverlay: React.FC<ReasonOverlayProps> = ({
  reason,
  selectedTags,
  isLoading,
  onReasonChange,
  onToggleTag,
  onSubmit,
  onClose,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey && textareaRef.current?.contains(e.target as Node)) {
      e.preventDefault();
      onSubmit();
    }
  };

  return (
    <motion.div 
      className="absolute bottom-full right-0 mb-2 w-80 bg-black/95 border border-white/20 p-4 rounded-lg shadow-xl z-50"
      initial={{ opacity: 0, y: 10, scale: 0.95 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      exit={{ opacity: 0, y: 10, scale: 0.95 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex justify-between items-center mb-3">
        <p className="text-white text-sm font-medium">What blew your mind?</p>
        <Button 
          onClick={onClose}
          variant="ghost" 
          size="sm"
          className="p-1 h-auto w-auto text-white/60 hover:text-white hover:bg-white/10"
        >
          <X size={16} />
        </Button>
      </div>
      
      <QuickTagSelector
        selectedTags={selectedTags}
        onToggleTag={onToggleTag}
      />
      
      <form onSubmit={(e) => { e.preventDefault(); onSubmit(); }}>
        <Textarea
          value={reason}
          onChange={(e) => onReasonChange(e.target.value)}
          placeholder="Or write your own reason..."
          className="min-h-[80px] bg-white/10 border-white/20 text-white mb-3 text-sm"
          maxLength={256}
          ref={textareaRef}
          onKeyPress={handleKeyPress}
        />
        <div className="flex justify-end">
          <Button 
            type="submit"
            disabled={isLoading} 
            size="sm"
            className="bg-yellow-500 text-black hover:bg-yellow-400 text-xs"
          >
            Submit
          </Button>
        </div>
      </form>
    </motion.div>
  );
};

export default ReasonOverlay;


import React, { useState, useRef, useEffect } from 'react';
import { Button } from './ui/button';
import { motion, AnimatePresence } from 'framer-motion';
import { Textarea } from './ui/textarea';
import { X } from 'lucide-react';

interface MindBlowButtonProps {
  hasMindBlown: boolean;
  count: number;
  isTopPaper: boolean;
  isLoading: boolean;
  onClick: (reason?: string) => void;
  size?: 'sm' | 'default' | 'lg' | 'icon';
  showCount?: boolean;
  className?: string;
  variant?: 'default' | 'outline' | 'ghost';
}

// Predefined quick tag options for mind-blow reasons
const QUICK_TAGS = [
  "Novel approach",
  "Groundbreaking results",
  "Surprising findings", 
  "Counter-intuitive",
  "Elegant solution"
];

const MindBlowButton: React.FC<MindBlowButtonProps> = ({
  hasMindBlown,
  count,
  isTopPaper,
  isLoading,
  onClick,
  size = 'default',
  showCount = true,
  className = '',
  variant = 'default'
}) => {
  const [showOverlay, setShowOverlay] = useState(false);
  const [reason, setReason] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const overlayRef = useRef<HTMLDivElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Handle click outside overlay to close it
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (overlayRef.current && !overlayRef.current.contains(event.target as Node) && 
          buttonRef.current && !buttonRef.current.contains(event.target as Node)) {
        setShowOverlay(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Handle key press events for the textarea
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Enter' && !event.shiftKey && textareaRef.current?.contains(event.target as Node)) {
        event.preventDefault(); // Prevent line breaks
        handleSubmit(); // Submit the form
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, [reason, selectedTags]);

  const handleClick = () => {
    if (!hasMindBlown) {
      // If not mind-blown yet, trigger mind-blown immediately
      onClick();
      // Then show overlay for notes
      setShowOverlay(true);
    } else {
      // If already mind-blown, just show the overlay for potential note addition
      setShowOverlay(true);
    }
  };

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    
    let finalReason = reason.trim();
    
    // Add selected tags to the reason
    if (selectedTags.length > 0) {
      const tagsText = selectedTags.join(", ");
      finalReason = finalReason ? `${finalReason} (${tagsText})` : tagsText;
    }
    
    if (finalReason) {
      onClick(finalReason);
    }
    
    setReason('');
    setSelectedTags([]);
    setShowOverlay(false);
  };

  const handleClose = () => {
    setReason('');
    setSelectedTags([]);
    setShowOverlay(false);
  };

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    );
  };
  
  return (
    <div className="relative">
      <motion.div
        whileTap={{ scale: 0.95 }}
      >
        <Button 
          variant={variant}
          size={size}
          onClick={handleClick}
          disabled={isLoading}
          className={`relative group ${className} ${hasMindBlown ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''}`}
          ref={buttonRef}
        >
          <motion.span
            initial={{ scale: 1 }}
            animate={{ 
              scale: hasMindBlown ? [1, 1.4, 1] : 1,
              rotate: hasMindBlown ? [0, -10, 10, -10, 0] : 0
            }}
            transition={{ 
              duration: hasMindBlown ? 0.5 : 0,
              repeat: hasMindBlown ? Infinity : 0,
              repeatType: "reverse",
              repeatDelay: 2
            }}
            className="inline-flex items-center"
          >
            🤯
            {showCount && count > 0 && (
              <span className="ml-1 text-sm font-bold">
                {count}
              </span>
            )}
          </motion.span>
          
          {isTopPaper && (
            <motion.div 
              className="absolute -top-1 -right-1"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            >
              <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
            </motion.div>
          )}
        </Button>
      </motion.div>

      <AnimatePresence>
        {showOverlay && (
          <motion.div 
            className="absolute bottom-full right-0 mb-2 w-80 bg-black/95 border border-white/20 p-4 rounded-lg shadow-xl z-50"
            initial={{ opacity: 0, y: 10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            ref={overlayRef}
          >
            <div className="flex justify-between items-center mb-3">
              <p className="text-white text-sm font-medium">What blew your mind?</p>
              <Button 
                onClick={handleClose}
                variant="ghost" 
                size="sm"
                className="p-1 h-auto w-auto text-white/60 hover:text-white hover:bg-white/10"
              >
                <X size={16} />
              </Button>
            </div>
            
            {/* Quick tags selection */}
            <div className="mb-3 flex flex-wrap gap-2">
              {QUICK_TAGS.map((tag, index) => (
                <button
                  key={index}
                  type="button"
                  onClick={() => toggleTag(tag)}
                  className={`px-2 py-1 text-xs rounded-full transition-colors ${
                    selectedTags.includes(tag) 
                      ? 'bg-yellow-500 text-black' 
                      : 'bg-white/10 text-white hover:bg-white/20'
                  }`}
                >
                  {tag}
                </button>
              ))}
            </div>
            
            <form onSubmit={handleSubmit} ref={formRef}>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="Or write your own reason..."
                className="min-h-[80px] bg-white/10 border-white/20 text-white mb-3 text-sm"
                maxLength={256}
                ref={textareaRef}
                onKeyPress={(e) => {
                  if (e.key === 'Enter' && !e.shiftKey) {
                    e.preventDefault();
                    handleSubmit();
                  }
                }}
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
        )}
      </AnimatePresence>
    </div>
  );
};

export default MindBlowButton;

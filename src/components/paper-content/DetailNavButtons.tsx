
import React, { useState } from 'react';
import { Button } from '../ui/button';
import { X, ExternalLink } from 'lucide-react';
import { useMindBlow } from '../../hooks/use-mind-blow';
import { Textarea } from '../ui/textarea';
import { motion, AnimatePresence } from 'framer-motion';

interface DetailNavButtonsProps {
  paperDoi: string;
  onClose: () => void;
}

const DetailNavButtons: React.FC<DetailNavButtonsProps> = ({
  paperDoi,
  onClose
}) => {
  const { count, hasMindBlown, isTopPaper, isLoading, toggleMindBlow } = useMindBlow(paperDoi);
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [reason, setReason] = useState('');
  
  // Create the DOI URL with proper handling
  const doiUrl = paperDoi ? (
    paperDoi.startsWith('http') ? paperDoi : `https://doi.org/${paperDoi}`
  ) : undefined;

  const handleMindBlowClick = () => {
    if (hasMindBlown) {
      // If already mind-blown, just toggle it off
      toggleMindBlow();
    } else {
      // If not mind-blown yet, open the input overlay
      setShowReasonInput(true);
    }
  };

  const handleSubmitReason = () => {
    toggleMindBlow(reason);
    setReason('');
    setShowReasonInput(false);
  };

  const handleInputBlur = () => {
    // Submit automatically when user tabs/clicks away if there's text
    if (reason.trim()) {
      handleSubmitReason();
    }
  };

  const handleInputKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmitReason();
    }
  };

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-center justify-center gap-3 z-20">
      {/* Mind Blow Button with indicator */}
      <div className="relative">
        <motion.button
          className={`w-12 h-12 rounded-full shadow-md flex items-center justify-center ${
            hasMindBlown 
              ? 'bg-yellow-500 text-black' 
              : 'bg-white/10 backdrop-blur-sm border border-white/20 text-white hover:bg-white/20'
          }`}
          onClick={handleMindBlowClick}
          disabled={isLoading}
          whileTap={{ scale: 0.95 }}
          initial={{ scale: 1 }}
          animate={hasMindBlown ? { 
            scale: [1, 1.2, 1],
            transition: { duration: 0.5 }
          } : {}}
        >
          <span className="text-2xl">🤯</span>
          
          {/* Count indicator */}
          {count > 0 && (
            <motion.div 
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="absolute -top-2 -right-2 bg-red-500 text-white text-xs w-5 h-5 rounded-full flex items-center justify-center"
            >
              {count}
            </motion.div>
          )}
          
          {/* Top paper indicator */}
          {isTopPaper && !hasMindBlown && (
            <motion.div 
              initial={{ scale: 1 }}
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
              className="absolute -bottom-1 -right-1 text-xs"
            >
              ⭐
            </motion.div>
          )}
        </motion.button>
        
        {/* Reason input overlay */}
        <AnimatePresence>
          {showReasonInput && (
            <motion.div 
              className="absolute bottom-full mb-2 right-0 w-64 bg-black/90 backdrop-blur-md p-3 rounded-lg border border-white/20 shadow-xl"
              initial={{ opacity: 0, y: 10, scale: 0.9 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.9 }}
              transition={{ duration: 0.2 }}
            >
              <p className="text-sm text-white/90 mb-2">What blew your mind about this research?</p>
              <Textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                placeholder="This research amazed me because..."
                className="min-h-[80px] mb-2 bg-white/10 border-white/20 text-white"
                maxLength={256}
                onBlur={handleInputBlur}
                onKeyPress={handleInputKeyPress}
                autoFocus
              />
              <div className="flex justify-between">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={() => {
                    toggleMindBlow(); // Submit without reason
                    setShowReasonInput(false);
                  }}
                  className="text-xs text-white/70 hover:text-white"
                >
                  Skip
                </Button>
                <Button 
                  size="sm" 
                  onClick={handleSubmitReason}
                  className="bg-yellow-500 text-black hover:bg-yellow-400"
                >
                  Submit
                </Button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      
      {/* Original Paper Link */}
      {doiUrl && (
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full bg-blue-950/80 hover:bg-blue-900/90 text-blue-400 border-blue-900/40 shadow-md"
          asChild
        >
          <a 
            href={doiUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View original paper"
          >
            <ExternalLink size={18} />
          </a>
        </Button>
      )}
      
      {/* Close Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onClose}
        className="w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm hover:bg-black/60 border-white/10 text-white shadow-md"
        aria-label="Close detail view"
      >
        <X size={18} />
      </Button>
    </div>
  );
};

export default DetailNavButtons;


import React, { useState } from 'react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from './ui/dialog';
import { Textarea } from './ui/textarea';

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
  const [isOpen, setIsOpen] = useState(false);
  const [reason, setReason] = useState('');

  const handleClick = () => {
    if (hasMindBlown) {
      // If already mind-blown, just toggle it off
      onClick();
    } else {
      // If not mind-blown yet, open the dialog
      setIsOpen(true);
    }
  };

  const handleSubmit = () => {
    onClick(reason);
    setReason('');
    setIsOpen(false);
  };

  const handleSkip = () => {
    onClick();
    setReason('');
    setIsOpen(false);
  };
  
  return (
    <>
      <Button 
        variant={variant}
        size={size}
        onClick={handleClick}
        disabled={isLoading}
        className={`relative group ${className} ${hasMindBlown ? 'bg-yellow-500 hover:bg-yellow-600 text-black' : ''}`}
      >
        <motion.span
          initial={{ scale: 1 }}
          animate={{ 
            scale: hasMindBlown ? [1, 1.2, 1] : 1 
          }}
          transition={{ 
            duration: 0.5,
            repeat: hasMindBlown ? 0 : 0,
            repeatType: "reverse"
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
          <div className="absolute -top-1 -right-1">
            <div className="w-3 h-3 bg-red-500 rounded-full animate-pulse" />
          </div>
        )}
      </Button>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Why was this mind-blowing?</DialogTitle>
            <DialogDescription>
              Share what amazed you about this research (optional)
            </DialogDescription>
          </DialogHeader>
          
          <Textarea
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="This research amazed me because..."
            className="min-h-[100px]"
          />
          
          <DialogFooter className="flex justify-between sm:justify-between gap-2">
            <Button onClick={handleSkip} variant="outline">
              Skip
            </Button>
            <Button onClick={handleSubmit} disabled={isLoading}>
              Submit Mind-Blow 🤯
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default MindBlowButton;

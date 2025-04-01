
import React from 'react';
import { Button } from '../ui/button';
import { X, Share } from 'lucide-react';
import MindBlowButton from '../MindBlowButton';
import { useMindBlow } from '../../hooks/use-mind-blow';
import { motion } from 'framer-motion';

interface DetailNavButtonsProps {
  paperDoi: string;
  onClose: () => void;
}

const DetailNavButtons: React.FC<DetailNavButtonsProps> = ({ paperDoi, onClose }) => {
  const { hasMindBlown, count, isLoading, isTopPaper, toggleMindBlow } = useMindBlow(paperDoi);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Amazing Research Paper',
          text: 'Check out this interesting paper I found!',
          url: `${window.location.origin}/paper/${paperDoi}`
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(`${window.location.origin}/paper/${paperDoi}`);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
    <div className="fixed bottom-8 right-8 flex space-x-3">
      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white shadow-md text-gray-700 hover:bg-white/90 transition-colors"
          onClick={handleShare}
        >
          <Share className="h-5 w-5" />
        </Button>
      </motion.div>

      <MindBlowButton
        hasMindBlown={hasMindBlown}
        count={count}
        isTopPaper={isTopPaper}
        isLoading={isLoading}
        onClick={toggleMindBlow}
        size="icon"
        variant="outline"
        className="rounded-full bg-white shadow-md text-gray-700 hover:bg-white/90 transition-colors"
        showCount={false}
      />

      <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.95 }}>
        <Button
          variant="outline"
          size="icon"
          className="rounded-full bg-white shadow-md text-gray-700 hover:bg-white/90 transition-colors"
          onClick={onClose}
        >
          <X className="h-5 w-5" />
        </Button>
      </motion.div>
    </div>
  );
};

export default DetailNavButtons;

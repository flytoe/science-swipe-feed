
import React from 'react';
import { Share } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';

interface ShareButtonProps {
  paperId: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ paperId }) => {
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: 'Amazing Research Paper',
          text: 'Check out this interesting paper I found!',
          url: `${window.location.origin}/paper/${paperId}`
        });
      } else {
        await navigator.clipboard.writeText(`${window.location.origin}/paper/${paperId}`);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  return (
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
  );
};

export default ShareButton;

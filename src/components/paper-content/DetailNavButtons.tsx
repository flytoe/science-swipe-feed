
import React from 'react';
import { Button } from '../ui/button';
import { X, Share } from 'lucide-react';
import MindBlowButton from '../MindBlowButton';
import { useMindBlow } from '../../hooks/use-mind-blow';

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
      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        onClick={handleShare}
      >
        <Share className="h-5 w-5" />
      </Button>

      <MindBlowButton
        hasMindBlown={hasMindBlown}
        count={count}
        isTopPaper={isTopPaper}
        isLoading={isLoading}
        onClick={toggleMindBlow}
        size="icon"
        variant="outline"
        className="rounded-full bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        showCount={false}
      />

      <Button
        variant="outline"
        size="icon"
        className="rounded-full bg-black/50 backdrop-blur-sm border-white/20 text-white hover:bg-white/20"
        onClick={onClose}
      >
        <X className="h-5 w-5" />
      </Button>
    </div>
  );
};

export default DetailNavButtons;

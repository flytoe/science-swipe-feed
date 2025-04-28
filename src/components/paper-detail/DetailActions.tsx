
import React from 'react';
import { X } from 'lucide-react';
import { Button } from '../ui/button';
import { motion } from 'framer-motion';
import ShareButton from './ShareButton';
import MindBlowButton from '../MindBlowButton';
import { useMindBlow } from '../../hooks/use-mind-blow';

interface DetailActionsProps {
  paperId: string | number;
  onClose: () => void;
}

const DetailActions: React.FC<DetailActionsProps> = ({ paperId, onClose }) => {
  const { hasMindBlown, count, isLoading, isTopPaper, toggleMindBlow } = 
    useMindBlow(paperId);

  return (
    <div className="flex space-x-3">
      <ShareButton paperId={paperId.toString()} />

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

export default DetailActions;

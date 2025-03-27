
import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpDown } from 'lucide-react';

const SwipeInstructions: React.FC = () => {
  return (
    <motion.div
      className="swipe-instruction"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
    >
      <div className="flex items-center gap-2">
        <ArrowUpDown size={16} />
        <span>Swipe up/down to navigate</span>
      </div>
    </motion.div>
  );
};

export default SwipeInstructions;

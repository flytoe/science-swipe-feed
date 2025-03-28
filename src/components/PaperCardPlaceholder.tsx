
import React from 'react';
import { motion } from 'framer-motion';

interface PaperCardPlaceholderProps {
  variants: any;
  isActive: boolean;
}

const PaperCardPlaceholder: React.FC<PaperCardPlaceholderProps> = ({ variants, isActive }) => {
  return (
    <motion.div 
      className="paper-card bg-black text-white rounded-lg overflow-hidden h-full w-full flex items-center justify-center"
      variants={variants}
      initial="inactive"
      animate={isActive ? "active" : "inactive"}
      exit="inactive"
    >
      <p>No paper data available</p>
    </motion.div>
  );
};

export default PaperCardPlaceholder;


import React from 'react';
import { Badge } from './ui/badge';
import { motion } from 'framer-motion';

interface MindBlowBadgeProps {
  count: number;
  className?: string;
}

const MindBlowBadge: React.FC<MindBlowBadgeProps> = ({
  count,
  className = ''
}) => {
  if (count <= 0) return null;

  const isTopPaper = count >= 5; // Threshold for "top paper"

  return (
    <motion.div
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      className={`inline-flex ${className}`}
    >
      <Badge
        variant={isTopPaper ? "default" : "outline"}
        className={`
          flex items-center gap-1 
          ${isTopPaper 
            ? 'bg-gradient-to-r from-yellow-500 to-orange-500 text-black font-bold border-none' 
            : 'bg-white/10 text-white border-white/20'}
        `}
      >
        <span className="mr-0.5">🤯</span>
        <span>{count}</span>
        {isTopPaper && (
          <motion.span 
            initial={{ scale: 1 }}
            animate={{ scale: [1, 1.2, 1] }}
            transition={{ duration: 1, repeat: Infinity, repeatType: "reverse" }}
            className="ml-0.5"
          >
            ⭐
          </motion.span>
        )}
      </Badge>
    </motion.div>
  );
};

export default MindBlowBadge;

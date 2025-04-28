
import React from 'react';
import { motion } from 'framer-motion';
import { Paper } from '../../lib/supabase';
import PaperCard from '../PaperCard';

interface PeekingCardsProps {
  prevPaper: Paper;
  nextPaper: Paper;
}

const PeekingCards: React.FC<PeekingCardsProps> = ({ prevPaper, nextPaper }) => {
  return (
    <>
      {/* Previous card (peeking from left) */}
      <motion.div
        key={`prev-peek-${prevPaper.id}`}
        className="absolute inset-0 w-full pointer-events-none"
        initial={{ x: "-110%", scale: 0.85, opacity: 0.7, zIndex: 1 }}
        animate={{ x: "-85%", scale: 0.85, opacity: 0.7, zIndex: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      >
        <div className="w-full h-full rounded-lg overflow-hidden">
          <PaperCard 
            paper={prevPaper}
            isActive={false}
          />
        </div>
      </motion.div>
      
      {/* Next card (peeking from right) */}
      <motion.div
        key={`next-peek-${nextPaper.id}`}
        className="absolute inset-0 w-full pointer-events-none"
        initial={{ x: "110%", scale: 0.85, opacity: 0.7, zIndex: 1 }}
        animate={{ x: "85%", scale: 0.85, opacity: 0.7, zIndex: 1 }}
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30
        }}
        style={{
          willChange: 'transform',
          backfaceVisibility: 'hidden'
        }}
      >
        <div className="w-full h-full rounded-lg overflow-hidden">
          <PaperCard 
            paper={nextPaper}
            isActive={false}
          />
        </div>
      </motion.div>
    </>
  );
};

export default PeekingCards;

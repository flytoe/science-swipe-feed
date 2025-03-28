
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Paper } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import PaperCardPreview from './PaperCardPreview';
import PaperCardDetail from './PaperCardDetail';
import PaperCardPlaceholder from './PaperCardPlaceholder';
import { usePaperData } from '../hooks/use-paper-data';

interface PaperCardProps {
  paper: Paper;
  isActive: boolean;
  isGeneratingImage?: boolean;
  onDetailToggle?: (isOpen: boolean) => void;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper, isActive, isGeneratingImage = false, onDetailToggle }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const navigate = useNavigate();
  
  const cardVariants = {
    active: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    inactive: {
      scale: 0.98,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' }
    }
  };

  const toggleDetail = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newState = !isDetailOpen;
    setIsDetailOpen(newState);
    if (onDetailToggle) onDetailToggle(newState);
  };

  const handleCardClick = () => {
    toggleDetail();
  };
  
  // If paper is undefined or null, return a placeholder card
  if (!paper) {
    return <PaperCardPlaceholder variants={cardVariants} isActive={isActive} />;
  }

  // Extract and format paper data using custom hook
  const {
    categories,
    formattedDate,
    imageSrc, 
    displayTitle,
    firstTakeaway,
    formattedTakeaways
  } = usePaperData(paper);

  return (
    <motion.div 
      className="paper-card bg-black text-white rounded-lg overflow-hidden cursor-pointer h-full w-full"
      variants={cardVariants}
      initial="inactive"
      animate={isActive ? "active" : "inactive"}
      exit="inactive"
      onClick={handleCardClick}
      layout
    >
      <AnimatePresence mode="wait">
        {!isDetailOpen ? (
          <PaperCardPreview 
            imageSrc={imageSrc}
            displayTitle={displayTitle}
            formattedDate={formattedDate}
            categories={categories}
            firstTakeaway={firstTakeaway}
            isGeneratingImage={isGeneratingImage}
          />
        ) : (
          <PaperCardDetail
            displayTitle={displayTitle}
            title_org={paper.title_org}
            abstract_org={paper.abstract_org}
            formattedDate={formattedDate}
            doi={paper.doi}
            takeaways={formattedTakeaways}
            creator={paper.creator}
            imageSrc={imageSrc}
            onClose={toggleDetail}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaperCard;

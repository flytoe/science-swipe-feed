
import React, { useState } from 'react';
import { type Paper } from '../lib/supabase';
import { motion } from 'framer-motion';
import PaperCardPreview from './PaperCardPreview';
import PaperCardContent from './PaperCardContent';
import PaperCardPlaceholder from './PaperCardPlaceholder';
import { usePaperData } from '../hooks/use-paper-data';
import ImagePromptModal from './ImagePromptModal';

interface PaperCardProps {
  paper: Paper;
  isActive: boolean;
  isGeneratingImage?: boolean;
  onDetailToggle?: (isOpen: boolean) => void;
}

const PaperCard: React.FC<PaperCardProps> = ({ 
  paper, 
  isActive, 
  isGeneratingImage = false,
  onDetailToggle 
}) => {
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [localIsGeneratingImage, setLocalIsGeneratingImage] = useState(false);
  
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
  
  // If paper is undefined or null, return a placeholder card
  if (!paper) {
    return <PaperCardPlaceholder variants={cardVariants} isActive={isActive} />;
  }

  // Extract and format paper data using custom hook
  const {
    categories,
    formattedCategoryNames,
    formattedDate,
    imageSrc, 
    displayTitle,
    firstTakeaway,
    formattedTakeaways,
    isGeneratingImage: isGeneratingFromHook,
    imageSourceType,
    refreshImageData
  } = usePaperData(paper);

  const handleRegenerationStart = () => {
    setLocalIsGeneratingImage(true);
  };

  const handleRegenerationComplete = (imageUrl: string | null) => {
    setLocalIsGeneratingImage(false);
    if (imageUrl) {
      // Refresh the data to show the new image
      refreshImageData(imageUrl);
    }
  };

  const handleOpenPromptModal = () => {
    setIsPromptModalOpen(true);
  };

  const isGenerating = isGeneratingImage || localIsGeneratingImage || isGeneratingFromHook;

  return (
    <motion.div 
      className="paper-card bg-black text-white min-h-[100vh] w-full"
      variants={cardVariants}
      initial="inactive"
      animate={isActive ? "active" : "inactive"}
      exit="inactive"
      layout
    >
      {/* Preview section at the top (larger height) */}
      <div className="h-[70vh] sticky top-0 z-10">
        <PaperCardPreview 
          imageSrc={imageSrc}
          displayTitle={displayTitle}
          formattedDate={formattedDate}
          categories={formattedCategoryNames}
          firstTakeaway={firstTakeaway}
          isGeneratingImage={isGenerating}
          imageSourceType={imageSourceType}
          onRegenerateClick={handleOpenPromptModal}
          paperDoi={paper.doi}
        />
      </div>
      
      {/* Detailed content section with padding to prevent action bar overlap */}
      <div className="bg-black pt-8 min-h-screen pb-24">
        <PaperCardContent
          title={displayTitle}
          title_org={paper.title_org}
          abstract_org={paper.abstract_org}
          formattedDate={formattedDate}
          doi={paper.doi}
          takeaways={formattedTakeaways}
          creator={paper.creator}
          imageSrc={imageSrc}
          hideHeroImage={true} // Hide duplicate hero image in content section
        />
      </div>

      <ImagePromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        paper={paper}
        onRegenerationComplete={handleRegenerationComplete}
      />
    </motion.div>
  );
};

export default PaperCard;

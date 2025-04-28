
import React, { useState, memo } from 'react';
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
  onDetailClick?: () => void;
}

const PaperCard: React.FC<PaperCardProps> = ({ 
  paper, 
  isActive, 
  isGeneratingImage = false,
  onDetailToggle,
  onDetailClick
}) => {
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [localIsGeneratingImage, setLocalIsGeneratingImage] = useState(false);
  
  const cardVariants = {
    active: {
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    inactive: {
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' }
    }
  };
  
  if (!paper) {
    return <PaperCardPlaceholder variants={cardVariants} isActive={isActive} />;
  }

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
    refreshImageData,
    paper: paperData
  } = usePaperData(paper);

  const handleRegenerationStart = () => {
    setLocalIsGeneratingImage(true);
  };

  const handleRegenerationComplete = (imageUrl: string | null) => {
    setLocalIsGeneratingImage(false);
    if (imageUrl) {
      refreshImageData(imageUrl);
    }
  };

  const handleOpenPromptModal = () => {
    setIsPromptModalOpen(true);
  };

  const isGenerating = isGeneratingImage || localIsGeneratingImage || isGeneratingFromHook;
  const paperId = typeof paper.id === 'number' ? paper.id.toString() : paper.id;

  return (
    <div className="paper-card bg-black text-white min-h-[100vh] w-full">
      <div className="h-[70vh] relative">
        <PaperCardPreview 
          imageSrc={imageSrc}
          displayTitle={displayTitle}
          formattedDate={formattedDate}
          categories={formattedCategoryNames}
          firstTakeaway={firstTakeaway}
          isGeneratingImage={isGenerating}
          imageSourceType={imageSourceType}
          paper={paperData}
          onDetailClick={onDetailClick}
          onRegenerateComplete={handleRegenerationComplete}
        />
      </div>
      
      <div className="bg-gradient-to-t from-black via-black to-transparent pt-8 min-h-[80vh] -mt-28 relative z-10">
        <PaperCardContent
          title={displayTitle}
          title_org={paper.title_org}
          abstract={paper.abstract_org}
          abstract_org={paper.abstract_org}
          formattedDate={formattedDate}
          doi={paperId}
          takeaways={formattedTakeaways}
          creator={paper.creator}
          imageSrc={imageSrc}
          hideHeroImage={true}
        />
      </div>

      <ImagePromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        paper={paper}
        onRegenerationComplete={handleRegenerationComplete}
      />
    </div>
  );
};

// Memoize the component to prevent unnecessary rerenders
export default memo(PaperCard);

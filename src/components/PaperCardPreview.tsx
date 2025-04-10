
import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import PaperCardMedia from './PaperCardMedia';
import MindBlowBadge from './MindBlowBadge';
import { useMindBlow } from '../hooks/use-mind-blow';
import { Paper } from '../lib/supabase';

interface PaperCardPreviewProps {
  imageSrc: string;
  displayTitle: string;
  formattedDate: string;
  categories: string[];
  firstTakeaway: string;
  isGeneratingImage?: boolean;
  imageSourceType?: 'default' | 'database' | 'generated' | 'runware';
  paper: Paper | null;
  onDetailClick?: () => void;
  onRegenerateComplete?: (imageUrl: string | null) => void;
}

const PaperCardPreview: React.FC<PaperCardPreviewProps> = ({
  imageSrc,
  displayTitle,
  formattedDate,
  categories,
  firstTakeaway,
  isGeneratingImage = false,
  imageSourceType = 'database',
  paper,
  onDetailClick,
  onRegenerateComplete
}) => {
  // Get mind-blow data for the paper
  const { count: mindBlowCount } = useMindBlow(paper?.id || '');

  const handleClick = (e: React.MouseEvent) => {
    if (onDetailClick) {
      e.preventDefault();
      onDetailClick();
    }
  };

  return (
    <motion.div
      className="h-full flex flex-col relative cursor-pointer"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
    >
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <PaperCardMedia 
          imageSrc={imageSrc}
          imageAlt={displayTitle}
          categories={[]}
          isGenerating={isGeneratingImage}
          imageSourceType={imageSourceType}
          paper={paper}
          onRegenerateComplete={onRegenerateComplete}
        />
      </div>
      
      {mindBlowCount > 0 && (
        <div className="absolute top-4 right-4 z-20">
          <MindBlowBadge count={mindBlowCount} />
        </div>
      )}
      
      <div className="relative z-10 mt-auto p-6 pt-36 pb-8 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="bg-white/10 text-white border-none">
            {formattedDate}
          </Badge>
          
          {categories.slice(0, 2).map((category, idx) => (
            <Badge 
              key={idx}
              variant="outline" 
              className="bg-white/10 text-white border-none"
            >
              {category}
            </Badge>
          ))}
        </div>
        
        <h2 className="text-3xl font-bold leading-tight text-white drop-shadow-lg mb-2">
          {displayTitle}
        </h2>
      </div>
    </motion.div>
  );
};

// Memoize the component to prevent unnecessary rerenders
export default memo(PaperCardPreview);

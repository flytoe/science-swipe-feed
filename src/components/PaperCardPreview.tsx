
import React from 'react';
import { motion } from 'framer-motion';
import { Badge } from './ui/badge';
import PaperCardMedia from './PaperCardMedia';

interface PaperCardPreviewProps {
  imageSrc: string;
  displayTitle: string;
  formattedDate: string;
  categories: string[];
  firstTakeaway: string;
  isGeneratingImage?: boolean;
  imageSourceType?: 'default' | 'database' | 'runware';
}

const PaperCardPreview: React.FC<PaperCardPreviewProps> = ({
  imageSrc,
  displayTitle,
  formattedDate,
  categories,
  firstTakeaway,
  isGeneratingImage = false,
  imageSourceType = 'database'
}) => {
  return (
    <motion.div
      className="h-full flex flex-col relative"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      {/* Background Image - Full Height */}
      <div className="absolute inset-0 w-full h-full overflow-hidden">
        <PaperCardMedia 
          imageSrc={imageSrc}
          imageAlt={displayTitle}
          categories={[]}
          isGenerating={isGeneratingImage}
          imageSourceType={imageSourceType}
        />
      </div>
      
      {/* Content overlaid on the image - positioned at the bottom */}
      <div className="relative z-10 mt-auto p-6 pt-36 pb-8 bg-gradient-to-t from-black/95 via-black/80 to-transparent">
        {/* Date and categories */}
        <div className="flex flex-wrap gap-2 mb-3">
          <Badge variant="outline" className="bg-white/10 text-white border-none">
            {formattedDate}
          </Badge>
          
          {categories.slice(0, 2).map((category, idx) => (
            <Badge 
              key={idx}
              variant="outline" 
              className="bg-white/10 text-white border-none capitalize"
            >
              {category}
            </Badge>
          ))}
        </div>
        
        {/* Title with improved visibility */}
        <h2 className="text-3xl font-bold leading-tight text-white drop-shadow-lg mb-2">
          {displayTitle}
        </h2>
      </div>
    </motion.div>
  );
};

export default PaperCardPreview;

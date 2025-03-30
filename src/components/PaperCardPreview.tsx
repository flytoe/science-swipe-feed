
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
}

const PaperCardPreview: React.FC<PaperCardPreviewProps> = ({
  imageSrc,
  displayTitle,
  formattedDate,
  categories,
  firstTakeaway,
  isGeneratingImage = false
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
        />
        {/* Gradient overlay for better text readability */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/70 to-transparent" />
      </div>
      
      {/* Content overlaid on the image */}
      <div className="relative z-10 mt-auto p-4 bg-gradient-to-t from-black/90 via-black/70 to-transparent">
        {/* Date and categories */}
        <div className="flex flex-wrap gap-2 mb-2">
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
        <h2 className="text-2xl font-bold leading-tight text-white drop-shadow-sm">
          {displayTitle}
        </h2>
      </div>
    </motion.div>
  );
};

export default PaperCardPreview;

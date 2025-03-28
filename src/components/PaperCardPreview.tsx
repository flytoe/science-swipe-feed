
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
      className="h-full flex flex-col"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="flex-1">
        <PaperCardMedia 
          imageSrc={imageSrc}
          imageAlt={displayTitle}
          categories={[]}
          isGenerating={isGeneratingImage}
        />
        
        <div className="p-4 space-y-4">
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
          
          {/* Title */}
          <h2 className="text-2xl font-bold leading-tight">
            {displayTitle}
          </h2>
          
          {/* First highlight */}
          {firstTakeaway && (
            <div className="border-l-2 border-yellow-400 pl-3 py-1">
              <p className="text-white/80">{firstTakeaway}</p>
            </div>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PaperCardPreview;

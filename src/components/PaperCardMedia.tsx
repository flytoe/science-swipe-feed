
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CategoryTag from './CategoryTag';
import { Loader2 } from 'lucide-react';

interface PaperCardMediaProps {
  imageSrc: string;
  imageAlt: string;
  categories: string[];
  isGenerating?: boolean;
}

const PaperCardMedia: React.FC<PaperCardMediaProps> = ({ 
  imageSrc, 
  imageAlt, 
  categories,
  isGenerating = false
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  // Reset states when image source changes
  useEffect(() => {
    setImageLoaded(false);
    setImageError(false);
  }, [imageSrc]);

  const handleImageError = () => {
    console.error(`Failed to load image: ${imageSrc}`);
    setImageError(true);
    setImageLoaded(true); // To remove loading state
  };

  return (
    <div className="relative">
      <div 
        className={`paper-card-image-container relative overflow-hidden ${
          !imageLoaded || isGenerating ? 'bg-gray-200' : ''
        }`}
      >
        {(isGenerating || (!imageLoaded && !imageError)) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        )}
        
        {imageSrc && !imageError && (
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            className="paper-card-image"
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-200">
            <p className="text-gray-500">Image not available</p>
          </div>
        )}
      </div>
      
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent">
        <div className="flex flex-wrap">
          {categories.map((category, index) => (
            <CategoryTag key={index} category={category} />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PaperCardMedia;

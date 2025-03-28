
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
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
        className={`relative overflow-hidden aspect-[16/9] ${
          !imageLoaded || isGenerating ? 'bg-gray-900' : ''
        }`}
      >
        {(isGenerating || (!imageLoaded && !imageError)) && (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
          </div>
        )}
        
        {imageSrc && !imageError && (
          <motion.img
            src={imageSrc}
            alt={imageAlt}
            className="w-full h-full object-cover"
            initial={{ opacity: 0 }}
            animate={{ opacity: imageLoaded ? 1 : 0 }}
            transition={{ duration: 0.5 }}
            onLoad={() => setImageLoaded(true)}
            onError={handleImageError}
            loading="lazy"
          />
        )}
        
        {imageError && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900">
            <p className="text-gray-400">Image not available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperCardMedia;

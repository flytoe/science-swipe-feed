
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, ImageIcon } from 'lucide-react';
import { useIsMobile } from '../hooks/use-mobile';
import { AspectRatio } from './ui/aspect-ratio';

interface PaperCardMediaProps {
  imageSrc: string;
  imageAlt: string;
  categories: string[];
  isGenerating?: boolean;
  imageSourceType?: 'default' | 'database' | 'runware';
}

const PaperCardMedia: React.FC<PaperCardMediaProps> = ({ 
  imageSrc, 
  imageAlt, 
  categories,
  isGenerating = false,
  imageSourceType = 'database'
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);
  const isMobile = useIsMobile();

  // Log image source when component mounts or image source changes
  useEffect(() => {
    console.log(`Image source for "${imageAlt}": ${imageSourceType}`, { 
      url: imageSrc,
      isGenerating
    });
  }, [imageSrc, imageSourceType, imageAlt, isGenerating]);

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
    <div className="relative h-full w-full">
      <div className="absolute inset-0">
        {(isGenerating || (!imageLoaded && !imageError)) && (
          <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-10">
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
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-gray-900">
            <ImageIcon className="h-10 w-10 text-gray-600 mb-2" />
            <p className="text-gray-400">Image not available</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default PaperCardMedia;

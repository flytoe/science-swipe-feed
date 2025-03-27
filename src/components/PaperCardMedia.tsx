
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CategoryTag from './CategoryTag';

interface PaperCardMediaProps {
  imageSrc: string;
  imageAlt: string;
  categories: string[];
}

const PaperCardMedia: React.FC<PaperCardMediaProps> = ({ 
  imageSrc, 
  imageAlt, 
  categories 
}) => {
  const [imageLoaded, setImageLoaded] = useState(false);

  return (
    <div className="relative">
      <div className={`paper-card-image-container relative overflow-hidden ${!imageLoaded ? 'bg-gray-200 animate-pulse' : ''}`}>
        <motion.img
          src={imageSrc}
          alt={imageAlt}
          className="paper-card-image"
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          transition={{ duration: 0.5 }}
          onLoad={() => setImageLoaded(true)}
          loading="lazy"
        />
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

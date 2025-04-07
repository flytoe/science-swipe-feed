
import React from 'react';
import { motion } from 'framer-motion';
import MindBlowBadge from '../MindBlowBadge';

interface HeroImageSectionProps {
  imageSrc?: string;
  title: string;
  creator?: string[] | string | null;
  categories?: string[];
  mindBlowCount?: number;
  isTopPaper?: boolean;
}

const HeroImageSection: React.FC<HeroImageSectionProps> = ({
  imageSrc,
  title,
  creator,
  categories,
  mindBlowCount = 0,
  isTopPaper = false
}) => {
  // Format the creators for display
  const creatorDisplay = React.useMemo(() => {
    if (!creator) return null;
    if (typeof creator === 'string') return creator;
    if (Array.isArray(creator)) return creator.join(', ');
    return null;
  }, [creator]);

  return (
    <div className="relative w-full h-80 overflow-hidden rounded-lg bg-gray-100">
      {/* Background Image with Gradient Overlay */}
      <div className="absolute inset-0 w-full h-full">
        {imageSrc && (
          <img
            src={imageSrc}
            alt={title}
            className="w-full h-full object-cover"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-white/90 via-white/60 to-transparent" />
      </div>

      {/* Content Overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6">
        {/* Title */}
        <motion.h1 
          className="text-3xl font-bold text-gray-800 mb-2 drop-shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {title}
        </motion.h1>
        
        {/* Creator */}
        {creatorDisplay && (
          <motion.p 
            className="text-sm text-gray-600 mb-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            By {creatorDisplay}
          </motion.p>
        )}

        {/* Mind Blow Badge */}
        {mindBlowCount > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring" }}
            className="absolute top-4 right-4"
          >
            <MindBlowBadge count={mindBlowCount} />
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default HeroImageSection;

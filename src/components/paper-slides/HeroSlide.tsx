
import React from 'react';
import { motion } from 'framer-motion';
import MindBlowBadge from '../MindBlowBadge';
import { Badge } from '../ui/badge';
import RegenerateImageButton from '../RegenerateImageButton';
import { Paper } from '../../lib/supabase';
import PostTypeBadge from '../PostTypeBadge';

interface HeroSlideProps {
  title: string;
  imageSrc: string;
  formattedDate: string;
  mindBlowCount?: number;
  creator?: string[] | string | null;
  isFirstSlide?: boolean;
  activeIndex?: number;
  paper?: Paper | null;
}

const HeroSlide: React.FC<HeroSlideProps> = ({
  title,
  imageSrc,
  formattedDate,
  mindBlowCount,
  creator,
  isFirstSlide = false,
  activeIndex = 0,
  paper
}) => {
  const creatorDisplay = React.useMemo(() => {
    if (!creator || isFirstSlide || activeIndex === 0) return null;
    if (typeof creator === 'string') return creator;
    if (Array.isArray(creator)) return creator.join(', ');
    return null;
  }, [creator, isFirstSlide, activeIndex]);

  return (
    <div className="relative w-full h-full min-h-[280px]">
      <div className="absolute inset-0">
        <img src={imageSrc} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/50 to-transparent" />
      </div>

      <div className="absolute top-4 left-4 z-10 flex items-center gap-2">
        <Badge variant="outline" className="bg-white/70 backdrop-blur-sm text-gray-700 border-gray-200">
          {formattedDate}
        </Badge>
        {paper?.post_type && (
          <PostTypeBadge type={paper.post_type} size="sm" />
        )}
        {paper && <RegenerateImageButton paper={paper} variant="outline" size="icon" className="bg-white/70 backdrop-blur-sm text-gray-700 border-gray-200 hover:bg-white/80" />}
      </div>

      {mindBlowCount && mindBlowCount > 0 && (
        <div className="absolute top-4 right-16 z-30">
          <MindBlowBadge count={mindBlowCount} />
        </div>
      )}

      <div className="absolute bottom-0 left-0 right-0 p-6 z-10">
        <motion.h1 
          initial={{
            opacity: 0,
            y: 20
          }} 
          animate={{
            opacity: 1,
            y: 0
          }} 
          transition={{
            delay: 0.2
          }} 
          className="text-3xl font-bold text-white mb-4 py-[24px]"
        >
          {title}
        </motion.h1>
        
        {creatorDisplay && (
          <motion.p 
            className="text-sm text-white/80" 
            initial={{
              opacity: 0
            }} 
            animate={{
              opacity: 1
            }} 
            transition={{
              delay: 0.3
            }}
          >
            By {creatorDisplay}
          </motion.p>
        )}
      </div>
    </div>
  );
};

export default HeroSlide;

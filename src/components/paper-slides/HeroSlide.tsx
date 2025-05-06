
import React from 'react';
import PostTypeBadge from '../PostTypeBadge';
import { Paper } from '../../lib/supabase';

interface HeroSlideProps {
  title: string;
  imageSrc: string;
  formattedDate?: string;
  paper?: Paper;
  postType?: string | null;
}

const HeroSlide: React.FC<HeroSlideProps> = ({
  title,
  imageSrc,
  formattedDate,
  paper,
  postType
}) => {

  
  return (
    <div className="relative flex items-end min-h-[500px] h-full w-full p-4 md:p-6 rounded-xl overflow-hidden text-white">
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black/30 via-black/0 to-transparent z-0"
        aria-hidden="true"
      />
      
      <div className="absolute top-4 left-4 flex flex-wrap items-start gap-2 z-10">
        {postType && (
          <PostTypeBadge type={postType} size="lg" />
        )}
        {formattedDate && (
          <span className="text-xs px-2 py-1 bg-black/20 backdrop-blur-sm rounded-md">
            {formattedDate}
          </span>
        )}
      </div>
      
      <div className="relative z-10 mt-auto w-full">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          {title}
        </h1>
      </div>
    </div>
  );
};

export default HeroSlide;

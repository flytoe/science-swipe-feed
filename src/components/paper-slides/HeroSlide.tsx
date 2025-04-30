
import React from 'react';
import { Paper } from '../../lib/supabase';
import PostTypeBadge from '../PostTypeBadge';

interface HeroSlideProps {
  title: string;
  imageSrc: string;
  formattedDate?: string;
  creator?: string[] | string | null;
  paper?: Paper;
  postType?: string | null;
}

const HeroSlide: React.FC<HeroSlideProps> = ({
  title,
  imageSrc,
  formattedDate,
  creator,
  paper,
  postType
}) => {
  // Format creator data to be displayed
  let creatorDisplay = '';
  if (creator) {
    if (Array.isArray(creator)) {
      creatorDisplay = creator.join(', ');
    } else {
      creatorDisplay = creator;
    }
  }
  
  return (
    <div className="relative flex items-end min-h-[500px] w-full p-4 md:p-6 rounded-xl overflow-hidden text-white">
      <div 
        className="absolute inset-0 bg-gradient-to-t from-black via-black/50 to-transparent z-0"
        aria-hidden="true"
      />
      
      {(formattedDate || postType) && (
        <div className="absolute top-4 left-4 flex flex-wrap items-start gap-2 z-10">
          {postType && (
            <PostTypeBadge type={postType} />
          )}
          {formattedDate && (
            <span className="text-xs px-2 py-1 bg-white/10 backdrop-blur-sm rounded-md">
              {formattedDate}
            </span>
          )}
        </div>
      )}
      
      <div className="relative z-10 mt-auto">
        <h1 className="text-2xl md:text-3xl font-bold tracking-tight mb-2">
          {title}
        </h1>
        
        {creatorDisplay && (
          <p className="text-sm text-gray-300 mt-2">
            By {creatorDisplay}
          </p>
        )}
      </div>
    </div>
  );
};

export default HeroSlide;

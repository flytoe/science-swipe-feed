
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Paper } from '../lib/supabase';
import { useNavigate } from 'react-router-dom';
import { usePaperData } from '../hooks/use-paper-data';
import RegenerateImageButton from './RegenerateImageButton';
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  CarouselDots // New import for dots
} from './ui/carousel';
import HeroSlide from './paper-slides/HeroSlide';
import TakeawaysSlide from './paper-slides/TakeawaysSlide';
import DetailSlide from './paper-slides/DetailSlide';

interface FeedItemProps {
  paper: Paper;
  index: number;
}

const FeedItem: React.FC<FeedItemProps> = ({ paper, index }) => {
  const navigate = useNavigate();
  const [isRegenerating, setIsRegenerating] = useState(false);
  
  const { 
    formattedCategoryNames, 
    formattedDate, 
    imageSrc, 
    displayTitle,
    refreshImageData,
    formattedTakeaways,
    paper: paperWithData
  } = usePaperData(paper);

  const encodedPaperId = encodeURIComponent(paper.id);
  
  const handleRegenerationComplete = (imageUrl: string | null) => {
    setIsRegenerating(false);
    if (imageUrl) {
      refreshImageData(imageUrl);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="feed-item w-full bg-white rounded-xl overflow-hidden shadow-sm mb-6 border border-gray-100 h-[600px]" // Fixed height
      layout
    >
      <Carousel className="w-full h-full">
        <CarouselContent className="h-full">
          <CarouselItem className="h-full">
            <HeroSlide
              title={displayTitle}
              imageSrc={imageSrc}
              formattedDate={formattedDate}
              creator={paper.creator}
            />
          </CarouselItem>
          
          <CarouselItem className="h-full">
            <TakeawaysSlide takeaways={formattedTakeaways} />
          </CarouselItem>
          
          <CarouselItem className="h-full">
            <DetailSlide
              title={displayTitle}
              title_org={paper.title_org}
              abstract_org={paper.abstract_org}
              doi={paper.doi}
            />
          </CarouselItem>
        </CarouselContent>
        
        <CarouselPrevious className="left-2" />
        <CarouselNext className="right-2" />
        
        {/* Add Carousel Dots */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <CarouselDots />
        </div>
      </Carousel>

      {/* Regenerate button overlay */}
      <div className="absolute top-2 right-2 z-10">
        <RegenerateImageButton 
          paper={paperWithData}
          onRegenerationStart={() => setIsRegenerating(true)}
          onRegenerationComplete={handleRegenerationComplete}
          variant="outline"
          size="icon"
          className="rounded-full bg-black/50 text-white hover:bg-black/70 border-none"
        />
      </div>
      
      {/* Loading overlay */}
      {isRegenerating && (
        <div className="absolute inset-0 bg-black/30 flex items-center justify-center z-20">
          <div className="text-white text-sm">Regenerating...</div>
        </div>
      )}
    </motion.div>
  );
};

export default FeedItem;

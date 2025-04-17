
import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  CarouselDots
} from './ui/carousel';
import HeroSlide from './paper-slides/HeroSlide';
import TakeawaysSlide from './paper-slides/TakeawaysSlide';
import DetailSlide from './paper-slides/DetailSlide';
import { ImageOff } from 'lucide-react';
import MindBlowButton from './MindBlowButton';
import { useMindBlow } from '../hooks/use-mind-blow';

interface FeedItemProps {
  paper: Paper;
  index: number;
}

const FeedItem: React.FC<FeedItemProps> = ({ paper, index }) => {
  const navigate = useNavigate();
  const [isRegenerating, setIsRegenerating] = useState(false);
  const [activeIndex, setActiveIndex] = useState(0);
  
  const { 
    formattedCategoryNames, 
    formattedDate, 
    imageSrc, 
    displayTitle,
    refreshImageData,
    formattedTakeaways,
    paper: paperWithData
  } = usePaperData(paper);

  const { count, hasMindBlown, isLoading, isTopPaper, toggleMindBlow } = useMindBlow(paper.id);

  const encodedPaperId = encodeURIComponent(paper.id);
  
  const handleRegenerationComplete = (imageUrl: string | null) => {
    setIsRegenerating(false);
    if (imageUrl) {
      refreshImageData(imageUrl);
    }
  };

  const handleCarouselChange = (value: string) => {
    setActiveIndex(parseInt(value));
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="feed-item w-full bg-white rounded-xl overflow-hidden shadow-sm mb-6 border border-gray-100 h-[600px]"
      layout
    >
      <Carousel className="w-full h-full" setApi={(api) => {
        // Use the setApi prop instead of onValueChange
        api?.on("select", () => {
          const selectedIndex = api.selectedScrollSnap();
          setActiveIndex(selectedIndex);
        });
      }}>
        <CarouselContent className="h-full">
          {/* Hero Slide */}
          <CarouselItem className="h-full min-h-[280px]">
            <HeroSlide
              title={displayTitle}
              imageSrc={imageSrc}
              formattedDate={formattedDate}
              creator={paper.creator}
              mindBlowCount={count}
            />
          </CarouselItem>
          
          {/* Individual Takeaway Slides */}
          {formattedTakeaways && formattedTakeaways.length > 0 ? (
            formattedTakeaways.map((takeaway, idx) => (
              <CarouselItem key={`takeaway-${idx}`} className="h-full min-h-[280px]">
                <TakeawaysSlide takeaways={[takeaway]} />
              </CarouselItem>
            ))
          ) : (
            <CarouselItem className="h-full min-h-[280px]">
              <TakeawaysSlide takeaways={[]} />
            </CarouselItem>
          )}
          
          {/* Detail Slide */}
          <CarouselItem className="h-full min-h-[280px]">
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
        
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex space-x-2">
          <CarouselDots className="flex gap-1" />
        </div>
      </Carousel>

      {/* Mind Blow button (visible only on the hero slide) */}
      {activeIndex === 0 && (
        <div className="absolute bottom-16 right-6 z-10">
          <MindBlowButton 
            hasMindBlown={hasMindBlown}
            count={count}
            isTopPaper={isTopPaper}
            isLoading={isLoading}
            onClick={toggleMindBlow}
            size="lg"
            showCount={true}
            className="shadow-md"
          />
        </div>
      )}

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

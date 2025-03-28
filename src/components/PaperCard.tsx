
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { type Paper } from '../lib/supabase';
import PaperCardMedia from './PaperCardMedia';
import PaperCardContent from './PaperCardContent';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, X } from 'lucide-react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { parseKeyTakeaways } from '../utils/takeawayParser';

interface PaperCardProps {
  paper: Paper;
  isActive: boolean;
  isGeneratingImage?: boolean;
  onDetailToggle?: (isOpen: boolean) => void;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper, isActive, isGeneratingImage = false, onDetailToggle }) => {
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const navigate = useNavigate();
  
  const categories = Array.isArray(paper.category) ? paper.category : 
    (typeof paper.category === 'string' ? [paper.category] : []);
  
  // Format date as DD.MM.YYYY
  const formattedDate = (() => {
    try {
      return new Date(paper.created_at).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '.');
    } catch (e) {
      console.warn(`Invalid date format for paper ${paper.id}:`, e);
      return 'Unknown date';
    }
  })();
  
  // Default image if none is provided
  const imageSrc = paper.image_url || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop';
  
  const cardVariants = {
    active: {
      scale: 1,
      opacity: 1,
      transition: { duration: 0.3, ease: 'easeOut' }
    },
    inactive: {
      scale: 0.98,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' }
    }
  };

  // Use original title if AI headline is not available
  const displayTitle = paper.ai_headline || paper.title_org;
  
  // Extract first paragraph from key takeaways as highlight
  const firstTakeaway = (() => {
    if (!paper.ai_key_takeaways) return '';
    
    if (Array.isArray(paper.ai_key_takeaways)) {
      if (paper.ai_key_takeaways.length > 0) {
        const firstItem = paper.ai_key_takeaways[0];
        if (typeof firstItem === 'object' && firstItem !== null && 'text' in firstItem) {
          return firstItem.text || '';
        }
        return String(firstItem || '');
      }
    } else if (typeof paper.ai_key_takeaways === 'string') {
      const firstLine = paper.ai_key_takeaways.split('\n')[0];
      return firstLine || '';
    }
    return '';
  })();

  const toggleDetail = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const newState = !isDetailOpen;
    setIsDetailOpen(newState);
    if (onDetailToggle) onDetailToggle(newState);
  };

  const handleCardClick = () => {
    toggleDetail();
  };

  const formattedTakeaways = parseKeyTakeaways(paper.ai_key_takeaways);

  return (
    <motion.div 
      className="paper-card bg-black text-white rounded-lg overflow-hidden cursor-pointer h-full w-full"
      variants={cardVariants}
      initial="inactive"
      animate={isActive ? "active" : "inactive"}
      exit="inactive"
      onClick={handleCardClick}
      layout
    >
      <AnimatePresence mode="wait">
        {!isDetailOpen ? (
          <motion.div
            className="h-full flex flex-col"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            key="card-preview"
          >
            <div className="flex-1">
              <PaperCardMedia 
                imageSrc={imageSrc}
                imageAlt={displayTitle}
                categories={[]}
                isGenerating={isGeneratingImage}
              />
              
              <div className="p-4 space-y-4">
                {/* Date and categories */}
                <div className="flex flex-wrap gap-2 mb-2">
                  <Badge variant="outline" className="bg-white/10 text-white border-none">
                    {formattedDate}
                  </Badge>
                  
                  {categories.slice(0, 2).map((category, idx) => (
                    <Badge 
                      key={idx}
                      variant="outline" 
                      className="bg-white/10 text-white border-none capitalize"
                    >
                      {category}
                    </Badge>
                  ))}
                </div>
                
                {/* Title */}
                <h2 className="text-2xl font-bold leading-tight">
                  {displayTitle}
                </h2>
                
                {/* First highlight */}
                {firstTakeaway && (
                  <div className="border-l-2 border-yellow-400 pl-3 py-1">
                    <p className="text-white/80">{firstTakeaway}</p>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        ) : (
          <motion.div
            className="h-full flex flex-col relative"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            key="card-detail"
          >
            {/* Close button */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute top-2 right-2 z-10 bg-black/50 text-white hover:bg-black/70"
              onClick={(e) => toggleDetail(e)}
            >
              <X size={18} />
            </Button>
            
            <div className="flex-1 overflow-hidden h-full">
              <PaperCardContent
                title={displayTitle}
                title_org={paper.title_org}
                abstract={paper.abstract_org}
                abstract_org={paper.abstract_org}
                formattedDate={formattedDate}
                doi={paper.doi}
                takeaways={formattedTakeaways}
                creator={paper.creator}
                imageSrc={imageSrc}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default PaperCard;


import React from 'react';
import { motion } from 'framer-motion';
import { type Paper } from '../lib/supabase';
import { parseKeyTakeaways } from '../utils/takeawayParser';
import PaperCardMedia from './PaperCardMedia';
import PaperCardContent from './PaperCardContent';

interface PaperCardProps {
  paper: Paper;
  isActive: boolean;
  isGeneratingImage?: boolean;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper, isActive, isGeneratingImage = false }) => {
  const categories = Array.isArray(paper.category) ? paper.category : 
    (typeof paper.category === 'string' ? [paper.category] : []);
  
  // Parse the key takeaways using the extracted utility
  const formattedTakeaways = parseKeyTakeaways(paper.ai_key_takeaways);
    
  // Make sure date parsing is safe
  const formattedDate = (() => {
    try {
      return new Date(paper.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      });
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

  return (
    <motion.div 
      className="paper-card overlapping-design"
      variants={cardVariants}
      initial="inactive"
      animate={isActive ? "active" : "inactive"}
      exit="inactive"
      layout
    >
      <PaperCardMedia 
        imageSrc={imageSrc}
        imageAlt={displayTitle}
        categories={categories}
        isGenerating={isGeneratingImage}
      />
      
      <PaperCardContent
        title={displayTitle}
        title_org={paper.title_org}
        abstract={paper.abstract_org}
        abstract_org={paper.abstract_org}
        formattedDate={formattedDate}
        doi={paper.doi}
        takeaways={formattedTakeaways}
        creator={paper.creator}
      />
    </motion.div>
  );
};

export default PaperCard;


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import CategoryTag from './CategoryTag';
import KeyTakeaway from './KeyTakeaway';
import { type Paper } from '../lib/supabase';
import { Clock } from 'lucide-react';
import { Badge } from './ui/badge';

interface PaperCardProps {
  paper: Paper;
  isActive: boolean;
}

interface FormattedTakeaway {
  text: string;
  tag?: string;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper, isActive }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const categories = Array.isArray(paper.category) ? paper.category : 
    (typeof paper.category === 'string' ? [paper.category] : []);
  
  // Parse the key takeaways from a string with /n/ separators 
  // and extract Roman numerals or capital letters as tags
  const parseKeyTakeaways = (takeaways: string[] | string | null): FormattedTakeaway[] => {
    if (!takeaways) return [];
    
    // Handle if it's already an array of strings
    if (Array.isArray(takeaways)) {
      return takeaways.map(takeaway => {
        const match = takeaway.match(/^([IVX]+|[A-Z])\.\s*(.*)/);
        if (match) {
          return { text: match[2], tag: match[1] };
        }
        return { text: takeaway };
      });
    }
    
    // Handle if it's a single string that needs to be split
    if (typeof takeaways === 'string') {
      // Split by /n/ separator
      const parts = takeaways.split('/n/').filter(part => part.trim() !== '');
      
      return parts.map(part => {
        // Check for Roman numeral or capital letter at the beginning
        const match = part.match(/^([IVX]+|[A-Z])\.\s*(.*)/);
        if (match) {
          return { text: match[2], tag: match[1] };
        }
        return { text: part };
      });
    }
    
    return [];
  };
  
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
      scale: 0.9,
      opacity: 0,
      transition: { duration: 0.3, ease: 'easeIn' }
    }
  };

  // Use original title if AI headline is not available
  const displayTitle = paper.ai_headline || paper.title_org;

  return (
    <motion.div 
      className="paper-card"
      variants={cardVariants}
      initial="inactive"
      animate={isActive ? "active" : "inactive"}
      exit="inactive"
      layout
    >
      <div className="relative">
        <div className={`paper-card-image-container relative overflow-hidden ${!imageLoaded ? 'bg-gray-200 animate-pulse' : ''}`}>
          <motion.img
            src={imageSrc}
            alt={displayTitle}
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
      
      <div className="paper-card-content">
        <h2 className="paper-card-title">
          {displayTitle}
        </h2>
        
        {formattedTakeaways && formattedTakeaways.length > 0 ? (
          <div className="mt-4 mb-6">
            <h3 className="text-sm font-semibold uppercase text-gray-500 mb-2">Key Takeaways</h3>
            <div className="space-y-4">
              {formattedTakeaways.map((takeaway, index) => (
                <div key={index} className="flex flex-col gap-1">
                  {takeaway.tag && (
                    <Badge variant="outline" className="self-start text-xs">
                      {takeaway.tag}
                    </Badge>
                  )}
                  <KeyTakeaway text={takeaway.text} />
                </div>
              ))}
            </div>
          </div>
        ) : paper.abstract_org ? (
          // Fallback to abstract if no takeaways are available
          <p className="text-sm md:text-base text-gray-700 mb-4">
            {paper.abstract_org}
          </p>
        ) : null}
        
        <div className="paper-card-meta">
          <div className="flex items-center">
            <Clock size={14} className="mr-1" />
            <span>{formattedDate}</span>
          </div>
          {paper.doi && (
            <a 
              href={`https://doi.org/${paper.doi}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-500 hover:text-blue-700 transition-colors"
            >
              View Source
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default PaperCard;

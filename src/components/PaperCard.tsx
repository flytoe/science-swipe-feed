
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
  citation?: string;
  tag?: string;
  type?: string;
}

const PaperCard: React.FC<PaperCardProps> = ({ paper, isActive }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  
  const categories = Array.isArray(paper.category) ? paper.category : 
    (typeof paper.category === 'string' ? [paper.category] : []);
  
  // Parse the key takeaways from the new JSON format
  const parseKeyTakeaways = (takeaways: string[] | string | null): FormattedTakeaway[] => {
    if (!takeaways) return [];
    
    // For debugging - log the raw value to understand its format
    console.log('Raw takeaways value:', takeaways);
    
    // If it's already an array of objects
    if (Array.isArray(takeaways) && typeof takeaways[0] === 'object') {
      return takeaways.map(item => ({
        text: item.text || '',
        citation: item.citation || undefined,
        type: item.type || undefined
      }));
    }
    
    // Handle if it's an array of strings (legacy format)
    if (Array.isArray(takeaways) && typeof takeaways[0] === 'string') {
      return takeaways.map(takeaway => {
        // Check if this array item might be a JSON string
        if (typeof takeaway === 'string') {
          try {
            const parsedItem = JSON.parse(takeaway);
            if (typeof parsedItem === 'object' && parsedItem !== null) {
              return {
                text: parsedItem.text || '',
                citation: parsedItem.citation || undefined,
                type: parsedItem.type || undefined
              };
            }
            // If it parsed but isn't the expected format, use old format
            const match = takeaway.match(/^([IVX]+|[A-Z])\.\s*(.*)/);
            if (match) {
              return { text: match[2], tag: match[1] };
            }
            return { text: takeaway };
          } catch (e) {
            // Not JSON, process as regular string using old format
            const match = takeaway.match(/^([IVX]+|[A-Z])\.\s*(.*)/);
            if (match) {
              return { text: match[2], tag: match[1] };
            }
            return { text: takeaway };
          }
        }
        return { text: String(takeaway) };
      });
    }
    
    // Handle if it's a string that needs to be parsed as JSON
    if (typeof takeaways === 'string') {
      try {
        const parsed = JSON.parse(takeaways);
        
        // If it's an array, process it
        if (Array.isArray(parsed)) {
          return parsed.map(item => {
            if (typeof item === 'object' && item !== null) {
              return {
                text: item.text || '',
                citation: item.citation || undefined,
                type: item.type || undefined
              };
            }
            // If array item is a string, use old format
            if (typeof item === 'string') {
              const match = item.match(/^([IVX]+|[A-Z])\.\s*(.*)/);
              if (match) {
                return { text: match[2], tag: match[1] };
              }
              return { text: item };
            }
            return { text: String(item) };
          });
        }
        
        // If it parsed as an object but not an array
        if (typeof parsed === 'object' && parsed !== null) {
          return [{ 
            text: parsed.text || '',
            citation: parsed.citation || undefined,
            type: parsed.type || undefined
          }];
        }
        
        // Fallback for other JSON types
        return [{ text: JSON.stringify(parsed) }];
      } catch (e) {
        // Not valid JSON, use the old format with /n/ separators
        console.log('Splitting by /n/ separator as it\'s not valid JSON');
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
                  <KeyTakeaway 
                    text={takeaway.text} 
                    citation={takeaway.citation}
                    type={takeaway.type}
                  />
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


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Badge } from './ui/badge';
import { Paper } from '../lib/supabase';
import { Link } from 'react-router-dom';
import { usePaperData } from '../hooks/use-paper-data';
import PaperCardTakeaways from './PaperCardTakeaways';
import AbstractSection from './paper-content/AbstractSection';
import { ChevronDown } from 'lucide-react';

interface FeedItemProps {
  paper: Paper;
  index: number;
}

const FeedItem: React.FC<FeedItemProps> = ({ paper, index }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const { 
    formattedCategoryNames, 
    formattedDate, 
    imageSrc, 
    displayTitle,
    formattedTakeaways,
  } = usePaperData(paper);

  // Create properly encoded paper ID for the URL
  const encodedPaperId = encodeURIComponent(paper.doi);
  
  const toggleExpand = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsExpanded(!isExpanded);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      className="feed-item w-full bg-white rounded-xl overflow-hidden shadow-sm mb-6 border border-gray-100"
    >
      <motion.div
        layout
        transition={{ 
          layout: { type: "spring", stiffness: 300, damping: 30 },
          ease: "easeInOut"
        }}
        className="block cursor-pointer"
        onClick={toggleExpand}
      >
        <div className="flex flex-col">
          {/* Square image container */}
          <motion.div 
            layout
            className="aspect-square relative"
          >
            <motion.img 
              layout
              src={imageSrc} 
              alt={displayTitle}
              className="w-full h-full object-cover"
            />
          </motion.div>
          
          {/* Content below image - Apple App Store style */}
          <motion.div layout className="p-4">
            <motion.h2 layout className="text-lg font-semibold text-gray-800 mb-2">
              {displayTitle}
            </motion.h2>
            
            <motion.div layout className="flex flex-wrap gap-2">
              <Badge variant="outline" className="bg-gray-100 text-gray-600 border-none text-xs">
                {formattedDate}
              </Badge>
              
              {formattedCategoryNames.slice(0, 1).map((category, idx) => (
                <Badge 
                  key={idx}
                  variant="outline" 
                  className="bg-gray-100 text-gray-600 border-none text-xs"
                >
                  {category}
                </Badge>
              ))}
            </motion.div>
            
            {/* Expand indicator */}
            <motion.div 
              layout
              animate={{ rotate: isExpanded ? 180 : 0 }}
              className="flex justify-center mt-2"
            >
              <ChevronDown className="h-5 w-5 text-gray-400" />
            </motion.div>
          </motion.div>
        </div>
        
        {/* Expanded content */}
        <AnimatePresence>
          {isExpanded && (
            <motion.div
              layout
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="px-4 pb-6 border-t border-gray-100 pt-4"
            >
              {/* Takeaways section */}
              {formattedTakeaways && formattedTakeaways.length > 0 && (
                <div className="mb-6">
                  <PaperCardTakeaways takeaways={formattedTakeaways} />
                </div>
              )}
              
              {/* Abstract section */}
              {paper.abstract_org && (
                <div className="mb-6">
                  <AbstractSection abstract_org={paper.abstract_org} />
                </div>
              )}
              
              {/* View full details link */}
              <div className="flex justify-center mt-4">
                <Link 
                  to={`/paper/${encodedPaperId}`}
                  className="text-blue-600 font-medium hover:text-blue-700 transition-colors"
                >
                  View Full Details
                </Link>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </motion.div>
  );
};

export default FeedItem;

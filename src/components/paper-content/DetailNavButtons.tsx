
import React from 'react';
import { Button } from '../ui/button';
import { X, ExternalLink } from 'lucide-react';
import { useMindBlow } from '../../hooks/use-mind-blow';
import MindBlowButton from '../MindBlowButton';

interface DetailNavButtonsProps {
  paperDoi: string;
  onClose: () => void;
}

const DetailNavButtons: React.FC<DetailNavButtonsProps> = ({
  paperDoi,
  onClose
}) => {
  const { count, hasMindBlown, isTopPaper, isLoading, toggleMindBlow } = useMindBlow(paperDoi);
  
  // Create the DOI URL with proper handling
  const doiUrl = paperDoi ? (
    paperDoi.startsWith('http') ? paperDoi : `https://doi.org/${paperDoi}`
  ) : undefined;

  return (
    <div className="fixed bottom-4 right-4 flex flex-col items-center justify-center gap-3 z-20">
      {/* Mind Blow Button */}
      <MindBlowButton
        hasMindBlown={hasMindBlown}
        count={count}
        isTopPaper={isTopPaper}
        isLoading={isLoading}
        onClick={toggleMindBlow}
        size="icon"
        className="w-10 h-10 rounded-full shadow-md"
      />
      
      {/* Original Paper Link */}
      {doiUrl && (
        <Button
          variant="outline"
          size="icon"
          className="w-10 h-10 rounded-full bg-blue-950/80 hover:bg-blue-900/90 text-blue-400 border-blue-900/40 shadow-md"
          asChild
        >
          <a 
            href={doiUrl}
            target="_blank"
            rel="noopener noreferrer"
            aria-label="View original paper"
          >
            <ExternalLink size={18} />
          </a>
        </Button>
      )}
      
      {/* Close Button */}
      <Button
        variant="outline"
        size="icon"
        onClick={onClose}
        className="w-10 h-10 rounded-full bg-black/80 backdrop-blur-sm hover:bg-black/60 border-white/10 text-white shadow-md"
        aria-label="Close detail view"
      >
        <X size={18} />
      </Button>
    </div>
  );
};

export default DetailNavButtons;

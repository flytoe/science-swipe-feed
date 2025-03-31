
import React from 'react';
import { RefreshCw } from 'lucide-react';

interface PaperCardMediaProps {
  imageSrc: string;
  imageAlt: string;
  categories: string[];
  isGenerating?: boolean;
  imageSourceType?: 'default' | 'database' | 'generated' | 'runware';
  onRegenerateClick?: () => void;
}

const PaperCardMedia: React.FC<PaperCardMediaProps> = ({
  imageSrc,
  imageAlt,
  categories,
  isGenerating = false,
  imageSourceType = 'database',
  onRegenerateClick
}) => {
  const handleRegenerateClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (onRegenerateClick) {
      onRegenerateClick();
    }
  };

  return (
    <div className="relative h-full w-full">
      {/* Image */}
      <div className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${isGenerating ? 'opacity-30' : 'opacity-100'}`}
        style={{ backgroundImage: `url(${imageSrc})` }}
        aria-label={imageAlt}>
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none" />
      </div>
      
      {/* Loading indicator */}
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <RefreshCw className="h-8 w-8 text-white animate-spin" />
        </div>
      )}
      
      {/* Image source indicator */}
      {imageSourceType === 'generated' && (
        <div className="absolute bottom-2 right-2 bg-black/50 text-xs text-white/70 px-2 py-0.5 rounded-full backdrop-blur-sm">
          AI Generated
        </div>
      )}
      
      {/* Regenerate button */}
      {onRegenerateClick && (
        <button 
          onClick={handleRegenerateClick}
          className="absolute top-2 right-2 p-2 bg-black/50 rounded-full hover:bg-black/70 transition-colors"
          disabled={isGenerating}
          aria-label="Regenerate image"
        >
          <RefreshCw className={`h-4 w-4 text-white ${isGenerating ? 'animate-spin' : ''}`} />
        </button>
      )}
    </div>
  );
};

export default PaperCardMedia;

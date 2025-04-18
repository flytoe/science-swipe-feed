
import React from 'react';
import { Loader2 } from 'lucide-react';
import RegenerateImageButton from './RegenerateImageButton';
import { Paper } from '../lib/supabase';

interface PaperCardMediaProps {
  imageSrc: string;
  imageAlt: string;
  categories: string[];
  isGenerating?: boolean;
  imageSourceType?: 'default' | 'database' | 'generated' | 'runware';
  paper?: Paper | null;
  onRegenerateComplete?: (imageUrl: string | null) => void;
}

const PaperCardMedia: React.FC<PaperCardMediaProps> = ({
  imageSrc,
  imageAlt,
  categories,
  isGenerating = false,
  imageSourceType = 'database',
  paper,
  onRegenerateComplete
}) => {
  return (
    <div className="relative h-full w-full min-h-[280px]">
      {/* Image with object-cover to maintain aspect ratio while filling container */}
      <div 
        className={`absolute inset-0 bg-cover bg-center transition-opacity duration-500 ${isGenerating ? 'opacity-30' : 'opacity-100'}`}
        style={{ backgroundImage: `url(${imageSrc})` }}
        aria-label={imageAlt}
      >
        {/* Dark overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent pointer-events-none" />
      </div>
      
      {/* Loading indicator */}
      {isGenerating && (
        <div className="absolute inset-0 flex items-center justify-center">
          <Loader2 className="h-8 w-8 text-white animate-spin" />
        </div>
      )}
      
      {/* Image source indicator */}
      {imageSourceType === 'generated' || imageSourceType === 'runware' ? (
        <div className="absolute bottom-2 right-2 bg-black/50 text-xs text-white/70 px-2 py-0.5 rounded-full backdrop-blur-sm">
          AI Generated
        </div>
      ) : null}
      
      {/* Regenerate button - now using our enhanced RegenerateImageButton */}
      {paper && (
        <div className="absolute top-2 right-2">
          <RegenerateImageButton 
            paper={paper}
            onRegenerationComplete={onRegenerateComplete}
            variant="outline"
            size="icon"
            className="rounded-full bg-black/50 text-white hover:bg-black/70 border-none"
          />
        </div>
      )}
    </div>
  );
};

export default PaperCardMedia;

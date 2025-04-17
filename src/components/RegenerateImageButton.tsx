
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Paper } from '../lib/supabase';
import ImagePromptModal from './ImagePromptModal';

interface RegenerateImageButtonProps {
  paper: Paper | null;
  onRegenerationStart?: () => void;
  onRegenerationComplete?: (imageUrl: string | null) => void;
  variant?: 'default' | 'outline' | 'link' | 'secondary' | 'ghost' | 'destructive';
  size?: 'default' | 'sm' | 'lg' | 'icon';
  className?: string;
  text?: boolean;
}

const RegenerateImageButton: React.FC<RegenerateImageButtonProps> = ({
  paper,
  onRegenerationStart,
  onRegenerationComplete,
  variant = 'outline',
  size = 'icon',
  className = 'rounded-full border-none bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/60',
  text = false
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent event bubbling
    
    if (!paper) {
      toast.error('No paper available to regenerate image');
      return;
    }

    // Open the modal instead of directly generating
    setIsModalOpen(true);
  };

  const handleRegenerationStart = () => {
    setIsGenerating(true);
    if (onRegenerationStart) onRegenerationStart();
  };

  const handleRegenerationComplete = (imageUrl: string | null) => {
    setIsGenerating(false);
    if (onRegenerationComplete) onRegenerationComplete(imageUrl);
  };

  return (
    <>
      <Button
        variant={variant}
        size={size}
        className={className}
        onClick={handleClick}
        disabled={isGenerating || !paper}
        title="Edit prompt and regenerate image"
      >
        <RefreshCw className={`h-4 w-4 text-white ${isGenerating ? 'animate-spin' : ''}`} />
        {text && <span className="ml-2">Regenerate</span>}
      </Button>
      
      {paper && (
        <ImagePromptModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          paper={paper}
          onRegenerationStart={handleRegenerationStart}
          onRegenerationComplete={handleRegenerationComplete}
        />
      )}
    </>
  );
};

export default RegenerateImageButton;

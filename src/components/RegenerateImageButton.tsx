
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Paper } from '../lib/supabase';
import ImagePromptModal from './ImagePromptModal';

interface RegenerateImageButtonProps {
  paper: Paper | null;
  onRegenerationStart: () => void;
  onRegenerationComplete: (imageUrl: string | null) => void;
}

const RegenerateImageButton: React.FC<RegenerateImageButtonProps> = ({
  paper,
  onRegenerationStart,
  onRegenerationComplete
}) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleClick = () => {
    if (!paper) {
      toast.error('No paper available to regenerate image');
      return;
    }

    if (!paper.ai_image_prompt) {
      toast.error('No image prompt available for this paper');
      return;
    }

    // Open the modal instead of directly generating
    setIsModalOpen(true);
  };

  const handleRegenerationStart = () => {
    setIsGenerating(true);
    onRegenerationStart();
  };

  const handleRegenerationComplete = (imageUrl: string | null) => {
    setIsGenerating(false);
    onRegenerationComplete(imageUrl);
  };

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className="rounded-full border-none bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/60"
        onClick={handleClick}
        disabled={isGenerating || !paper?.ai_image_prompt}
        title="Edit prompt and regenerate image"
      >
        <RefreshCw className={`h-4 w-4 text-white ${isGenerating ? 'animate-spin' : ''}`} />
      </Button>
      
      <ImagePromptModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        paper={paper}
        onRegenerationStart={handleRegenerationStart}
        onRegenerationComplete={handleRegenerationComplete}
      />
    </>
  );
};

export default RegenerateImageButton;

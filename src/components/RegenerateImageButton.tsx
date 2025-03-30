
import React from 'react';
import { RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { generateImageForPaper } from '../lib/imageGenerationService';
import { Paper } from '../lib/supabase';

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
  const [isGenerating, setIsGenerating] = React.useState(false);

  const handleRegenerate = async () => {
    if (!paper) {
      toast.error('No paper available to regenerate image');
      return;
    }

    if (!paper.ai_image_prompt) {
      toast.error('No image prompt available for this paper');
      return;
    }

    try {
      setIsGenerating(true);
      onRegenerationStart();
      toast.info('Regenerating image...');
      
      const imageUrl = await generateImageForPaper(paper);
      
      if (imageUrl) {
        toast.success('Image regenerated successfully');
        onRegenerationComplete(imageUrl);
      } else {
        toast.error('Failed to regenerate image');
        onRegenerationComplete(null);
      }
    } catch (error) {
      console.error('Error regenerating image:', error);
      toast.error('Error regenerating image');
      onRegenerationComplete(null);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="icon"
      className="rounded-full border-none bg-gray-800/50 backdrop-blur-sm hover:bg-gray-700/60"
      onClick={handleRegenerate}
      disabled={isGenerating || !paper?.ai_image_prompt}
      title="Regenerate image"
    >
      <RefreshCw className={`h-4 w-4 text-white ${isGenerating ? 'animate-spin' : ''}`} />
    </Button>
  );
};

export default RegenerateImageButton;

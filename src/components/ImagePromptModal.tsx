
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Paper } from '../lib/supabase';
import { regenerateImage } from '../lib/imageGenerationService';
import { toast } from 'sonner';
import { AspectRatio } from './ui/aspect-ratio';
import { useDatabaseToggle } from '../hooks/use-database-toggle';
import { Loader2 } from 'lucide-react';

interface ImagePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  paper: Paper;
  onRegenerationStart?: () => void;
  onRegenerationComplete?: (imageUrl: string | null) => void;
}

const ImagePromptModal: React.FC<ImagePromptModalProps> = ({ 
  isOpen, 
  onClose, 
  paper,
  onRegenerationStart,
  onRegenerationComplete
}) => {
  const [prompt, setPrompt] = useState(paper.ai_image_prompt || '');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { databaseSource } = useDatabaseToggle();

  // Reset state when modal opens with new paper
  React.useEffect(() => {
    if (isOpen && paper) {
      setPrompt(paper.ai_image_prompt || '');
      setError(null);
    }
  }, [isOpen, paper]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    
    if (!prompt.trim()) {
      setError('Please enter an image prompt');
      return;
    }
    
    try {
      setIsLoading(true);
      onRegenerationStart?.();
      
      // Call the regenerateImage function from imageGenerationService
      const imageUrl = await regenerateImage(paper, prompt);
      
      if (!imageUrl) {
        setError('Failed to generate image. Please try again.');
        setIsLoading(false);
        onRegenerationComplete?.(null);
        return;
      }
      
      toast.success('Image generated successfully!');
      onRegenerationComplete?.(imageUrl);
      onClose();
    } catch (error) {
      console.error('Error in image generation process:', error);
      setError(error instanceof Error ? error.message : 'An unexpected error occurred');
      onRegenerationComplete?.(null);
    } finally {
      setIsLoading(false);
    }
  };

  // Create a click handler for the image area
  const handleImageClick = () => {
    if (!isLoading) {
      handleSubmit(new Event('submit') as any);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !isLoading && !open && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Generate New Image</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {paper.image_url && (
              <div className="mb-4">
                <Label htmlFor="current-image">Current Image</Label>
                <AspectRatio 
                  ratio={16 / 9} 
                  className="bg-gray-100 rounded-md overflow-hidden mt-1 cursor-pointer hover:opacity-90 transition-opacity"
                  onClick={handleImageClick}
                >
                  <img 
                    src={paper.image_url} 
                    alt="Current paper illustration" 
                    className="w-full h-full object-cover"
                  />
                  {isLoading && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/30 text-white">
                      <Loader2 className="h-8 w-8 animate-spin" />
                      <span className="ml-2">Generating...</span>
                    </div>
                  )}
                </AspectRatio>
              </div>
            )}
            
            <div className="grid gap-2">
              <Label htmlFor="prompt">Image Prompt</Label>
              <Input
                id="prompt"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="Enter a detailed description for the image"
                className="w-full"
                disabled={isLoading}
              />
              {error && (
                <p className="text-sm text-red-500 mt-1">{error}</p>
              )}
            </div>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
              disabled={isLoading}
            >
              Cancel
            </Button>
            <Button 
              type="submit" 
              disabled={isLoading || !prompt.trim()}
              className="relative"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  Generating...
                </>
              ) : 'Generate New Image'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePromptModal;

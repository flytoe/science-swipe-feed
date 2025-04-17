
import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Paper } from '../lib/supabase';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { AspectRatio } from './ui/aspect-ratio';
import { useDatabaseToggle } from '../hooks/use-database-toggle';
import { regenerateImage } from '../lib/imageGenerationService';

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
  const { databaseSource } = useDatabaseToggle();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter an image prompt');
      return;
    }
    
    try {
      setIsLoading(true);
      onRegenerationStart?.();
      
      // Call the regenerateImage function from imageGenerationService
      const imageUrl = await regenerateImage(paper, prompt);
      
      if (!imageUrl) {
        toast.error('Failed to generate image');
        setIsLoading(false);
        onRegenerationComplete?.(null);
        return;
      }
      
      toast.success('Image generated successfully!');
      onRegenerationComplete?.(imageUrl);
      onClose();
    } catch (error) {
      console.error('Error in image generation process:', error);
      toast.error('An unexpected error occurred');
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
    <Dialog open={isOpen} onOpenChange={() => !isLoading && onClose()}>
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
                      Generating...
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
            <Button type="submit" disabled={isLoading || !prompt.trim()}>
              {isLoading ? 'Generating...' : 'Generate New Image'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePromptModal;


import React, { useState } from 'react';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from './ui/dialog';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Paper } from '../lib/supabase';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { AspectRatio } from './ui/aspect-ratio';
import { useDatabaseToggle, getIdFieldName } from '../hooks/use-database-toggle';

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
  const idField = getIdFieldName(databaseSource);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!prompt.trim()) {
      toast.error('Please enter an image prompt');
      return;
    }
    
    try {
      setIsLoading(true);
      onRegenerationStart?.();
      
      // First, update the image prompt in the database
      const { error: updateError } = await supabase
        .from(databaseSource)
        .update({ ai_image_prompt: prompt })
        .eq(idField, paper.id);
      
      if (updateError) {
        console.error('Error updating image prompt:', updateError);
        toast.error('Failed to update image prompt');
        return;
      }
      
      // Call the edge function to generate the image
      const response = await fetch('/api/generate-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          prompt,
          paperId: paper.id
        }),
      });
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('Error generating image:', errorText);
        toast.error('Failed to generate image');
        onRegenerationComplete?.(null);
        return;
      }
      
      const result = await response.json();
      const imageUrl = result.imageUrl;
      
      if (!imageUrl) {
        toast.error('No image URL returned');
        onRegenerationComplete?.(null);
        return;
      }
      
      // Update the database with the new image URL
      const { error: imageUpdateError } = await supabase
        .from(databaseSource)
        .update({ image_url: imageUrl })
        .eq(idField, paper.id);
      
      if (imageUpdateError) {
        console.error('Error updating image URL:', imageUpdateError);
        toast.error('Failed to save image URL');
        // Still return the URL even if we couldn't save it
        onRegenerationComplete?.(imageUrl);
        return;
      }
      
      toast.success('Image generated and saved successfully!');
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
                <AspectRatio ratio={16 / 9} className="bg-gray-100 rounded-md overflow-hidden mt-1">
                  <img 
                    src={paper.image_url} 
                    alt="Current paper illustration" 
                    className="w-full h-full object-cover"
                  />
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


import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';
import { Paper } from '../lib/supabase';
import { generateImageForPaper } from '../lib/imageGenerationService';
import { useDatabaseToggle, getIdFieldName } from '../hooks/use-database-toggle';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';

interface ImagePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  paper: Paper | null;
  onRegenerationStart?: () => void;
  onRegenerationComplete: (imageUrl: string | null) => void;
}

const ImagePromptModal: React.FC<ImagePromptModalProps> = ({ 
  isOpen, 
  onClose, 
  paper,
  onRegenerationStart,
  onRegenerationComplete
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const { databaseSource } = useDatabaseToggle();
  const idField = getIdFieldName(databaseSource);

  useEffect(() => {
    if (paper && isOpen) {
      setPrompt(paper.ai_image_prompt || '');
    }
  }, [paper, isOpen]);

  const handlePromptChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setPrompt(e.target.value);
  };

  const handleSubmit = async () => {
    if (!paper) {
      toast.error('No paper available to regenerate image');
      return;
    }

    if (!prompt.trim()) {
      toast.error('Please enter a valid prompt');
      return;
    }

    try {
      setIsGenerating(true);
      if (onRegenerationStart) onRegenerationStart();
      
      toast.info('Updating prompt and regenerating image...', { duration: 10000 });
      
      // First update the prompt in the database
      const { error: updateError } = await supabase
        .from(databaseSource)
        .update({ ai_image_prompt: prompt })
        .eq(idField, paper.doi);
      
      if (updateError) {
        throw new Error(`Failed to update prompt: ${updateError.message}`);
      }
      
      // Update the paper object with the new prompt
      const updatedPaper = { ...paper, ai_image_prompt: prompt };
      
      // Generate a new image with the updated prompt
      const imageUrl = await generateImageForPaper(updatedPaper);
      
      if (imageUrl) {
        toast.success('Image regenerated successfully');
        onRegenerationComplete(imageUrl);
        onClose();
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
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-lg bg-gray-900 border-gray-700 text-white">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">Edit Image Prompt</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-4 py-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-1 text-gray-200">
              Prompt for Image Generation
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={handlePromptChange}
              rows={6}
              placeholder="Enter a detailed prompt to generate an image..."
              className="w-full bg-gray-800 border-gray-700 text-white placeholder-gray-400"
            />
          </div>
        </div>
        
        <DialogFooter className="sm:justify-end">
          <Button
            variant="outline"
            onClick={onClose}
            disabled={isGenerating}
            className="border-gray-600 text-gray-200 hover:bg-gray-800 hover:text-white"
          >
            Cancel
          </Button>
          <Button 
            onClick={handleSubmit} 
            disabled={isGenerating}
            className="bg-blue-600 hover:bg-blue-700 text-white"
          >
            {isGenerating ? 'Generating...' : 'Regenerate Image'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default ImagePromptModal;

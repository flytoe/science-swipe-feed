
import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';
import { supabase } from '../integrations/supabase/client';
import { Paper } from '../lib/supabase';
import { generateImageForPaper } from '../lib/imageGenerationService';

interface ImagePromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  paper: Paper | null;
  onRegenerationComplete: (imageUrl: string | null) => void;
}

const ImagePromptModal: React.FC<ImagePromptModalProps> = ({ 
  isOpen, 
  onClose, 
  paper,
  onRegenerationComplete
}) => {
  const [prompt, setPrompt] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

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
      toast.info('Updating prompt and regenerating image...', { duration: 10000 });
      
      // First update the prompt in the database
      const { error: updateError } = await supabase
        .from('n8n_table')
        .update({ ai_image_prompt: prompt })
        .eq('doi', paper.doi);
      
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70">
      <div className="bg-black border border-gray-800 rounded-lg w-full max-w-lg p-6 relative">
        <Button 
          variant="ghost" 
          size="icon" 
          className="absolute right-4 top-4" 
          onClick={onClose}
        >
          <X className="h-4 w-4" />
        </Button>
        
        <h2 className="text-xl font-semibold mb-4">Edit Image Prompt</h2>
        
        <div className="space-y-4">
          <div>
            <label htmlFor="prompt" className="block text-sm font-medium mb-1">
              Prompt for Image Generation
            </label>
            <Textarea
              id="prompt"
              value={prompt}
              onChange={handlePromptChange}
              rows={6}
              placeholder="Enter a detailed prompt to generate an image..."
              className="w-full bg-gray-900 border-gray-700"
            />
          </div>
          
          <div className="flex justify-end space-x-3 pt-2">
            <Button variant="outline" onClick={onClose} disabled={isGenerating}>
              Cancel
            </Button>
            <Button onClick={handleSubmit} disabled={isGenerating}>
              {isGenerating ? 'Generating...' : 'Regenerate Image'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ImagePromptModal;

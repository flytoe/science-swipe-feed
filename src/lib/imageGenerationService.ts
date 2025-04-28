
import { supabase } from '../integrations/supabase/client';
import { Paper } from '../types/paper';
import { useDatabaseToggle } from '../hooks/use-database-toggle';
import { toast } from 'sonner';

// Check if a paper needs an image and generate one if needed
export const checkAndGenerateImageIfNeeded = async (paper: Paper): Promise<string | null> => {
  if (paper.image_url) {
    console.log('Paper already has an image URL:', paper.image_url);
    return paper.image_url;
  }
  
  // Generate a prompt if none exists
  if (!paper.ai_image_prompt) {
    console.log('No image prompt found. Generating a default prompt.');
    const defaultPrompt = `Scientific visualization of: ${paper.title_org}`;
    
    try {
      // Get the current database source
      const databaseSource = useDatabaseToggle.getState().databaseSource;
      
      // Update the prompt in the database - convert id to number for Europe papers
      const paperId = typeof paper.id === 'string' ? parseInt(paper.id) : paper.id;
      
      const { error } = await supabase
        .from(databaseSource)
        .update({ ai_image_prompt: defaultPrompt })
        .eq('id', paperId);
      
      if (error) {
        console.error('Error updating paper with default prompt:', error);
      } else {
        console.log('Updated paper with default prompt');
        // Set the prompt locally for the current function call
        paper.ai_image_prompt = defaultPrompt;
      }
    } catch (err) {
      console.error('Error in updating prompt:', err);
    }
  }
  
  console.log('Generating image for paper with ID:', paper.id);
  return generateImageForPaper(paper);
};

export const generateImageForPaper = async (paper: Paper): Promise<string | null> => {
  const prompt = paper.ai_image_prompt || `Scientific visualization of: ${paper.title_org}`;
  
  try {
    console.log('Starting image generation with prompt:', prompt);
    
    // Get the current database source and paper ID
    const databaseSource = useDatabaseToggle.getState().databaseSource;
    const paperId = typeof paper.id === 'string' ? parseInt(paper.id) : paper.id;
    
    // Call the edge function to generate an image
    const response = await fetch('https://kwtwhgfcfqgpfjimioiy.supabase.co/functions/v1/generate-image-v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: prompt,
        paperId: paperId,
        databaseSource,
        width: 1024,
        height: 768,
        shouldStorePrompt: true
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorText = errorData?.details || await response.text();
      console.error('Error generating image:', errorText);
      toast.error('Failed to generate image: ' + (errorData?.details || 'Unknown error'));
      return null;
    }
    
    const result = await response.json();
    const imageUrl = result.imageUrl;
    
    if (!imageUrl) {
      console.error('No image URL returned from image generation.');
      toast.error('No image URL returned');
      return null;
    }
    
    console.log('Image generated successfully:', imageUrl);
    toast.success('Image generated successfully!');
    
    // The database is already updated in the edge function
    // but we'll return the image URL for immediate UI updates
    return imageUrl;
  } catch (error) {
    console.error('Error in generateImageForPaper:', error);
    toast.error('Error generating image');
    return null;
  }
};

// Regenerate an image with the current or updated prompt
export const regenerateImage = async (
  paper: Paper, 
  newPrompt?: string
): Promise<string | null> => {
  try {
    // Get the current database source
    const databaseSource = useDatabaseToggle.getState().databaseSource;
    const paperId = typeof paper.id === 'string' ? parseInt(paper.id) : paper.id;
    
    // Use the new prompt if provided, otherwise use the existing one
    const promptToUse = newPrompt || paper.ai_image_prompt || `Scientific visualization of: ${paper.title_org}`;
    
    console.log('Regenerating image for paper:', paperId);
    console.log('Using prompt:', promptToUse);
    console.log('Database source:', databaseSource);
    
    // Call the new edge function to generate the new image
    const response = await fetch('https://kwtwhgfcfqgpfjimioiy.supabase.co/functions/v1/generate-image-v2', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: promptToUse,
        paperId: paperId,
        databaseSource,
        width: 1024,
        height: 768,
        shouldStorePrompt: !!newPrompt // Only store prompt if it's a new one
      }),
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => null);
      const errorText = errorData?.details || await response.text();
      console.error('Error regenerating image:', errorText);
      toast.error('Failed to regenerate image: ' + (errorData?.details || 'Unknown error'));
      return null;
    }
    
    const result = await response.json();
    const imageUrl = result.imageUrl;
    
    if (!imageUrl) {
      console.error('No image URL returned from image regeneration.');
      toast.error('No image URL returned');
      return null;
    }
    
    console.log('Image regenerated successfully:', imageUrl);
    toast.success('Image regenerated successfully!');
    
    return imageUrl;
  } catch (error) {
    console.error('Error in regenerateImage:', error);
    toast.error('Error regenerating image: ' + (error instanceof Error ? error.message : 'Unknown error'));
    return null;
  }
};

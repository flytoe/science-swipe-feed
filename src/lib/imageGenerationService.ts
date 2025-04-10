
import { supabase } from '../integrations/supabase/client';
import { Paper } from './supabase';
import { useDatabaseToggle } from '../hooks/use-database-toggle';

// Check if a paper needs an image and generate one if needed
export const checkAndGenerateImageIfNeeded = async (paper: Paper): Promise<string | null> => {
  if (paper.image_url) {
    console.log('Paper already has an image URL:', paper.image_url);
    return paper.image_url;
  }
  
  if (!paper.ai_image_prompt) {
    console.log('Paper has no image prompt. Skipping image generation.');
    return null;
  }
  
  console.log('Generating image for paper with ID:', paper.id);
  return generateImageForPaper(paper);
};

// Generate an image for a paper and store it in the database
export const generateImageForPaper = async (paper: Paper): Promise<string | null> => {
  if (!paper.ai_image_prompt) {
    console.log('No image prompt available. Cannot generate image.');
    return null;
  }
  
  try {
    console.log('Starting image generation with prompt:', paper.ai_image_prompt);
    
    // Get the current database source
    const databaseSource = useDatabaseToggle.getState().databaseSource;
    const paperId = paper.id;
    
    // Call the edge function to generate an image
    const response = await fetch('/api/generate-image', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        prompt: paper.ai_image_prompt,
        paperId: paperId,
        databaseSource
      }),
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Error generating image:', errorText);
      return null;
    }
    
    const result = await response.json();
    const imageUrl = result.imageUrl;
    
    if (!imageUrl) {
      console.error('No image URL returned from image generation.');
      return null;
    }
    
    console.log('Image generated successfully:', imageUrl);
    
    // Update the database with the new image URL
    const { error } = await supabase
      .from(databaseSource)
      .update({ image_url: imageUrl })
      .eq('id', paperId);
    
    if (error) {
      console.error('Error updating paper with new image URL:', error);
      return imageUrl; // Still return the URL even if we couldn't save it
    }
    
    console.log('Paper updated with new image URL');
    return imageUrl;
  } catch (error) {
    console.error('Error in generateImageForPaper:', error);
    return null;
  }
};

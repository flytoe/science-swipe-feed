
import { type Paper } from '../lib/supabase';
import { useState, useEffect } from 'react';
import { parseKeyTakeaways } from '../utils/takeawayParser';

/**
 * Hook to extract and format paper data for display
 */
export const usePaperData = (paper: Paper | undefined) => {
  // Add null check for paper and paper.category
  const categories = paper && paper.category ? (
    Array.isArray(paper.category) ? paper.category : 
    (typeof paper.category === 'string' ? [paper.category] : [])
  ) : [];
  
  // Format date as DD.MM.YYYY with null check
  const formattedDate = (() => {
    try {
      return paper && paper.created_at ? new Date(paper.created_at).toLocaleDateString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric'
      }).replace(/\//g, '.') : 'Unknown date';
    } catch (e) {
      console.warn(`Invalid date format for paper ${paper?.doi || 'unknown'}:`, e);
      return 'Unknown date';
    }
  })();
  
  // Default image if none is provided
  const imageSrc = paper?.image_url || 'https://images.unsplash.com/photo-1532094349884-543bc11b234d?q=80&w=1000&auto=format&fit=crop';
  
  // Use original title if AI headline is not available
  const displayTitle = paper?.ai_headline || paper?.title_org || 'Untitled Paper';
  
  // Extract first paragraph from key takeaways as highlight
  const firstTakeaway = (() => {
    if (!paper || !paper.ai_key_takeaways) return '';
    
    if (Array.isArray(paper.ai_key_takeaways) && paper.ai_key_takeaways.length > 0) {
      const firstItem = paper.ai_key_takeaways[0];
      // Add proper null checks for firstItem before using it
      if (firstItem !== null && firstItem !== undefined) {
        if (typeof firstItem === 'object' && firstItem !== null && 'text' in firstItem) {
          return firstItem.text || '';
        }
        // Safe conversion to string with null check
        return String(firstItem || '');
      }
      return '';
    } else if (typeof paper.ai_key_takeaways === 'string') {
      const takeawaysStr = String(paper.ai_key_takeaways);
      const lines = takeawaysStr.split('\n');
      return lines.length > 0 ? lines[0] : '';
    }
    return '';
  })();

  const formattedTakeaways = paper ? parseKeyTakeaways(paper.ai_key_takeaways) : [];

  return {
    categories,
    formattedDate,
    imageSrc,
    displayTitle,
    firstTakeaway,
    formattedTakeaways
  };
};

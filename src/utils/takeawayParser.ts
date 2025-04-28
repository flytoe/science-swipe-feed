
import { Json } from "../integrations/supabase/types";
import { DatabaseSource } from "../hooks/use-database-toggle";

export interface FormattedTakeaway {
  text: string | Record<string, string>;
  citation?: string;
  type?: 'default' | 'why_it_matters';
  tag?: string;
}

export const parseKeyTakeaways = (
  takeaways: any, 
  ai_matter?: string | null,
  databaseSource?: DatabaseSource
): FormattedTakeaway[] => {
  const formattedTakeaways: FormattedTakeaway[] = [];
  const isEuropePaper = databaseSource === 'europe_paper';

  if (takeaways) {
    try {
      // Handle array of formatted objects
      if (Array.isArray(takeaways) && takeaways.length > 0) {
        if (typeof takeaways[0] === 'object' && takeaways[0] !== null && 'text' in takeaways[0]) {
          // For Europe papers, use all takeaways as research findings
          // For other sources, filter out any why_it_matters entries
          const filtered = isEuropePaper 
            ? takeaways 
            : takeaways.filter(t => t.type !== 'why_it_matters');
          formattedTakeaways.push(...filtered);
        } else if (typeof takeaways[0] === 'string') {
          // Convert string array to FormattedTakeaway objects
          formattedTakeaways.push(...takeaways.map((text, index) => ({ 
            text, 
            type: 'default' as const,
            citation: isEuropePaper ? `Finding ${index + 1}` : undefined
          })));
        }
      } 
      // Handle object format
      else if (typeof takeaways === 'object' && takeaways !== null && !Array.isArray(takeaways)) {
        Object.entries(takeaways).forEach(([key, value]) => {
          if (typeof value === 'string') {
            formattedTakeaways.push({
              text: value,
              type: 'default' as const,
              citation: isEuropePaper ? key : undefined
            });
          }
        });
      }
      // Handle string format
      else if (typeof takeaways === 'string') {
        try {
          const parsed = JSON.parse(takeaways);
          formattedTakeaways.push(...parseKeyTakeaways(parsed, null, databaseSource));
        } catch (e) {
          formattedTakeaways.push({ 
            text: takeaways, 
            type: 'default' as const,
            citation: isEuropePaper ? 'Finding 1' : undefined
          });
        }
      }
    } catch (e) {
      console.warn('Error parsing takeaways:', e);
    }
  }

  // Only add ai_matter for Europe papers or if there's no why_it_matters type already
  if (ai_matter && typeof ai_matter === 'string' && ai_matter.trim() !== '') {
    if (isEuropePaper || !formattedTakeaways.some(t => t.type === 'why_it_matters')) {
      formattedTakeaways.push({
        text: ai_matter,
        type: 'why_it_matters' as const
      });
    }
  }

  return formattedTakeaways;
};

// Utility function to render text that might be an object or string
export const formatTakeawayText = (text: string | Record<string, string>): string => {
  if (typeof text === 'string') {
    return text;
  }
  
  // If text is an object, extract the 'main' property or the first available property
  if (typeof text === 'object' && text !== null) {
    if ('main' in text) {
      return text.main;
    }
    
    // If no 'main' property, use the first value
    const firstKey = Object.keys(text)[0];
    return firstKey ? text[firstKey] : '';
  }
  
  return '';
};

// Function to extract insights from a complex takeaway object
export const extractInsightsFromTakeaway = (text: Record<string, string>): string[] => {
  const insights: string[] = [];
  
  Object.entries(text).forEach(([key, value]) => {
    // Skip the main insight as it's displayed separately
    if (key !== 'main' && value) {
      insights.push(value);
    }
  });
  
  return insights;
};

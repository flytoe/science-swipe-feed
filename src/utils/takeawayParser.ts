
import { Json } from "../integrations/supabase/types";

export interface FormattedTakeaway {
  text: string | Record<string, string>;
  citation?: string;
  type?: 'default' | 'why_it_matters';
  tag?: string;
}

export const parseKeyTakeaways = (takeaways: any, ai_matter?: string | null): FormattedTakeaway[] => {
  const formattedTakeaways: FormattedTakeaway[] = [];

  // Handle standard takeaways first
  if (takeaways) {
    try {
      // If takeaways is already an array of formatted objects, use them
      if (Array.isArray(takeaways) && takeaways.length > 0) {
        if (typeof takeaways[0] === 'object' && takeaways[0] !== null && 'text' in takeaways[0]) {
          formattedTakeaways.push(...takeaways.filter(t => t.type !== 'why_it_matters'));
        } else if (typeof takeaways[0] === 'string') {
          // Convert string array to FormattedTakeaway objects
          formattedTakeaways.push(...takeaways.map(text => ({ 
            text, 
            type: 'default' as const 
          })));
        }
      } 
      // Handle object format
      else if (typeof takeaways === 'object' && takeaways !== null && !Array.isArray(takeaways)) {
        Object.entries(takeaways).forEach(([key, value]) => {
          if (typeof value === 'string') {
            formattedTakeaways.push({
              text: value,
              type: 'default' as const
            });
          }
        });
      }
      // Handle string format
      else if (typeof takeaways === 'string') {
        try {
          const parsed = JSON.parse(takeaways);
          formattedTakeaways.push(...parseKeyTakeaways(parsed));
        } catch (e) {
          formattedTakeaways.push({ text: takeaways, type: 'default' as const });
        }
      }
    } catch (e) {
      console.warn('Error parsing takeaways:', e);
    }
  }

  // Add ai_matter as the last takeaway if it exists and isn't empty
  if (ai_matter && typeof ai_matter === 'string' && ai_matter.trim() !== '') {
    formattedTakeaways.push({
      text: ai_matter,
      type: 'why_it_matters' as const
    });
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

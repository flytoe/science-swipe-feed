
import { Json } from "../integrations/supabase/types";

export interface FormattedTakeaway {
  text: string | Record<string, string>;
  citation?: string;
  type?: 'default' | 'why_it_matters';
  tag?: string;
}

export const parseKeyTakeaways = (takeaways: any, ai_matter?: string | null): FormattedTakeaway[] => {
  const formattedTakeaways: FormattedTakeaway[] = [];

  // Add ai_matter as "why it matters" takeaway if present
  if (ai_matter) {
    formattedTakeaways.push({
      text: ai_matter,
      type: 'why_it_matters' as const
    });
  }

  if (!takeaways) return formattedTakeaways;

  // If takeaways is already an array of formatted objects, append them
  if (Array.isArray(takeaways) && takeaways.length > 0) {
    // Check if this is an array of objects with text property (already formatted)
    if (typeof takeaways[0] === 'object' && takeaways[0] !== null && 'text' in takeaways[0]) {
      return [...formattedTakeaways, ...takeaways];
    }
    
    // If it's an array of strings, convert to formatted takeaways
    if (typeof takeaways[0] === 'string') {
      const defaultTakeaways: FormattedTakeaway[] = takeaways.map(text => ({ 
        text, 
        type: 'default' as const 
      }));
      return [...formattedTakeaways, ...defaultTakeaways];
    }
  }

  // Handle object format (used by Europe papers)
  if (typeof takeaways === 'object' && takeaways !== null && !Array.isArray(takeaways)) {
    Object.entries(takeaways).forEach(([key, value]) => {
      if (typeof value === 'string') {
        formattedTakeaways.push({
          text: value,
          type: 'default' as const
        });
      }
    });
    
    return formattedTakeaways;
  }

  // Try to parse if it's a string
  if (typeof takeaways === 'string') {
    try {
      const parsed = JSON.parse(takeaways);
      return parseKeyTakeaways(parsed, ai_matter);
    } catch (e) {
      return [...formattedTakeaways, { text: takeaways, type: 'default' as const }];
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

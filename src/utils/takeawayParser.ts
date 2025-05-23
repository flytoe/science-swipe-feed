
import { Json } from "../integrations/supabase/types";

export interface FormattedTakeaway {
  text: string | Record<string, string>;
  citation?: string;
  type?: 'default' | 'why_it_matters';
  tag?: string;
}

export const parseKeyTakeaways = (
  takeaways: any, 
  ai_matter?: string | null
): FormattedTakeaway[] => {
  const formattedTakeaways: FormattedTakeaway[] = [];
  const isEuropePaper = true; // Always true since we only use Europe papers now

  if (takeaways) {
    try {
      // Handle array of formatted objects
      if (Array.isArray(takeaways) && takeaways.length > 0) {
        if (typeof takeaways[0] === 'object' && takeaways[0] !== null && 'text' in takeaways[0]) {
          // For Europe papers, use all takeaways as research findings
          formattedTakeaways.push(...takeaways);
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
          } else if (typeof value === 'object' && value !== null) {
            // Handle nested objects by converting them to a Record<string, string>
            const textValue: Record<string, string> = {};
            
            // Ensure we're only extracting string values
            Object.entries(value as object).forEach(([nestedKey, nestedValue]) => {
              if (typeof nestedValue === 'string') {
                textValue[nestedKey] = nestedValue;
              } else if (nestedValue !== null) {
                // Convert non-string values to string representation
                textValue[nestedKey] = String(nestedValue);
              }
            });
            
            formattedTakeaways.push({
              text: textValue,
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
          formattedTakeaways.push(...parseKeyTakeaways(parsed));
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
    if (!formattedTakeaways.some(t => t.type === 'why_it_matters')) {
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

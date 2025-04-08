
import { Json } from "../integrations/supabase/types";

export interface FormattedTakeaway {
  text: string;
  citation?: string;
  type?: 'default' | 'why_it_matters';
}

export const parseKeyTakeaways = (takeaways: any): FormattedTakeaway[] => {
  if (!takeaways) return [];

  // If takeaways is already an array of formatted objects, return it
  if (Array.isArray(takeaways) && takeaways.length > 0) {
    // Check if this is an array of objects with text property (already formatted)
    if (typeof takeaways[0] === 'object' && takeaways[0] !== null && 'text' in takeaways[0]) {
      return takeaways as FormattedTakeaway[];
    }
    
    // If it's an array of strings, convert to formatted takeaways
    if (typeof takeaways[0] === 'string') {
      return takeaways.map(text => ({ text, type: 'default' }));
    }
  }

  // Handle the case where takeaways is an object with keys like main, insight_1, etc.
  if (typeof takeaways === 'object' && takeaways !== null && !Array.isArray(takeaways)) {
    const formattedTakeaways: FormattedTakeaway[] = [];
    
    // Convert each key-value pair to a formatted takeaway
    Object.entries(takeaways).forEach(([key, value]) => {
      if (typeof value === 'string') {
        formattedTakeaways.push({
          text: value,
          type: key === 'main' || key.includes('why') ? 'why_it_matters' : 'default'
        });
      }
    });
    
    return formattedTakeaways;
  }

  // Try to parse it if it's a string
  if (typeof takeaways === 'string') {
    try {
      const parsed = JSON.parse(takeaways);
      return parseKeyTakeaways(parsed); // Recursively handle the parsed result
    } catch (e) {
      // If parsing fails, treat it as a single takeaway
      return [{ text: takeaways, type: 'default' }];
    }
  }

  // Fallback to empty array if none of the above conditions match
  return [];
};

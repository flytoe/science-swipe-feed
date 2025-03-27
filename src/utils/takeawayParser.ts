
export interface FormattedTakeaway {
  text: string;
  citation?: string;
  tag?: string;
  type?: string;
}

/**
 * Parses key takeaways from various formats into a standardized FormattedTakeaway array
 */
export const parseKeyTakeaways = (takeaways: string[] | string | null): FormattedTakeaway[] => {
  if (!takeaways) return [];
  
  // For debugging - log the raw value to understand its format
  console.log('Raw takeaways value:', takeaways);
  
  // If it's already an array of objects
  if (Array.isArray(takeaways) && typeof takeaways[0] === 'object') {
    return takeaways.map((item: any) => ({
      text: item.text || '',
      citation: item.citation || undefined,
      type: item.type || undefined
    }));
  }
  
  // Handle if it's an array of strings (legacy format)
  if (Array.isArray(takeaways) && typeof takeaways[0] === 'string') {
    return takeaways.map((takeaway: string) => {
      // Check if this array item might be a JSON string
      if (typeof takeaway === 'string') {
        try {
          const parsedItem = JSON.parse(takeaway);
          if (typeof parsedItem === 'object' && parsedItem !== null) {
            return {
              text: parsedItem.text || '',
              citation: parsedItem.citation || undefined,
              type: parsedItem.type || undefined
            };
          }
          // If it parsed but isn't the expected format, use old format
          const match = takeaway.match(/^([IVX]+|[A-Z])\.\s*(.*)/);
          if (match) {
            return { text: match[2], tag: match[1] };
          }
          return { text: takeaway };
        } catch (e) {
          // Not JSON, process as regular string using old format
          const match = takeaway.match(/^([IVX]+|[A-Z])\.\s*(.*)/);
          if (match) {
            return { text: match[2], tag: match[1] };
          }
          return { text: takeaway };
        }
      }
      return { text: String(takeaway) };
    });
  }
  
  // Handle if it's a string that needs to be parsed as JSON
  if (typeof takeaways === 'string') {
    try {
      const parsed = JSON.parse(takeaways);
      
      // If it's an array, process it
      if (Array.isArray(parsed)) {
        return parsed.map((item: any) => {
          if (typeof item === 'object' && item !== null) {
            return {
              text: item.text || '',
              citation: item.citation || undefined,
              type: item.type || undefined
            };
          }
          // If array item is a string, use old format
          if (typeof item === 'string') {
            const match = item.match(/^([IVX]+|[A-Z])\.\s*(.*)/);
            if (match) {
              return { text: match[2], tag: match[1] };
            }
            return { text: item };
          }
          return { text: String(item) };
        });
      }
      
      // If it parsed as an object but not an array
      if (typeof parsed === 'object' && parsed !== null) {
        return [{ 
          text: parsed.text || '',
          citation: parsed.citation || undefined,
          type: parsed.type || undefined
        }];
      }
      
      // Fallback for other JSON types
      return [{ text: JSON.stringify(parsed) }];
    } catch (e) {
      // Not valid JSON, use the old format with /n/ separators
      console.log('Splitting by /n/ separator as it\'s not valid JSON');
      const parts = takeaways.split('/n/').filter(part => part.trim() !== '');
      
      return parts.map(part => {
        // Check for Roman numeral or capital letter at the beginning
        const match = part.match(/^([IVX]+|[A-Z])\.\s*(.*)/);
        if (match) {
          return { text: match[2], tag: match[1] };
        }
        return { text: part };
      });
    }
  }
  
  return [];
};


import { DatabaseSource } from '../hooks/use-database-toggle';

/**
 * Parse key takeaways from various formats
 */
export function parseKeyTakeaways(takeaways: any): string[] | null {
  if (!takeaways) return null;
  
  try {
    if (Array.isArray(takeaways)) {
      return takeaways;
    } else if (typeof takeaways === 'string') {
      return JSON.parse(takeaways);
    }
    return null;
  } catch (e) {
    console.warn('Could not parse takeaways:', e);
    return typeof takeaways === 'string' ? [takeaways] : null;
  }
}

/**
 * Parse category from various formats
 */
export function parseCategory(category: any): string[] | null {
  if (!category) return null;
  
  try {
    if (Array.isArray(category)) {
      return category;
    } else if (typeof category === 'string') {
      return [category];
    }
    return null;
  } catch (e) {
    console.warn('Could not parse category:', e);
    return typeof category === 'string' ? [category] : null;
  }
}

/**
 * Parse creator from various formats
 */
export function parseCreator(creator: any): string[] | string | null {
  if (!creator) return null;
  
  try {
    if (Array.isArray(creator)) {
      return creator;
    } else if (typeof creator === 'string') {
      return creator;
    } else if (typeof creator === 'object') {
      // Try to parse as JSON if it's an object
      return Array.isArray(creator) ? creator : [JSON.stringify(creator)];
    }
    return null;
  } catch (e) {
    console.warn('Could not parse creator:', e);
    return typeof creator === 'string' ? creator : null;
  }
}

/**
 * Format paper data from database response
 */
export function formatPaperData(item: any, databaseSource: DatabaseSource): any {
  // Handle ai_key_takeaways safely
  let takeaways: string[] | null = parseKeyTakeaways(item.ai_key_takeaways);
  
  // Handle category safely
  let categories: string[] | null = parseCategory(item.category);
  
  // Handle creator field safely
  let creators: string[] | string | null = parseCreator(item.creator);
  
  // Ensure created_at is a valid date string
  let createdAt = item.created_at || new Date().toISOString();
  if (typeof createdAt !== 'string') {
    createdAt = new Date().toISOString();
  }
  
  // For Europe paper, convert numeric ID to string for compatibility
  const paperId = typeof item.id === 'number' ? item.id.toString() : item.id;
  
  // Create the paper object with proper typing
  const paper = {
    id: paperId,
    title_org: item.title_org || '',
    abstract_org: item.abstract_org || '',
    score: item.score,
    html_available: !!item.html_available,
    ai_summary_done: !!item.ai_summary_done,
    ai_image_prompt: item.ai_image_prompt || '',
    ai_headline: item.ai_headline || '',
    ai_key_takeaways: parseKeyTakeaways(item.ai_key_takeaways),
    created_at: item.created_at || new Date().toISOString(),
    category: parseCategory(item.category),
    image_url: item.image_url || null,
    creator: parseCreator(item.creator),
    ai_matter: item.ai_matter || null,
    ai_matter_claude: item.ai_matter_claude || null,
    ai_headline_claude: item.ai_headline_claude || null,
    ai_key_takeaways_claude: item.ai_key_takeaways_claude || null,
    claude_refined: !!item.claude_refined,
    show_claude: !!item.show_claude,
    doi: item.doi || '',
    post_type: item.post_type || null, // Add post_type field
  };
  
  return paper;
}


/**
 * Paper data type and related interfaces
 */

export type Paper = {
  id: string | number;
  title_org: string;
  abstract_org: string;
  score: any;
  html_available: boolean;
  ai_summary_done: boolean;
  ai_image_prompt: string;
  ai_headline: string;
  ai_key_takeaways: string[] | null;
  created_at: string;
  category: string[] | null;
  image_url: string | null;
  creator: string[] | string | null;
  ai_matter: string | null;
  // Claude refined fields
  claude_refined?: boolean;
  ai_headline_claude?: string | null;
  ai_key_takeaways_claude?: any | null;
  ai_matter_claude?: string | null;
  show_claude?: boolean;
  // For Europe papers
  doi: string;
  feed_worthy?: boolean;
  feed_worthy_reason?: string | null;
};

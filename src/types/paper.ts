
/**
 * Paper data type and related interfaces
 */

export type Paper = {
  id: string;
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
  // For backward compatibility, add doi getter
  doi: string;
  oai?: string; // Optional field for core_paper
};

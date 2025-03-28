
import { supabase as supabaseClient } from '../integrations/supabase/client';
import type { Database } from '../integrations/supabase/types';
import type { Json } from '../integrations/supabase/types';

// Demo data for when connection fails or for development
const demoData: Paper[] = [
  {
    id: '1',
    doi: '10.1234/demo.1',
    title_org: 'Advances in Quantum Computing: A New Paradigm',
    abstract_org: 'This paper explores recent breakthroughs in quantum computing, demonstrating significant improvements in qubit stability and coherence times. We present a novel approach to error correction that could accelerate practical quantum computing applications.',
    score: 4.8,
    html_available: true,
    ai_summary_done: true,
    ai_image_prompt: 'Futuristic quantum computer with glowing qubits',
    ai_headline: 'Quantum Computing Breakthrough Could Lead to Practical Applications',
    ai_key_takeaways: ['Improved qubit stability by 300%', 'New error correction reduces noise by 78%', 'Potential applications in drug discovery and cryptography'],
    created_at: '2023-10-15T09:30:00Z',
    category: ['physics', 'technology'],
    image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070',
    creator: ['John Doe', 'Jane Smith']
  },
  {
    id: '2',
    doi: '10.1234/demo.2',
    title_org: 'Marine Microplastics: Impact on Ocean Ecosystems',
    abstract_org: 'This comprehensive study examines the prevalence and effects of microplastics across major ocean ecosystems. We found significant concentration in deepwater habitats and evidence of bioaccumulation throughout the food chain, with notable impacts on marine biodiversity.',
    score: 4.5,
    html_available: true,
    ai_summary_done: true,
    ai_image_prompt: 'Ocean plastic pollution with marine life',
    ai_headline: 'Alarming Levels of Microplastics Found in Deep Ocean Ecosystems',
    ai_key_takeaways: ['Microplastics detected at 10,000m depths', 'Evidence of bioaccumulation in 87% of species studied', 'Concentration levels highest in coastal areas near urban centers'],
    created_at: '2023-11-28T14:15:00Z',
    category: ['biology', 'environment'],
    image_url: 'https://images.unsplash.com/photo-1621451066633-97aa60c27376?q=80&w=1974',
    creator: ['Marine Research Institute']
  },
  {
    id: '3',
    doi: '10.1234/demo.3',
    title_org: 'Neural Pathways in Memory Formation: A Longitudinal Study',
    abstract_org: 'This 5-year study tracks neural pathway development during memory formation and recall. Using advanced imaging techniques, we identified key synaptic mechanisms that differentiate short-term from long-term memory encoding, with implications for treating memory-related disorders.',
    score: 4.9,
    html_available: true,
    ai_summary_done: true,
    ai_image_prompt: 'Brain neural network with glowing pathways',
    ai_headline: 'Groundbreaking Study Maps Complete Neural Pathways of Memory Formation',
    ai_key_takeaways: ['Identified 3 distinct phases of memory encoding', 'Hippocampal activity patterns predict memory durability', 'Potential therapeutic targets for Alzheimer\'s treatment'],
    created_at: '2023-12-10T11:45:00Z',
    category: ['neuroscience', 'psychology'],
    image_url: 'https://images.unsplash.com/photo-1559757175-7cb036edc7b3?q=80&w=2071',
    creator: null
  }
];

export type Paper = {
  id: string;
  doi: string;
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
};

export const getPapers = async (): Promise<Paper[]> => {
  try {
    console.log('Connecting to Supabase to fetch papers...');
    
    // Check if we can connect to the Supabase client
    const connectionTest = await supabaseClient.from('n8n_table').select('count').limit(1);
    if (connectionTest.error) {
      console.error('Connection test failed:', connectionTest.error);
      throw new Error(`Connection test failed: ${connectionTest.error.message}`);
    }
    console.log('Connection test successful.');
    
    // Using the imported Supabase client from integrations
    const { data, error } = await supabaseClient
      .from('n8n_table')
      .select('*')
      .eq('ai_summary_done', true) // Only fetch papers with ai_summary_done = true
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching papers:', error);
      throw error;
    }
    
    console.log('Raw data from Supabase:', data);
    
    if (!data || data.length === 0) {
      console.info('No data returned from Supabase, using demo data instead');
      // Filter demo data to match the same condition
      return demoData.filter(paper => paper.ai_summary_done === true);
    }
    
    // Transform the data to match the Paper type
    // Note: using doi as id since the table doesn't have an id column
    const papers: Paper[] = data?.map((item: any) => {
      // Handle ai_key_takeaways safely
      let takeaways: string[] | null = null;
      if (item.ai_key_takeaways) {
        try {
          if (Array.isArray(item.ai_key_takeaways)) {
            takeaways = item.ai_key_takeaways;
          } else if (typeof item.ai_key_takeaways === 'string') {
            takeaways = JSON.parse(item.ai_key_takeaways);
          } else {
            takeaways = null;
          }
        } catch (e) {
          console.warn(`Could not parse ai_key_takeaways for doi ${item.doi}:`, e);
          // If the string can't be parsed as JSON, use it as a single item array if it's a string
          takeaways = typeof item.ai_key_takeaways === 'string' 
            ? [item.ai_key_takeaways] 
            : null;
        }
      }

      // Handle category safely
      let categories: string[] | null = null;
      if (item.category) {
        try {
          if (Array.isArray(item.category)) {
            categories = item.category;
          } else if (typeof item.category === 'string') {
            categories = [item.category];
          } else {
            categories = null;
          }
        } catch (e) {
          console.warn(`Could not parse category for doi ${item.doi}:`, e);
          categories = typeof item.category === 'string' ? [item.category] : null;
        }
      }
      
      // Handle creator field safely
      let creators: string[] | string | null = null;
      if (item.creator) {
        try {
          if (Array.isArray(item.creator)) {
            creators = item.creator;
          } else if (typeof item.creator === 'string') {
            creators = item.creator;
          } else if (typeof item.creator === 'object') {
            // Try to parse as JSON if it's an object
            creators = Array.isArray(item.creator) ? item.creator : [JSON.stringify(item.creator)];
          } else {
            creators = null;
          }
        } catch (e) {
          console.warn(`Could not parse creator for doi ${item.doi}:`, e);
          creators = typeof item.creator === 'string' ? item.creator : null;
        }
      }

      // Ensure created_at is a valid date string
      let createdAt = item.created_at || new Date().toISOString();
      if (typeof createdAt !== 'string') {
        createdAt = new Date().toISOString();
      }

      return {
        id: item.doi, // Use doi as the id
        doi: item.doi,
        title_org: item.title_org || '',
        abstract_org: item.abstract_org || '',
        score: item.score,
        html_available: !!item.html_available,
        ai_summary_done: !!item.ai_summary_done,
        ai_image_prompt: item.ai_image_prompt || '',
        ai_headline: item.ai_headline || '',
        ai_key_takeaways: takeaways,
        created_at: createdAt,
        category: categories,
        image_url: item.image_url || null,
        creator: creators,
      };
    }) || [];
    
    console.log('Fetched papers:', papers.length);
    return papers;
  } catch (error) {
    console.error('Error fetching papers:', error);
    console.info('Using demo data due to connection issue');
    // Filter demo data to match the same condition
    return demoData.filter(paper => paper.ai_summary_done === true);
  }
};

// Export the client for potential use elsewhere
export default supabaseClient;

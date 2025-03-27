
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
    image_url: 'https://images.unsplash.com/photo-1635070041078-e363dbe005cb?q=80&w=2070'
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
    image_url: 'https://images.unsplash.com/photo-1621451066633-97aa60c27376?q=80&w=1974'
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
    image_url: 'https://images.unsplash.com/photo-1559757175-7cb036edc7b3?q=80&w=2071'
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
      // Removed the filter for ai_summary_done
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching papers:', error);
      throw error;
    }
    
    console.log('Raw data from Supabase:', data);
    
    if (!data || data.length === 0) {
      console.info('No data returned from Supabase, using demo data instead');
      return demoData;
    }
    
    // Transform the data to match the Paper type
    // Note: using doi as id since the table doesn't have an id column
    const papers: Paper[] = data?.map((item: any) => ({
      id: item.doi, // Use doi as the id
      doi: item.doi,
      title_org: item.title_org,
      abstract_org: item.abstract_org || '',
      score: item.score,
      html_available: !!item.html_available,
      ai_summary_done: !!item.ai_summary_done,
      ai_image_prompt: item.ai_image_prompt || '',
      ai_headline: item.ai_headline || '',
      ai_key_takeaways: Array.isArray(item.ai_key_takeaways) 
        ? item.ai_key_takeaways 
        : (typeof item.ai_key_takeaways === 'string' 
            ? JSON.parse(item.ai_key_takeaways) 
            : null),
      created_at: item.created_at || new Date().toISOString(),
      category: Array.isArray(item.category) 
        ? item.category 
        : (typeof item.category === 'string' 
            ? [item.category] 
            : null),
      image_url: item.image_url || null,
    })) || [];
    
    console.log('Fetched papers:', papers.length);
    return papers;
  } catch (error) {
    console.error('Error fetching papers:', error);
    console.info('Using demo data due to connection issue');
    return demoData;
  }
};

// Export the client for potential use elsewhere
export default supabaseClient;

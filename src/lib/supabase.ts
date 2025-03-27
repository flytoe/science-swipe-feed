
import { createClient } from '@supabase/supabase-js';

// Get environment variables
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Check if we're in development mode (for demonstration purposes)
const isDevelopment = import.meta.env.DEV;

// Use demo data when environment variables are not set
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

// Create Supabase client if environment variables are available
let supabase: any;

if (supabaseUrl && supabaseAnonKey) {
  supabase = createClient(supabaseUrl, supabaseAnonKey);
  console.log('Supabase client initialized with provided credentials');
} else {
  console.warn('Supabase environment variables are not set, using mock data for demonstration');
  // Create a minimal mock client to avoid errors
  supabase = {
    from: () => ({
      select: () => ({
        order: () => ({
          then: (callback: any) => Promise.resolve(callback({ data: demoData, error: null }))
        })
      })
    })
  };
}

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
    // If we're using the mock client, it will return demo data
    const { data, error } = await supabase
      .from('n8n_table')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data || [];
  } catch (error) {
    console.error('Error fetching papers:', error);
    if (!supabaseUrl || !supabaseAnonKey) {
      console.info('Using demo data since Supabase credentials are not configured');
      return demoData;
    }
    return [];
  }
};

export default supabase;

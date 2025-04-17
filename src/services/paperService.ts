
import { supabase as supabaseClient } from '../integrations/supabase/client';
import { useDatabaseToggle, DatabaseSource } from '../hooks/use-database-toggle';
import { Paper } from '../types/paper';
import { formatPaperData } from '../utils/paperDataUtils';
import { createPaper } from '../factories/paperFactory';
import { demoData } from '../data/demoData';

/**
 * Fetch all papers from the database
 */
export const getPapers = async (): Promise<Paper[]> => {
  try {
    // Get the current database source from the store
    const databaseSource = useDatabaseToggle.getState().databaseSource;
    
    console.log(`Connecting to Supabase to fetch papers from ${databaseSource}...`);
    
    // Check if we can connect to the Supabase client
    const connectionTest = await supabaseClient.from(databaseSource).select('count').limit(1);
    if (connectionTest.error) {
      console.error('Connection test failed:', connectionTest.error);
      throw new Error(`Connection test failed: ${connectionTest.error.message}`);
    }
    
    // Using the imported Supabase client from integrations
    const { data, error } = await supabaseClient
      .from(databaseSource)
      .select('*')
      .eq('ai_summary_done', true) // Only fetch papers with ai_summary_done = true
      .order('created_at', { ascending: false }); // Order by newest first
    
    if (error) {
      console.error(`Error fetching papers from ${databaseSource}:`, error);
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.info('No data returned from Supabase, using demo data instead');
      return demoData
        .filter(paper => paper.ai_summary_done === true)
        .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
        .map(createPaper);
    }
    
    // Transform the data to match the Paper type
    const papers: Paper[] = data.map((item: any) => {
      const formattedPaper = formatPaperData(item, databaseSource);
      return createPaper(formattedPaper);
    });
    
    console.log(`Fetched papers from ${databaseSource}:`, papers.length);
    return papers;
  } catch (error) {
    console.error('Error fetching papers:', error);
    console.info('Using demo data due to connection issue');
    // Filter and sort demo data
    return demoData
      .filter(paper => paper.ai_summary_done === true)
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())
      .map(createPaper);
  }
};

/**
 * Fetch a paper by its ID
 */
export async function getPaperById(id: string): Promise<Paper | null> {
  try {
    console.log('Fetching paper by ID:', id);
    
    // Get the current database source from the store
    const databaseSource = useDatabaseToggle.getState().databaseSource;
    
    // Check if we're using demo data due to connection issues
    try {
      const connectionTest = await supabaseClient.from(databaseSource).select('count').limit(1);
      if (connectionTest.error) {
        console.log('Using demo data due to connection issue');
        // Find paper in demo data
        const demoPaper = demoData.find(paper => paper.id === id);
        return demoPaper ? createPaper(demoPaper) : null;
      }
    } catch (e) {
      console.error('Connection test failed:', e);
      // Find paper in demo data
      const demoPaper = demoData.find(paper => paper.id === id);
      return demoPaper ? createPaper(demoPaper) : null;
    }

    // For europe_paper table, we might need to query using either id or doi
    let query;
    if (databaseSource === 'europe_paper') {
      // Try first with id field - use the appropriate type for the comparison
      // Since europe_paper.id is a smallint, we need to convert the string id to a number
      // Only try to convert to number if the id looks like a numeric string
      if (/^\d+$/.test(id)) {
        // If the ID is numeric, create a query with a number
        const idQuery = await supabaseClient
          .from(databaseSource)
          .select('*')
          .eq('id', parseInt(id, 10))
          .maybeSingle();
        
        if (idQuery.data) {
          const formattedPaper = formatPaperData(idQuery.data, databaseSource);
          return createPaper(formattedPaper);
        }
      }
      
      // If id is not numeric or no results found, try with doi field
      query = await supabaseClient
        .from(databaseSource)
        .select('*')
        .eq('doi', id)
        .maybeSingle();
    } else {
      query = await supabaseClient
        .from(databaseSource)
        .select('*')
        .eq('id', id)
        .maybeSingle();
    }
    
    if (query.error) {
      console.error(`Error fetching paper by ID from ${databaseSource}:`, query.error);
      // Try to find in demo data as fallback
      const demoPaper = demoData.find(paper => paper.id === id);
      return demoPaper ? createPaper(demoPaper) : null;
    }
    
    if (!query.data) {
      console.log('No data found in database, checking demo data');
      // Try to find in demo data as fallback
      const demoPaper = demoData.find(paper => paper.id === id);
      return demoPaper ? createPaper(demoPaper) : null;
    }
    
    // Format the paper data
    const formattedPaper = formatPaperData(query.data, databaseSource);
    return createPaper(formattedPaper);
  } catch (error) {
    console.error('Error in getPaperById:', error);
    // Try to find in demo data as fallback
    const demoPaper = demoData.find(paper => paper.id === id);
    return demoPaper ? createPaper(demoPaper) : null;
  }
}


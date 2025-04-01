
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

export interface MindBlowCount {
  paper_doi: string;
  count: number;
}

export interface UserMindBlow {
  id: string;
  paper_doi: string;
  user_id: string;
  reason?: string;
  created_at: string;
}

// Fetch mind-blow count for a specific paper
export async function getMindBlowCount(paperDoi: string): Promise<number> {
  try {
    // Use the raw query to avoid TypeScript error with table types
    const { data, error } = await supabase
      .from('mind_blows')
      .select('count')
      .eq('paper_doi', paperDoi)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error fetching mind blow count:', error);
      return 0;
    }
    
    return data?.count || 0;
  } catch (error) {
    console.error('Error in getMindBlowCount:', error);
    return 0;
  }
}

// Fetch all mind-blow counts
export async function getAllMindBlowCounts(): Promise<MindBlowCount[]> {
  try {
    // Use the raw query to avoid TypeScript error with table types
    const { data, error } = await supabase
      .from('mind_blows')
      .select('paper_doi, count');
    
    if (error) {
      console.error('Error fetching all mind blow counts:', error);
      return [];
    }
    
    // Cast to the expected type
    return (data || []) as unknown as MindBlowCount[];
  } catch (error) {
    console.error('Error in getAllMindBlowCounts:', error);
    return [];
  }
}

// Check if a user has already mind-blown a paper
export async function hasUserMindBlown(paperDoi: string, userId: string): Promise<boolean> {
  try {
    // Use the raw query to avoid TypeScript error with table types
    const { data, error } = await supabase
      .from('user_mind_blows')
      .select('id')
      .eq('paper_doi', paperDoi)
      .eq('user_id', userId)
      .maybeSingle();
    
    if (error && error.code !== 'PGRST116') { // PGRST116 means no rows returned
      console.error('Error checking user mind blow status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Error in hasUserMindBlown:', error);
    return false;
  }
}

// Add a mind-blow reaction
export async function addMindBlow(paperDoi: string, userId: string, reason?: string): Promise<boolean> {
  try {
    // Insert directly to the user_mind_blows table instead of using RPC
    const { error } = await supabase
      .from('user_mind_blows')
      .insert({ 
        paper_doi: paperDoi, 
        user_id: userId, 
        reason: reason || null 
      });
    
    if (error) {
      console.error('Error adding mind blow:', error);
      if (error.code === '23505') { // Unique constraint violation
        toast.error('You already mind-blew this paper!');
      } else {
        toast.error('Failed to add mind-blow. Please try again.');
      }
      return false;
    }
    
    toast.success('Mind blown! 🤯');
    return true;
  } catch (error) {
    console.error('Error in addMindBlow:', error);
    toast.error('Something went wrong. Please try again.');
    return false;
  }
}

// Remove a mind-blow reaction
export async function removeMindBlow(paperDoi: string, userId: string): Promise<boolean> {
  try {
    // Delete directly from the user_mind_blows table instead of using RPC
    const { error } = await supabase
      .from('user_mind_blows')
      .delete()
      .eq('paper_doi', paperDoi)
      .eq('user_id', userId);
    
    if (error) {
      console.error('Error removing mind blow:', error);
      toast.error('Failed to remove mind-blow. Please try again.');
      return false;
    }
    
    toast.success('Mind-blow removed');
    return true;
  } catch (error) {
    console.error('Error in removeMindBlow:', error);
    toast.error('Something went wrong. Please try again.');
    return false;
  }
}

// Get top mind-blown papers
export async function getTopMindBlownPapers(limit: number = 10): Promise<MindBlowCount[]> {
  try {
    // Query the mind_blows table directly instead of using RPC
    const { data, error } = await supabase
      .from('mind_blows')
      .select('paper_doi, count')
      .order('count', { ascending: false })
      .limit(limit);
    
    if (error) {
      console.error('Error fetching top mind blown papers:', error);
      return [];
    }
    
    // Cast to the expected type
    return (data || []) as unknown as MindBlowCount[];
  } catch (error) {
    console.error('Error in getTopMindBlownPapers:', error);
    return [];
  }
}

// Check if a paper is in the top mind-blown category
export async function isTopMindBlownPaper(paperDoi: string, threshold: number = 5): Promise<boolean> {
  try {
    const count = await getMindBlowCount(paperDoi);
    return count >= threshold;
  } catch (error) {
    console.error('Error in isTopMindBlownPaper:', error);
    return false;
  }
}

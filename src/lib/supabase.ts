
import { supabase as supabaseClient } from '../integrations/supabase/client';
import { getPapers, getPaperById } from '../services/paperService';
import { Paper } from '../types/paper';

// Export all the functionality
export { getPapers, getPaperById, Paper };

// Export the supabase client as default
export default supabaseClient;


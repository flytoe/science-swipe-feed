
import { supabase as supabaseClient } from '../integrations/supabase/client';
import { getPapers, getPaperById } from '../services/paperService';
import type { Paper } from '../types/paper';

// Export all the functionality
export { getPapers, getPaperById };
export type { Paper };

// Export the supabase client as default
export default supabaseClient;


// This file is automatically generated. Do not edit it directly.
import { createClient } from '@supabase/supabase-js';
import type { Database } from './types';

const SUPABASE_URL = "https://kwtwhgfcfqgpfjimioiy.supabase.co";
const SUPABASE_PUBLISHABLE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imt3dHdoZ2ZjZnFncGZqaW1pb2l5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDE4Nzc3NzUsImV4cCI6MjA1NzQ1Mzc3NX0.78dKJBWIB3boBTu1RrWaoxcxBSB8C7KfXCtNcdrJ640";

// Import the supabase client like this:
// import { supabase } from "@/integrations/supabase/client";

export const supabase = createClient<Database>(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY);

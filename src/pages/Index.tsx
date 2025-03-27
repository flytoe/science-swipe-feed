
import React, { useEffect, useState } from 'react';
import SwipeFeed from '../components/SwipeFeed';
import { Info } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';

const Index: React.FC = () => {
  const [isUsingDemoData, setIsUsingDemoData] = useState(false);
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;
  
  // Check if we're connected to a real Supabase instance or using hardcoded credentials
  useEffect(() => {
    const checkConnection = async () => {
      try {
        // Make a simple query to check if Supabase connection works
        const { data, error } = await supabase.from('n8n_table').select('doi').limit(1);
        
        // If there's an error or no data, we might be using demo data
        setIsUsingDemoData(!!error || !data || data.length === 0);
      } catch (error) {
        setIsUsingDemoData(true);
      }
    };
    
    checkConnection();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100">
      <header className="sticky top-0 z-30 w-full backdrop-blur-sm bg-white/80 border-b border-gray-200">
        <div className="container max-w-md mx-auto px-4 py-3 flex items-center justify-between">
          <h1 className="text-xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-500 to-purple-500">
            ScienceSwipe
          </h1>
          <div className="text-sm text-gray-500">Latest Research</div>
        </div>
      </header>

      {isUsingDemoData && !supabaseUrl && !supabaseAnonKey && (
        <div className="max-w-md mx-auto mt-2 px-4">
          <div className="flex items-center gap-2 bg-amber-50 p-3 rounded-md border border-amber-100 text-sm text-amber-800">
            <Info size={16} />
            <span>
              Using demo data. To use your own data, set the VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables.
            </span>
          </div>
        </div>
      )}

      <main className="container max-w-md mx-auto px-0 py-4">
        <SwipeFeed />
      </main>
    </div>
  );
};

export default Index;

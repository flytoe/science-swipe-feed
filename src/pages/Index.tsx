import React, { useEffect, useState } from 'react';
import SwipeFeed from '../components/SwipeFeed';
import { Info } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';

const Index: React.FC = () => {
  const [isSample, setIsSample] = useState(false);
  const [hasPapers, setHasPapers] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        setIsLoading(true);
        const { data, error, count } = await supabase
          .from('n8n_table')
          .select('doi', { count: 'exact' })
          .limit(1);
        
        if (error) {
          console.error('Error checking database:', error);
          toast.error('Error connecting to Supabase: ' + error.message);
          setHasPapers(false);
          return;
        }
        
        console.log('Database check result:', { data, count });
        setHasPapers(count !== null && count > 0);
        
        if (count !== null && count > 0) {
          toast.success(`Found ${count} papers in the database`);
        }
      } catch (error) {
        console.error('Error checking papers:', error);
        toast.error('Error checking database');
        setHasPapers(false);
      } finally {
        setIsLoading(false);
      }
    };
    
    checkDatabase();
  }, []);

  const addSamplePaper = async () => {
    try {
      const samplePaper = {
        doi: `sample-${Date.now()}`,
        title_org: 'Sample Paper: Machine Learning in Healthcare',
        abstract_org: 'This sample paper explores the applications of machine learning in modern healthcare, including predictive diagnostics, personalized treatment plans, and medical imaging analysis.',
        score: 4.7,
        html_available: true,
        ai_summary_done: true,
        ai_headline: 'AI Revolutionizes Medical Diagnostics and Treatment Plans',
        ai_key_takeaways: ['Reduced diagnostic time by 60%', 'Increased treatment efficacy by 45%', 'Improved patient outcomes in 78% of cases'],
        created_at: new Date().toISOString(),
        category: ['healthcare', 'ai', 'medicine'],
        image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070'
      };
      
      const { error } = await supabase
        .from('n8n_table')
        .insert(samplePaper);
      
      if (error) {
        console.error('Error adding sample paper:', error);
        toast.error('Failed to add sample paper: ' + error.message);
        return;
      }
      
      toast.success('Sample paper added successfully! Refresh the page to see it.');
      setIsSample(true);
      setHasPapers(true);
    } catch (error) {
      console.error('Error adding sample paper:', error);
      toast.error('Failed to add sample paper');
    }
  };

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

      {isLoading ? (
        <div className="max-w-md mx-auto mt-6 px-4 flex justify-center">
          <div className="loading-spinner" />
        </div>
      ) : hasPapers === false && !isSample ? (
        <div className="max-w-md mx-auto mt-2 px-4">
          <div className="flex flex-col items-center gap-2 bg-amber-50 p-4 rounded-md border border-amber-100 text-sm text-amber-800">
            <Info size={16} />
            <span>
              No papers found in your database. Would you like to add a sample paper?
            </span>
            <button 
              onClick={addSamplePaper}
              className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
            >
              Add Sample Paper
            </button>
          </div>
        </div>
      ) : null}

      <div className="h-[calc(100vh-4rem)]">
        <SwipeFeed />
      </div>
    </div>
  );
};

export default Index;

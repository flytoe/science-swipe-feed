
import React, { useEffect, useState } from 'react';
import SwipeFeed from '../components/SwipeFeed';
import { Info, SearchIcon } from 'lucide-react';
import { supabase } from '../integrations/supabase/client';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { getPapers, Paper } from '../lib/supabase';
import CategoryFilter from '../components/CategoryFilter';
import {
  Dialog,
  DialogContent,
  DialogOverlay,
  DialogPortal,
} from '@/components/ui/dialog';

const Index: React.FC = () => {
  const [isSample, setIsSample] = useState(false);
  const [hasPapers, setHasPapers] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPaperIndex, setCurrentPaperIndex] = useState(0);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  
  useEffect(() => {
    const checkDatabase = async () => {
      try {
        setIsLoading(true);
        
        const papersData = await getPapers();
        setPapers(papersData);
        setFilteredPapers(papersData);
        
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

  useEffect(() => {
    if (selectedCategories.length === 0) {
      setFilteredPapers(papers);
    } else {
      const filtered = papers.filter(paper => {
        if (!paper.category) return false;
        
        const paperCategories = Array.isArray(paper.category) 
          ? paper.category 
          : [paper.category];
        
        return selectedCategories.some(selected => 
          paperCategories.includes(selected)
        );
      });
      
      setFilteredPapers(filtered);
      setCurrentPaperIndex(0);
    }
  }, [selectedCategories, papers]);

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
        category: ['cs.LG', 'cs.AI', 'q-bio'],
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

  const handleFilterChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleRegenerationComplete = (imageUrl: string | null) => {
    setIsRegeneratingImage(false);
    
    if (imageUrl && filteredPapers[currentPaperIndex]) {
      const updatedPapers = [...papers];
      const paperIndex = updatedPapers.findIndex(p => 
        p.doi === filteredPapers[currentPaperIndex].doi
      );
      
      if (paperIndex !== -1) {
        updatedPapers[paperIndex] = {
          ...updatedPapers[paperIndex],
          image_url: imageUrl
        };
        
        setPapers(updatedPapers);
      }
    }
  };

  return (
    <div className="min-h-screen bg-black text-white">
      <header className="sticky top-0 z-30 w-full bg-black/80 backdrop-blur-sm border-b border-white/10">
        <div className="container max-w-md mx-auto px-4 py-4 flex items-center justify-between">
          <h1 className="text-xl font-semibold">Research Feed</h1>
          <div className="flex items-center space-x-2">
            <Button 
              variant="ghost" 
              size="icon" 
              className="text-white"
              onClick={() => setIsFilterOpen(true)}
            >
              <SearchIcon className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </header>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
          <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md w-[95vw] h-[90vh] p-0 overflow-hidden">
            <div className="p-4 h-full overflow-hidden">
              <CategoryFilter onFilterChange={handleFilterChange} />
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      {isLoading ? (
        <div className="max-w-md mx-auto mt-6 px-4 flex justify-center">
          <div className="loading-spinner" />
        </div>
      ) : hasPapers === false && !isSample ? (
        <div className="max-w-md mx-auto mt-2 px-4">
          <div className="flex flex-col items-center gap-2 bg-amber-950/50 p-4 rounded-md border border-amber-800/30 text-sm text-amber-200">
            <Info size={16} />
            <span>
              No papers found in your database. Would you like to add a sample paper?
            </span>
            <button 
              onClick={addSamplePaper}
              className="mt-2 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Sample Paper
            </button>
          </div>
        </div>
      ) : null}

      <div className="h-[calc(100vh-4rem)]">
        {filteredPapers.length === 0 && selectedCategories.length > 0 ? (
          <div className="flex items-center justify-center h-full">
            <p className="text-white/70">No papers match the selected categories</p>
          </div>
        ) : (
          <SwipeFeed 
            papers={filteredPapers} 
            currentIndex={currentPaperIndex}
            setCurrentIndex={setCurrentPaperIndex}
            isGeneratingImage={isRegeneratingImage}
          />
        )}
      </div>
    </div>
  );
};

export default Index;

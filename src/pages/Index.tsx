
import React, { useEffect, useState } from 'react';
import { SearchIcon, Settings, Info, Gift, X as FilterX } from 'lucide-react';
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
  DialogTitle,
  DialogHeader,
} from '@/components/ui/dialog';
import OnboardingModal from '@/components/Onboarding/OnboardingModal';
import { useOnboardingStore } from '@/hooks/use-onboarding';
import DonationPrompt from '@/components/donations/DonationPrompt';
import DonationModal from '@/components/donations/DonationModal';
import { useMindBlowTracker } from '@/hooks/use-mind-blow-tracker';
import ScrollableFeed from '@/components/ScrollableFeed';
import { motion, AnimatePresence } from 'framer-motion';
import { useFeedModeStore, sortPapers } from '@/hooks/use-feed-mode';
import { Input } from '@/components/ui/input';
import { Command, CommandInput } from '@/components/ui/command';

const DATABASE_SOURCE = 'europe_paper';

const Index: React.FC = () => {
  const [isSample, setIsSample] = useState(false);
  const [hasPapers, setHasPapers] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [papers, setPapers] = useState<Paper[]>([]);
  const [filteredPapers, setFilteredPapers] = useState<Paper[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const { currentMode } = useFeedModeStore();
  
  const { completedOnboarding, showOnboarding, setShowOnboarding } = useOnboardingStore();
  
  const [showDonationPrompt, setShowDonationPrompt] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [isSubscriptionModal, setIsSubscriptionModal] = useState(false);
  const { shouldShowDonationPrompt, markDonationPromptSeen, resetPromptTimestamp } = useMindBlowTracker();
  
  const handleShowOnboarding = () => {
    setShowOnboarding(true);
  };

  const handleShowDonation = () => {
    setIsSubscriptionModal(false);
    setShowDonationModal(true);
  };

  const handleToggleDonationPrompt = () => {
    setShowDonationPrompt(prev => !prev);
  };

  useEffect(() => {
    if (!completedOnboarding && !showOnboarding) {
      setShowOnboarding(true);
    }
  }, [completedOnboarding, showOnboarding, setShowOnboarding]);
  
  useEffect(() => {
    fetchPapers();
  }, []);
  
  const fetchPapers = async () => {
    try {
      setIsLoading(true);
      
      const papersData = await getPapers();
      setPapers(papersData);
      
      const { data, error, count } = await supabase
        .from(DATABASE_SOURCE)
        .select('id', { count: 'exact' })
        .eq('ai_summary_done', true)
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
        toast.success(`Found ${count} papers in the Europe paper database`);
      }
    } catch (error) {
      console.error('Error checking papers:', error);
      toast.error('Error checking database');
      setHasPapers(false);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    // First filter by search query
    const searchFiltered = papers.filter(paper => {
      if (!searchQuery) return true;
      
      const query = searchQuery.toLowerCase();
      const matchesId = paper.id?.toString().toLowerCase().includes(query);
      const matchesTitle = paper.title_org?.toLowerCase().includes(query);
      const matchesType = paper.post_type?.toLowerCase().includes(query);
      
      return matchesId || matchesTitle || matchesType;
    });
    
    // Then filter by categories
    const categoryFiltered = selectedCategories.length === 0
      ? searchFiltered
      : searchFiltered.filter(paper => {
          if (!paper.category) return false;
          
          const paperCategories = Array.isArray(paper.category) 
            ? paper.category 
            : [paper.category];
          
          return selectedCategories.some(selected => 
            paperCategories.includes(selected)
          );
        });
    
    const sorted = sortPapers(categoryFiltered, currentMode);
    setFilteredPapers(sorted);
  }, [selectedCategories, papers, currentMode, searchQuery]);

  useEffect(() => {
    if (shouldShowDonationPrompt()) {
      setShowDonationPrompt(true);
      resetPromptTimestamp();
    }
  }, [shouldShowDonationPrompt, resetPromptTimestamp]);

  const addSamplePaper = async () => {
    try {
      const samplePaper = {
        id: Date.now(),
        title_org: 'Sample Paper: Machine Learning in Healthcare',
        abstract_org: 'This sample paper explores the applications of machine learning in modern healthcare, including predictive diagnostics, personalized treatment plans, and medical imaging analysis.',
        score: 4.7,
        html_available: true,
        ai_summary_done: true,
        ai_headline: 'AI Revolutionizes Medical Diagnostics and Treatment Plans',
        ai_key_takeaways: ['Reduced diagnostic time by 60%', 'Increased treatment efficacy by 45%', 'Improved patient outcomes in 78% of cases'],
        created_at: new Date().toISOString(),
        category: ['cs.LG', 'cs.AI', 'q-bio'],
        image_url: 'https://images.unsplash.com/photo-1576091160550-2173dba999ef?q=80&w=2070',
        ai_matter: 'This research is important because it shows how AI can significantly improve healthcare outcomes by reducing diagnostic times and increasing treatment success rates.'
      };
      
      const { error } = await supabase
        .from(DATABASE_SOURCE)
        .insert(samplePaper);
      
      if (error) {
        console.error('Error adding sample paper:', error);
        toast.error('Failed to add sample paper: ' + error.message);
        return;
      }
      
      toast.success('Sample paper added successfully! Refresh the page to see it.');
      setIsSample(true);
      setHasPapers(true);
      fetchPapers();
    } catch (error) {
      console.error('Error adding sample paper:', error);
      toast.error('Failed to add sample paper');
    }
  };

  const handleFilterChange = (categories: string[]) => {
    setSelectedCategories(categories);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleCloseDonationPrompt = () => {
    setShowDonationPrompt(false);
  };

  const handleDonate = () => {
    setShowDonationPrompt(false);
    setIsSubscriptionModal(false);
    setShowDonationModal(true);
  };

  const handleSubscribe = () => {
    setShowDonationPrompt(false);
    setIsSubscriptionModal(true);
    setShowDonationModal(true);
  };

  const handleCloseDonationModal = () => {
    setShowDonationModal(false);
    markDonationPromptSeen();
  };

  return (
    <motion.div 
      className="min-h-screen bg-white text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <header className="fixed top-0 z-30 w-full bg-transparent">
        <div className="container max-w-md mx-auto px-4 py-4">
          <div className="w-full flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-800">Europe Research Feed</h1>
            <div className="flex items-center space-x-2">
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600"
                onClick={() => setIsFilterOpen(true)}
              >
                <SearchIcon className="h-5 w-5" />
              </Button>
              <Button 
                variant="ghost" 
                size="icon" 
                className="text-gray-600"
                onClick={() => setIsSettingsOpen(true)}
              >
                <Settings className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <Dialog open={isFilterOpen} onOpenChange={setIsFilterOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
          <DialogContent className="bg-gray-900 border-gray-800 text-white sm:max-w-md w-[95vw] h-[90vh] p-0 overflow-hidden">
            <div className="p-4 flex items-center justify-between border-b border-white/10">
              <h2 className="text-lg font-semibold">Search & Filter</h2>
              <div className="flex gap-2">
                {(selectedCategories.length > 0 || searchQuery) && (
                  <Button 
                    variant="outline" 
                    size="sm" 
                    onClick={() => {
                      setSelectedCategories([]);
                      setSearchQuery('');
                    }}
                    className="h-8 text-xs bg-white/10 text-white border-white/20"
                  >
                    <FilterX size={14} className="mr-1" />
                    Reset All
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={() => setIsFilterOpen(false)}
                  className="h-8 text-xs text-white hover:bg-white/10"
                >
                  Close
                </Button>
              </div>
            </div>
            
            <div className="p-4 border-b border-white/10">
              <Command className="rounded-lg border border-white/20 overflow-visible bg-transparent">
                <CommandInput 
                  placeholder="Search by ID, title, or type..." 
                  value={searchQuery}
                  onValueChange={setSearchQuery}
                  className="h-9 text-white"
                />
              </Command>
            </div>
            
            <div className="p-4 h-full overflow-hidden">
              <CategoryFilter onFilterChange={handleFilterChange} />
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
      
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogPortal>
          <DialogOverlay className="bg-black/80 backdrop-blur-sm" />
          <DialogContent className="bg-white border-gray-200 sm:max-w-md w-[95vw] max-h-[90vh] p-0 overflow-hidden">
            <DialogHeader className="p-4 border-b border-gray-200">
              <DialogTitle className="text-lg font-semibold">Settings</DialogTitle>
            </DialogHeader>
            <div className="divide-y divide-gray-200 max-h-[70vh] overflow-y-auto">
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Info className="h-5 w-5" />
                  <span>About</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleShowOnboarding}
                >
                  View
                </Button>
              </div>
              <div className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Gift className="h-5 w-5" />
                  <span>Support Us</span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm"
                  onClick={handleShowDonation}
                >
                  Donate
                </Button>
              </div>
              <div className="p-4">
                <button 
                  onClick={handleToggleDonationPrompt}
                  className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 transition-colors"
                >
                  {showDonationPrompt ? 'Hide' : 'Show'} Donation Prompt
                </button>
              </div>
            </div>
            <div className="p-4 border-t border-gray-200">
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setIsSettingsOpen(false)}
                className="w-full"
              >
                Close
              </Button>
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <OnboardingModal 
        isOpen={showOnboarding} 
        onClose={() => setShowOnboarding(false)} 
      />

      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        isSubscription={isSubscriptionModal}
      />

      {isLoading ? (
        <div className="max-w-md mx-auto mt-6 px-4 flex justify-center">
          <div className="loading-spinner border-gray-200 border-t-blue-500" />
        </div>
      ) : hasPapers === false && !isSample ? (
        <div className="max-w-md mx-auto mt-2 px-4">
          <div className="flex flex-col items-center gap-2 bg-amber-50 p-4 rounded-md border border-amber-200 text-sm text-amber-800">
            <span>
              No papers found in your Europe database. Would you like to add a sample paper?
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

      <AnimatePresence>
        <div className="pt-16 pb-8">
          {filteredPapers.length === 0 ? (
            <div className="flex items-center justify-center h-[calc(100vh-12rem)] text-gray-500">
              <p>No papers match the selected filters</p>
            </div>
          ) : (
            <ScrollableFeed 
              papers={filteredPapers} 
              isLoading={isLoading}
            />
          )}
        </div>
      </AnimatePresence>
      
      <DonationPrompt 
        isVisible={showDonationPrompt}
        onClose={handleCloseDonationPrompt}
        onDonate={handleDonate}
        onSubscribe={handleSubscribe}
        delayMs={3000}
      />
    </motion.div>
  );
};

export default Index;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Calendar, BookOpen, LightbulbIcon, BarChart3, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getPaperById, type Paper } from '../lib/supabase';
import { toast } from 'sonner';
import RegenerateImageButton from '../components/RegenerateImageButton';
import { usePaperData } from '../hooks/use-paper-data';
import HeroImageSection from '../components/paper-content/HeroImageSection';
import DetailNavButtons from '../components/paper-content/DetailNavButtons';
import MindBlowBadge from '../components/MindBlowBadge';
import { useMindBlow } from '../hooks/use-mind-blow';
import { useMindBlowTracker } from '../hooks/use-mind-blow-tracker';
import DonationPrompt from '../components/donations/DonationPrompt';
import DonationModal from '../components/donations/DonationModal';
import DisclaimerSection from '../components/paper-content/DisclaimerSection';
import { motion, AnimatePresence } from 'framer-motion';

const PaperDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  
  // Donation modal states
  const [showDonationPrompt, setShowDonationPrompt] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [isSubscription, setIsSubscription] = useState(false);
  
  // Get mind-blow data for the paper
  const { count: mindBlowCount, isTopPaper } = useMindBlow(id || '');
  
  // Mind blow tracker for donation prompts
  const { shouldShowDonationPrompt, markDonationPromptSeen, resetPromptTimestamp } = useMindBlowTracker();

  // Check if we should show the donation prompt
  useEffect(() => {
    if (shouldShowDonationPrompt()) {
      setShowDonationPrompt(true);
    }
  }, [shouldShowDonationPrompt]);

  // Handle donation prompt actions
  const handleCloseDonationPrompt = () => {
    setShowDonationPrompt(false);
    resetPromptTimestamp();
  };

  const handleDonate = (subscription: boolean = false) => {
    setShowDonationPrompt(false);
    setIsSubscription(subscription);
    setShowDonationModal(true);
    markDonationPromptSeen();
  };

  useEffect(() => {
    const loadPaper = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        const fetchedPaper = await getPaperById(id);
        
        if (fetchedPaper) {
          setPaper(fetchedPaper);
        } else {
          toast.error('Paper not found');
          navigate('/');
        }
      } catch (error) {
        console.error('Error loading paper details:', error);
        toast.error('Failed to load paper details');
      } finally {
        setLoading(false);
      }
    };
    
    loadPaper();
  }, [id, navigate]);

  const goBack = () => navigate('/');

  const handleRegenerationStart = () => {
    setIsRegeneratingImage(true);
  };

  const handleRegenerationComplete = (imageUrl: string | null) => {
    setIsRegeneratingImage(false);
    if (imageUrl && paper) {
      // Update the paper object with the new image URL
      setPaper({
        ...paper,
        image_url: imageUrl
      });
    }
  };

  // Get formatted paper data using our custom hook
  const paperData = paper ? usePaperData(paper) : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!paper || !paperData) {
    return (
      <div className="min-h-screen bg-black text-white p-4">
        <div className="max-w-3xl mx-auto py-12 text-center">
          <h2 className="text-2xl font-bold">Paper not found</h2>
          <Button onClick={goBack} variant="outline" className="mt-4">
            Back to Feed
          </Button>
        </div>
      </div>
    );
  }
  
  const { formattedCategoryNames, formattedDate, imageSrc, formattedTakeaways } = paperData;
  const cleanAbstract = paper.abstract_org 
    ? paper.abstract_org.includes("Abstract:") 
      ? paper.abstract_org.split("Abstract:")[1].trim()
      : paper.abstract_org
    : "";

  return (
    <motion.div 
      className="min-h-screen bg-black text-white"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3 }}
    >
      {/* App Store style header with back button */}
      <header className="fixed top-0 left-0 right-0 z-50 bg-black/80 backdrop-blur-lg border-b border-white/10">
        <div className="container max-w-3xl mx-auto px-4 py-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack}
            className="mr-2"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium truncate">Paper Details</h1>
        </div>
      </header>
      
      <div className="container max-w-3xl mx-auto px-4 py-6 pt-20 pb-24">
        {/* Hero section with image and date at the top */}
        <div className="relative">
          {/* Date positioned at the top */}
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="outline" className="bg-black/50 backdrop-blur-sm text-white border-none">
              {formattedDate}
            </Badge>
          </div>
          
          {/* Mind-blow badge */}
          {mindBlowCount > 0 && (
            <div className="absolute top-4 right-4 z-10">
              <MindBlowBadge count={mindBlowCount} />
            </div>
          )}
          
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <HeroImageSection 
              imageSrc={imageSrc}
              title={paper.ai_headline || paper.title_org}
              creator={paper.creator}
              categories={paper.category ? 
                (Array.isArray(paper.category) ? paper.category : [paper.category]) : []}
              mindBlowCount={mindBlowCount}
              isTopPaper={isTopPaper}
            />
          </motion.div>
        </div>
        
        {/* Regenerate button */}
        <div className="mt-4">
          <RegenerateImageButton 
            paper={paper}
            onRegenerationStart={handleRegenerationStart}
            onRegenerationComplete={handleRegenerationComplete}
          />
        </div>
        
        {/* Categories - Already using formatted category names */}
        <motion.div 
          className="mb-4 flex flex-wrap gap-2 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {/* Display the formatted category names */}
          {formattedCategoryNames.map((category, idx) => (
            <Badge 
              key={idx}
              variant="outline" 
              className="bg-white/10 text-white border-none"
            >
              {category}
            </Badge>
          ))}
        </motion.div>
        
        {/* Title */}
        <motion.h1 
          className="text-3xl font-bold mb-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {paper.ai_headline || paper.title_org}
        </motion.h1>
        
        {/* Original title if different */}
        {paper.ai_headline && paper.title_org && paper.ai_headline !== paper.title_org && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-medium text-gray-400 mb-1">Original Title</h3>
            <p className="text-white/80">{paper.title_org}</p>
          </motion.div>
        )}
        
        {/* Key takeaways section */}
        {formattedTakeaways && formattedTakeaways.length > 0 && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <LightbulbIcon className="mr-2 h-5 w-5 text-yellow-400" />
              Key Insights
            </h2>
            <div className="space-y-4">
              {formattedTakeaways.map((takeaway, idx) => (
                <Card key={idx} className="bg-white/5 border-none p-4">
                  <div className="flex">
                    <div className="mr-3 flex-shrink-0">
                      <div className="w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500 rounded-full" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">{takeaway.text}</h3>
                      {takeaway.citation && (
                        <p className="text-white/70 text-sm">{takeaway.citation}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
        
        {/* Abstract section */}
        {cleanAbstract && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <BookOpen className="mr-2 h-5 w-5 text-blue-400" />
              Abstract
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 leading-relaxed">{cleanAbstract}</p>
            </div>
          </motion.div>
        )}
        
        {/* Paper stats */}
        <motion.div 
          className="mt-12 border-t border-white/10 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-between items-center">
            {paper.score && (
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-blue-400" />
                <span className="text-sm">{paper.score} Impact Score</span>
              </div>
            )}
          </div>
        </motion.div>
        
        {/* Disclaimer and Donation section */}
        <DisclaimerSection />
      </div>

      {/* Detail navigation buttons */}
      <DetailNavButtons 
        paperDoi={paper.doi}
        onClose={goBack}
      />
      
      {/* Donation prompt */}
      <DonationPrompt
        isVisible={showDonationPrompt}
        onClose={handleCloseDonationPrompt}
        onDonate={() => handleDonate(false)}
        onSubscribe={() => handleDonate(true)}
      />
      
      {/* Donation modal */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        isSubscription={isSubscription}
      />
    </motion.div>
  );
};

export default PaperDetail;

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
import { motion } from 'framer-motion';
import DetailTakeaways from '../components/paper-content/DetailTakeaways';

const PaperDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);
  
  const [showDonationPrompt, setShowDonationPrompt] = useState(false);
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [isSubscription, setIsSubscription] = useState(false);
  
  const decodedId = id ? decodeURIComponent(id) : '';
  
  const { count: mindBlowCount, isTopPaper } = useMindBlow(decodedId || '');
  
  const { shouldShowDonationPrompt, markDonationPromptSeen, resetPromptTimestamp } = useMindBlowTracker();

  const paperData = usePaperData(paper);

  useEffect(() => {
    if (shouldShowDonationPrompt()) {
      setShowDonationPrompt(true);
    }
  }, [shouldShowDonationPrompt]);

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
      if (!decodedId) return;
      
      try {
        setLoading(true);
        console.log('Loading paper with decoded ID:', decodedId);
        const fetchedPaper = await getPaperById(decodedId);
        
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
  }, [decodedId, navigate]);

  const goBack = () => navigate('/');

  const handleRegenerationStart = () => {
    setIsRegeneratingImage(true);
  };

  const handleRegenerationComplete = (imageUrl: string | null) => {
    setIsRegeneratingImage(false);
    if (imageUrl && paper) {
      setPaper({
        ...paper,
        image_url: imageUrl
      });
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white text-gray-800 p-4 flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!paper) {
    return (
      <div className="min-h-screen bg-white text-gray-800 p-4">
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
      className="min-h-screen bg-white text-gray-800"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-lg border-b border-gray-200">
        <div className="container max-w-3xl mx-auto px-4 py-4 flex items-center">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={goBack}
            className="mr-2 text-gray-600"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-medium truncate text-gray-800">Paper Details</h1>
        </div>
      </header>
      
      <div className="container max-w-3xl mx-auto px-4 py-6 pt-20 pb-24">
        <div className="relative">
          <div className="absolute top-4 left-4 z-10">
            <Badge variant="outline" className="bg-white/70 backdrop-blur-sm text-gray-700 border-gray-200">
              {formattedDate}
            </Badge>
          </div>
          
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
        
        <div className="mt-4">
          <RegenerateImageButton 
            paper={paper}
            onRegenerationStart={handleRegenerationStart}
            onRegenerationComplete={handleRegenerationComplete}
          />
        </div>
        
        <motion.div 
          className="mb-4 flex flex-wrap gap-2 mt-6"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          {formattedCategoryNames.map((category, idx) => (
            <Badge 
              key={idx}
              variant="outline" 
              className="bg-gray-100 text-gray-700 border-gray-200"
            >
              {category}
            </Badge>
          ))}
        </motion.div>
        
        <motion.h1 
          className="text-3xl font-bold mb-6 text-gray-800"
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          {paper.ai_headline || paper.title_org}
        </motion.h1>
        
        {paper.ai_headline && paper.title_org && paper.ai_headline !== paper.title_org && (
          <motion.div 
            className="mb-6"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <h3 className="text-sm font-medium text-gray-500 mb-1">Original Title</h3>
            <p className="text-gray-700">{paper.title_org}</p>
          </motion.div>
        )}
        
        {formattedTakeaways && formattedTakeaways.length > 0 && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <h2 className="flex items-center text-xl font-semibold mb-4 text-gray-800">
              <LightbulbIcon className="mr-2 h-5 w-5 text-amber-500" />
              Key Insights
            </h2>
            <div className="space-y-4">
              {formattedTakeaways.map((takeaway, idx) => (
                <Card key={idx} className="bg-gray-50 border border-gray-200 p-4 shadow-sm">
                  <div className="flex">
                    <div className="mr-3 flex-shrink-0">
                      <div className="w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500 rounded-full" />
                    </div>
                    <div>
                      <h3 className="font-medium mb-1 text-gray-800">{takeaway.text}</h3>
                      {takeaway.citation && (
                        <p className="text-gray-500 text-sm">{takeaway.citation}</p>
                      )}
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </motion.div>
        )}
        
        {cleanAbstract && (
          <motion.div 
            className="mb-8"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <h2 className="flex items-center text-xl font-semibold mb-4 text-gray-800">
              <BookOpen className="mr-2 h-5 w-5 text-blue-500" />
              Abstract
            </h2>
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed">{cleanAbstract}</p>
            </div>
          </motion.div>
        )}
        
        <motion.div 
          className="mt-12 border-t border-gray-200 pt-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <div className="flex justify-between items-center">
            {paper.score && (
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-blue-500" />
                <span className="text-sm text-gray-600">{paper.score} Impact Score</span>
              </div>
            )}
          </div>
        </motion.div>
        
        <DisclaimerSection />
      </div>

      <DetailNavButtons 
        paperDoi={paper.doi}
        onClose={goBack}
      />
      
      <DonationPrompt
        isVisible={showDonationPrompt}
        onClose={handleCloseDonationPrompt}
        onDonate={() => handleDonate(false)}
        onSubscribe={() => handleDonate(true)}
      />
      
      <DonationModal
        isOpen={showDonationModal}
        onClose={() => setShowDonationModal(false)}
        isSubscription={isSubscription}
      />
    </motion.div>
  );
};

export default PaperDetail;

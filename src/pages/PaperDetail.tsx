
import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, BookOpen, LightbulbIcon, BarChart3, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { getPaperById, type Paper } from '../lib/supabase';
import { toast } from 'sonner';
import RegenerateImageButton from '../components/RegenerateImageButton';
import { usePaperData } from '../hooks/use-paper-data';
import HeroImageSection from '../components/paper-content/HeroImageSection';

const PaperDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [paper, setPaper] = useState<Paper | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRegeneratingImage, setIsRegeneratingImage] = useState(false);

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
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Feed
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
    <div className="min-h-screen bg-black text-white">
      {/* Close button at the top instead of header */}
      <div className="sticky top-0 z-30 w-full bg-black/50 backdrop-blur-sm">
        <div className="container max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
          <Button 
            onClick={goBack} 
            variant="ghost" 
            className="text-white hover:bg-white/10"
            size="icon"
          >
            <X size={24} />
          </Button>
        </div>
      </div>
      
      <div className="container max-w-3xl mx-auto px-4 py-6 pb-24">
        {/* Hero section with image - using the updated HeroImageSection component */}
        <HeroImageSection 
          imageSrc={imageSrc}
          title={paper.ai_headline || paper.title_org}
          creator={paper.creator}
          categories={paper.category ? 
            (Array.isArray(paper.category) ? paper.category : [paper.category]) : []}
        />
        
        {/* Regenerate button */}
        <div className="mt-4">
          <RegenerateImageButton 
            paper={paper}
            onRegenerationStart={handleRegenerationStart}
            onRegenerationComplete={handleRegenerationComplete}
          />
        </div>
        
        {/* Date and categories - Already using formatted category names */}
        <div className="mb-4 flex flex-wrap gap-2 mt-6">
          <Badge variant="outline" className="bg-white/10 text-white border-none">
            {formattedDate}
          </Badge>
          
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
        </div>
        
        {/* Title */}
        <h1 className="text-3xl font-bold mb-6">
          {paper.ai_headline || paper.title_org}
        </h1>
        
        {/* Original title if different */}
        {paper.ai_headline && paper.title_org && paper.ai_headline !== paper.title_org && (
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-400 mb-1">Original Title</h3>
            <p className="text-white/80">{paper.title_org}</p>
          </div>
        )}
        
        {/* Key takeaways section */}
        {formattedTakeaways && formattedTakeaways.length > 0 && (
          <div className="mb-8">
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
          </div>
        )}
        
        {/* Abstract section */}
        {cleanAbstract && (
          <div className="mb-8">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <BookOpen className="mr-2 h-5 w-5 text-blue-400" />
              Abstract
            </h2>
            <div className="prose prose-invert max-w-none">
              <p className="text-white/80 leading-relaxed">{cleanAbstract}</p>
            </div>
          </div>
        )}
        
        {/* Paper stats */}
        <div className="mt-12 border-t border-white/10 pt-4">
          <div className="flex justify-between items-center">
            {paper.score && (
              <div className="flex items-center">
                <BarChart3 className="h-4 w-4 mr-2 text-blue-400" />
                <span className="text-sm">{paper.score} Impact Score</span>
              </div>
            )}
            
            {paper.doi && (
              <Button 
                variant="outline"
                size="sm"
                className="bg-blue-900/30 hover:bg-blue-900/50 text-blue-400 border-blue-900"
                asChild
              >
                <a 
                  href={paper.doi.startsWith('http') ? paper.doi : `https://doi.org/${paper.doi}`} 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  View Original Paper
                </a>
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PaperDetail;


import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Calendar, MoveLeft, BookOpen, LightbulbIcon, BarChart3 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card } from '@/components/ui/card';
import { parseKeyTakeaways } from '../utils/takeawayParser';
import { getPaperById, type Paper } from '../lib/supabase';
import { toast } from 'sonner';
import RegenerateImageButton from '../components/RegenerateImageButton';

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

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white p-4 flex items-center justify-center">
        <div className="loading-spinner" />
      </div>
    );
  }

  if (!paper) {
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

  // Format date in European format (DD.MM.YYYY)
  const formattedDate = new Date(paper.created_at).toLocaleDateString('en-GB', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }).replace(/\//g, '.');
  
  const categories = Array.isArray(paper.category) ? paper.category : 
    (typeof paper.category === 'string' ? [paper.category] : []);
  
  const takeaways = parseKeyTakeaways(paper.ai_key_takeaways);
  
  // Process abstract to clean it up
  const cleanAbstract = paper.abstract_org 
    ? paper.abstract_org.includes("Abstract:") 
      ? paper.abstract_org.split("Abstract:")[1].trim()
      : paper.abstract_org
    : "";

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Header with back button */}
      <div className="sticky top-0 z-30 w-full bg-black/90 backdrop-blur-sm border-b border-white/10">
        <div className="container max-w-3xl mx-auto px-4 py-4 flex items-center">
          <Button 
            onClick={goBack} 
            variant="ghost" 
            className="mr-4 text-white hover:bg-white/10"
            size="icon"
          >
            <MoveLeft />
          </Button>
          <h1 className="text-xl font-medium">Research Article</h1>
        </div>
      </div>
      
      <div className="container max-w-3xl mx-auto px-4 py-6 pb-24">
        {/* Hero section with image */}
        {paper.image_url && (
          <div className="aspect-[16/9] w-full overflow-hidden rounded-lg mb-6 relative">
            <img 
              src={paper.image_url} 
              alt={paper.title_org || 'Research paper'} 
              className={`w-full h-full object-cover ${isRegeneratingImage ? 'opacity-50' : ''}`}
            />
            
            {/* Regenerate button */}
            <div className="absolute top-4 right-4">
              <RegenerateImageButton 
                paper={paper}
                onRegenerationStart={handleRegenerationStart}
                onRegenerationComplete={handleRegenerationComplete}
              />
            </div>
            
            {/* Loading overlay */}
            {isRegeneratingImage && (
              <div className="absolute inset-0 flex items-center justify-center bg-black/30">
                <div className="loading-spinner" />
              </div>
            )}
          </div>
        )}
        
        {/* Date and categories */}
        <div className="mb-4 flex flex-wrap gap-2">
          <Badge variant="outline" className="bg-white/10 text-white border-none">
            {formattedDate}
          </Badge>
          
          {categories.map((category, idx) => (
            <Badge 
              key={idx}
              variant="outline" 
              className="bg-white/10 text-white border-none capitalize"
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
        {takeaways && takeaways.length > 0 && (
          <div className="mb-8">
            <h2 className="flex items-center text-xl font-semibold mb-4">
              <LightbulbIcon className="mr-2 h-5 w-5 text-yellow-400" />
              Key Insights
            </h2>
            <div className="space-y-4">
              {takeaways.map((takeaway, idx) => (
                <Card key={idx} className="bg-white/5 border-none p-4">
                  <div className="flex">
                    <div className="mr-3 flex-shrink-0">
                      <div className="w-1 h-full bg-gradient-to-b from-blue-400 to-purple-500 rounded-full" />
                    </div>
                    <div>
                      {/* Use text property for the main content */}
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

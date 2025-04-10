
import React, { useState } from 'react';
import { X, ArrowLeft, Share } from 'lucide-react';
import { Paper } from '../lib/supabase';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { Drawer, DrawerContent } from './ui/drawer';
import PaperCardDetail from './PaperCardDetail';
import { usePaperData } from '../hooks/use-paper-data';
import { useIsMobile } from '../hooks/use-mobile';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { ScrollArea } from './ui/scroll-area';
import ImagePromptModal from './ImagePromptModal';
import { useMindBlow } from '../hooks/use-mind-blow';
import MindBlowButton from './MindBlowButton';
import { useDatabaseToggle } from '../hooks/use-database-toggle';

interface TemporaryDetailViewProps {
  paper: Paper | null;
  isOpen: boolean;
  onClose: () => void;
}

const TemporaryDetailView: React.FC<TemporaryDetailViewProps> = ({
  paper,
  isOpen,
  onClose
}) => {
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);
  const [isGeneratingImage, setIsGeneratingImage] = useState(false);
  const paperData = usePaperData(paper);
  const { databaseSource } = useDatabaseToggle();
  
  // Get mind-blow data for the paper if available
  const paperId = paper?.id || '';
  const { hasMindBlown, count: mindBlowCount, isLoading, isTopPaper, toggleMindBlow } = 
    useMindBlow(paperId);

  // Get from URL if we're in direct route or from props
  const isDirectRoute = location.pathname.startsWith('/paper/');
  
  // Handle the case where we're at /paper/:id route
  const handleClose = () => {
    if (isDirectRoute) {
      navigate('/');
    } else {
      onClose();
    }
  };

  const handleShare = async () => {
    if (!paper) return;
    
    try {
      // Get the correct ID to use in the share URL
      const paperId = paper.id;
      
      if (navigator.share) {
        await navigator.share({
          title: paper.ai_headline || paper.title_org,
          text: 'Check out this interesting paper I found!',
          url: `${window.location.origin}/paper/${paperId}`
        });
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(`${window.location.origin}/paper/${paperId}`);
        alert('Link copied to clipboard!');
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  const handleRegenerationStart = () => {
    setIsGeneratingImage(true);
  };

  const handleRegenerationComplete = (imageUrl: string | null) => {
    setIsGeneratingImage(false);
    if (imageUrl) {
      paperData.refreshImageData(imageUrl);
    }
  };
  
  if (!paper && !isDirectRoute) return null;
  
  const {
    formattedDate,
    imageSrc,
    displayTitle,
    formattedTakeaways
  } = paperData;

  // Mobile: Use bottom drawer that fills the screen
  if (isMobile) {
    return (
      <>
        <Drawer open={isOpen} onOpenChange={handleClose}>
          <DrawerContent className="h-[95vh] max-h-[95vh] p-0">
            <div className="flex flex-col h-full overflow-hidden bg-white">
              <div className="flex justify-between items-center p-4 border-b">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  onClick={handleClose}
                  className="text-gray-700"
                >
                  {isDirectRoute ? <ArrowLeft className="h-5 w-5" /> : <X className="h-5 w-5" />}
                </Button>
                
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="rounded-full bg-white text-gray-700 hover:bg-white/90"
                    onClick={handleShare}
                  >
                    <Share className="h-5 w-5" />
                  </Button>
                  
                  <MindBlowButton
                    hasMindBlown={hasMindBlown}
                    count={mindBlowCount}
                    isTopPaper={isTopPaper}
                    isLoading={isLoading}
                    onClick={toggleMindBlow}
                    size="icon"
                    variant="outline"
                    className="rounded-full bg-white text-gray-700 hover:bg-white/90"
                    showCount={false}
                  />
                </div>
              </div>
              
              <ScrollArea className="flex-1 overflow-y-auto">
                <div className="p-4">
                  <PaperCardDetail
                    displayTitle={displayTitle}
                    title_org={paper?.title_org}
                    abstract_org={paper?.abstract_org}
                    formattedDate={formattedDate}
                    doi={paperId}
                    takeaways={formattedTakeaways}
                    creator={paper?.creator}
                    imageSrc={imageSrc}
                    onClose={handleClose}
                  />
                  
                  <div className="mt-4">
                    <Button 
                      onClick={() => setIsPromptModalOpen(true)}
                      variant="outline"
                      className="w-full"
                      disabled={isGeneratingImage}
                    >
                      {isGeneratingImage ? 'Generating...' : 'Regenerate Image'}
                    </Button>
                  </div>
                </div>
              </ScrollArea>
            </div>
          </DrawerContent>
        </Drawer>
        
        {paper && (
          <ImagePromptModal
            isOpen={isPromptModalOpen}
            onClose={() => setIsPromptModalOpen(false)}
            paper={paper}
            onRegenerationStart={handleRegenerationStart}
            onRegenerationComplete={handleRegenerationComplete}
          />
        )}
      </>
    );
  }
  
  // Tablet/desktop: Use centered dialog
  return (
    <>
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-white">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={handleClose}
                className="text-gray-700"
              >
                {isDirectRoute ? <ArrowLeft className="h-5 w-5" /> : <X className="h-5 w-5" />}
              </Button>
              
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  size="icon"
                  className="rounded-full bg-white text-gray-700 hover:bg-white/90"
                  onClick={handleShare}
                >
                  <Share className="h-5 w-5" />
                </Button>
                
                <MindBlowButton
                  hasMindBlown={hasMindBlown}
                  count={mindBlowCount}
                  isTopPaper={isTopPaper}
                  isLoading={isLoading}
                  onClick={toggleMindBlow}
                  size="icon"
                  variant="outline"
                  className="rounded-full bg-white text-gray-700 hover:bg-white/90"
                  showCount={false}
                />
              </div>
            </div>
            
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-6">
                <PaperCardDetail
                  displayTitle={displayTitle}
                  title_org={paper?.title_org}
                  abstract_org={paper?.abstract_org}
                  formattedDate={formattedDate}
                  doi={paperId}
                  takeaways={formattedTakeaways}
                  creator={paper?.creator}
                  imageSrc={imageSrc}
                  onClose={handleClose}
                />
                
                <div className="mt-4">
                  <Button 
                    onClick={() => setIsPromptModalOpen(true)}
                    variant="outline"
                    className="w-full"
                    disabled={isGeneratingImage}
                  >
                    {isGeneratingImage ? 'Generating...' : 'Regenerate Image'}
                  </Button>
                </div>
              </div>
            </ScrollArea>
          </div>
        </DialogContent>
      </Dialog>
      
      {paper && (
        <ImagePromptModal
          isOpen={isPromptModalOpen}
          onClose={() => setIsPromptModalOpen(false)}
          paper={paper}
          onRegenerationStart={handleRegenerationStart}
          onRegenerationComplete={handleRegenerationComplete}
        />
      )}
    </>
  );
};

export default TemporaryDetailView;

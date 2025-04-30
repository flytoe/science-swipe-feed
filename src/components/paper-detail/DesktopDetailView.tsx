
import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent } from '../ui/dialog';
import { ScrollArea } from '../ui/scroll-area';
import DetailActions from './DetailActions';
import PaperCardDetail from '../PaperCardDetail';
import ImagePromptModal from '../ImagePromptModal';
import { Paper } from '../../lib/supabase';
import ClaudeToggle from '../ClaudeToggle';
import PostTypeBadge from '../PostTypeBadge';

interface DesktopDetailViewProps {
  paper: Paper | null;
  isOpen: boolean;
  onClose: () => void;
  isDirectRoute: boolean;
  paperData: any;
  isGeneratingImage: boolean;
  onRegenerationStart: () => void;
  onRegenerationComplete: (imageUrl: string | null) => void;
  isPromptModalOpen: boolean;
  onPromptModalClose: () => void;
  claudeMode: boolean;
  toggleClaudeMode: (enabled: boolean) => void;
}

const DesktopDetailView: React.FC<DesktopDetailViewProps> = ({
  paper,
  isOpen,
  onClose,
  isDirectRoute,
  paperData,
  isGeneratingImage,
  onRegenerationStart,
  onRegenerationComplete,
  isPromptModalOpen,
  onPromptModalClose,
  claudeMode,
  toggleClaudeMode
}) => {
  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="max-w-3xl max-h-[90vh] p-0 overflow-hidden bg-black text-white border-4 border-white">
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-4 border-b-4 border-white">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-white hover:bg-white hover:text-black transition-colors"
              >
                {isDirectRoute ? <ArrowLeft className="h-5 w-5" /> : <X className="h-5 w-5" />}
              </Button>
              
              <div className="flex items-center gap-3">
                {paper?.claude_refined && (
                  <ClaudeToggle
                    paperId={paper.id}
                    isEnabled={claudeMode}
                    onToggle={toggleClaudeMode}
                    size="md"
                  />
                )}
                
                {paper && (
                  <DetailActions paperId={paper.id} onClose={onClose} />
                )}
              </div>
            </div>
            
            <ScrollArea className="flex-1 overflow-y-auto bg-black">
              <div className="p-6">
                {paper?.post_type && (
                  <div className="mb-4">
                    <PostTypeBadge type={paper.post_type} size="lg" />
                  </div>
                )}
                <PaperCardDetail {...paperData} />
                
                <div className="mt-4">
                  <Button 
                    onClick={() => onPromptModalClose()}
                    variant="outline"
                    className="w-full border-4 border-white text-white hover:bg-white hover:text-black font-bold uppercase tracking-wider"
                    disabled={isGeneratingImage}
                  >
                    {isGeneratingImage ? 'GENERATING...' : 'REGENERATE IMAGE'}
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
          onClose={onPromptModalClose}
          paper={paper}
          onRegenerationStart={onRegenerationStart}
          onRegenerationComplete={onRegenerationComplete}
        />
      )}
    </>
  );
};

export default DesktopDetailView;

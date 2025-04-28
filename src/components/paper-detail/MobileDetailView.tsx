
import React from 'react';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '../ui/button';
import { Drawer, DrawerContent } from '../ui/drawer';
import { ScrollArea } from '../ui/scroll-area';
import DetailActions from './DetailActions';
import PaperCardDetail from '../PaperCardDetail';
import ImagePromptModal from '../ImagePromptModal';
import { Paper } from '../../lib/supabase';
import ClaudeToggle from '../ClaudeToggle';

interface MobileDetailViewProps {
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

const MobileDetailView: React.FC<MobileDetailViewProps> = ({
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
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="h-[95vh] max-h-[95vh] p-0">
          <div className="flex flex-col h-full overflow-hidden bg-white">
            <div className="flex justify-between items-center p-4 border-b">
              <Button 
                variant="ghost" 
                size="icon" 
                onClick={onClose}
                className="text-gray-700"
              >
                {isDirectRoute ? <ArrowLeft className="h-5 w-5" /> : <X className="h-5 w-5" />}
              </Button>
              
              <div className="flex items-center gap-2">
                {paper?.claude_refined && (
                  <ClaudeToggle
                    paperId={paper.id}
                    isEnabled={claudeMode}
                    onToggle={toggleClaudeMode}
                  />
                )}
                
                {paper && (
                  <DetailActions paperId={paper.id} onClose={onClose} />
                )}
              </div>
            </div>
            
            <ScrollArea className="flex-1 overflow-y-auto">
              <div className="p-4">
                <PaperCardDetail {...paperData} />
                
                <div className="mt-4">
                  <Button 
                    onClick={() => onPromptModalClose()}
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
          onClose={onPromptModalClose}
          paper={paper}
          onRegenerationStart={onRegenerationStart}
          onRegenerationComplete={onRegenerationComplete}
        />
      )}
    </>
  );
};

export default MobileDetailView;

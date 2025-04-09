
import React from 'react';
import { X } from 'lucide-react';
import { Paper } from '../lib/supabase';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { Dialog, DialogContent } from './ui/dialog';
import { Drawer, DrawerContent } from './ui/drawer';
import { Sheet, SheetContent } from './ui/sheet';
import PaperCardDetail from './PaperCardDetail';
import { usePaperData } from '../hooks/use-paper-data';
import { useIsMobile } from '../hooks/use-mobile';

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
  const paperData = usePaperData(paper);
  
  if (!paper) return null;
  
  const {
    formattedCategoryNames,
    formattedDate,
    imageSrc,
    displayTitle,
    formattedTakeaways
  } = paperData;

  // Mobile: Use bottom drawer
  if (isMobile) {
    return (
      <Drawer open={isOpen} onOpenChange={onClose}>
        <DrawerContent className="max-h-[95vh] overflow-y-auto">
          <div className="p-0 overflow-hidden rounded-t-xl bg-white">
            <Button 
              variant="ghost" 
              size="icon" 
              className="absolute right-2 top-2 z-50 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-700"
              onClick={onClose}
            >
              <X className="h-4 w-4" />
            </Button>
            
            <PaperCardDetail
              displayTitle={displayTitle}
              title_org={paper.title_org}
              abstract_org={paper.abstract_org}
              formattedDate={formattedDate}
              doi={paper.doi}
              takeaways={formattedTakeaways}
              creator={paper.creator}
              imageSrc={imageSrc}
              onClose={onClose}
            />
          </div>
        </DrawerContent>
      </Drawer>
    );
  }
  
  // Tablet/desktop: Use side sheet
  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      <SheetContent className="w-[90%] max-w-xl p-0 overflow-y-auto">
        <div className="h-full overflow-y-auto">
          <Button 
            variant="ghost" 
            size="icon" 
            className="absolute right-2 top-2 z-50 bg-white/80 backdrop-blur-sm hover:bg-white/90 text-gray-700"
            onClick={onClose}
          >
            <X className="h-4 w-4" />
          </Button>
          
          <PaperCardDetail
            displayTitle={displayTitle}
            title_org={paper.title_org}
            abstract_org={paper.abstract_org}
            formattedDate={formattedDate}
            doi={paper.doi}
            takeaways={formattedTakeaways}
            creator={paper.creator}
            imageSrc={imageSrc}
            onClose={onClose}
          />
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default TemporaryDetailView;

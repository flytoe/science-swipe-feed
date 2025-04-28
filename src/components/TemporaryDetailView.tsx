
import React, { useState } from 'react';
import { Paper } from '../lib/supabase';
import { useIsMobile } from '../hooks/use-mobile';
import { usePaperData } from '../hooks/use-paper-data';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import MobileDetailView from './paper-detail/MobileDetailView';
import DesktopDetailView from './paper-detail/DesktopDetailView';

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
  
  const isDirectRoute = location.pathname.startsWith('/paper/');
  
  const handleClose = () => {
    if (isDirectRoute) {
      navigate('/');
    } else {
      onClose();
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

  const sharedProps = {
    paper,
    isOpen,
    onClose: handleClose,
    isDirectRoute,
    paperData,
    isGeneratingImage,
    onRegenerationStart: handleRegenerationStart,
    onRegenerationComplete: handleRegenerationComplete,
    isPromptModalOpen,
    onPromptModalClose: () => setIsPromptModalOpen(true),
    showClaudeToggle: paperData.showClaudeToggle,
    isClaudeEnabled: !!paper?.show_claude,
    toggleClaudeMode: paperData.toggleClaudeMode
  };
  
  return isMobile ? (
    <MobileDetailView {...sharedProps} />
  ) : (
    <DesktopDetailView {...sharedProps} />
  );
};

export default TemporaryDetailView;

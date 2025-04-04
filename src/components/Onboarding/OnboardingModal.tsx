
import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { X } from 'lucide-react';
import UserTypeQuestion from './UserTypeQuestion';
import TopicsQuestion from './TopicsQuestion';
import { useOnboardingStore } from '@/hooks/use-onboarding';

interface OnboardingModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const OnboardingModal: React.FC<OnboardingModalProps> = ({ isOpen, onClose }) => {
  const [step, setStep] = useState(1);
  const { completeOnboarding } = useOnboardingStore();
  
  // Reset step when modal opens
  useEffect(() => {
    if (isOpen) {
      setStep(1);
    }
  }, [isOpen]);
  
  const handleNext = () => {
    if (step < 2) {
      setStep(step + 1);
    } else {
      completeOnboarding();
      onClose();
    }
  };

  const handleSkip = () => {
    completeOnboarding();
    onClose();
  };
  
  // Animation variants
  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };
  
  const modalVariants = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: { 
      opacity: 1, 
      y: 0, 
      scale: 1,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: { opacity: 0, y: 20, scale: 0.95 },
  };
  
  const slideVariants = {
    enter: (direction: number) => ({
      x: direction > 0 ? 100 : -100,
      opacity: 0,
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: { type: 'spring', damping: 25, stiffness: 300 }
    },
    exit: (direction: number) => ({
      x: direction < 0 ? 100 : -100,
      opacity: 0,
    }),
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial="hidden"
          animate="visible"
          exit="hidden"
          variants={overlayVariants}
        >
          <motion.div 
            className="relative w-full max-w-md bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-white/10"
            variants={modalVariants}
          >
            {/* Header */}
            <div className="relative p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white text-center">Personalize Your Feed</h2>
              <button 
                onClick={handleSkip} 
                className="absolute right-4 top-4 text-gray-400 hover:text-white"
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-5 h-[60vh] max-h-[500px] overflow-y-auto">
              <AnimatePresence custom={step}>
                {step === 1 && (
                  <motion.div
                    key="step1"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <UserTypeQuestion onContinue={handleNext} />
                  </motion.div>
                )}
                
                {step === 2 && (
                  <motion.div
                    key="step2"
                    custom={1}
                    variants={slideVariants}
                    initial="enter"
                    animate="center"
                    exit="exit"
                  >
                    <TopicsQuestion onContinue={handleNext} />
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            
            {/* Footer */}
            <div className="p-4 border-t border-white/10 flex justify-between">
              <button 
                onClick={handleSkip}
                className="px-4 py-2 text-sm text-white/70 hover:text-white"
              >
                Skip for now
              </button>
              
              <div className="flex gap-1">
                <div className={`w-2 h-2 rounded-full ${step === 1 ? 'bg-white' : 'bg-white/30'}`} />
                <div className={`w-2 h-2 rounded-full ${step === 2 ? 'bg-white' : 'bg-white/30'}`} />
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default OnboardingModal;


import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, CheckCircle2 } from 'lucide-react';

interface DonationModalProps {
  isOpen: boolean;
  onClose: () => void;
  isSubscription?: boolean;
}

const DonationModal: React.FC<DonationModalProps> = ({
  isOpen,
  onClose,
  isSubscription = false
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const handleDonate = () => {
    setIsSubmitting(true);
    
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSuccess(true);
      
      setTimeout(() => {
        onClose();
        setIsSuccess(false);
      }, 3000);
    }, 1500);
  };
  
  const title = isSubscription 
    ? "Monatlich unterstützen" 
    : "Einmalig unterstützen";
  
  const amount = isSubscription ? "3 € / Monat" : "2 €";
  
  const buttonText = isSubscription
    ? "Monatliches Abo starten" 
    : "Jetzt 2 € spenden";
  
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          <motion.div
            className="relative w-full max-w-[min(420px,90vw)] bg-gray-900 rounded-xl overflow-hidden shadow-xl border border-white/10"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          >
            {/* Header */}
            <div className="relative p-4 border-b border-white/10">
              <h2 className="text-lg font-semibold text-white text-center pr-8">{title}</h2>
              <button 
                onClick={onClose} 
                className="absolute right-4 top-4 text-gray-400 hover:text-white p-1"
                disabled={isSubmitting}
              >
                <X size={20} />
              </button>
            </div>
            
            {/* Content */}
            <div className="p-6">
              {isSuccess ? (
                <div className="text-center py-8">
                  <CheckCircle2 className="mx-auto mb-4 text-green-500" size={48} />
                  <h3 className="text-xl font-semibold text-white mb-2">Vielen Dank!</h3>
                  <p className="text-gray-300">Deine Unterstützung hilft uns, weiterhin qualitativ hochwertige wissenschaftliche Inhalte anzubieten.</p>
                </div>
              ) : (
                <>
                  <div className="mb-6 text-center">
                    <div className="text-3xl font-bold text-white mb-2">{amount}</div>
                    <p className="text-gray-300">Deine Unterstützung macht den Unterschied</p>
                  </div>
                  
                  <div className="bg-gray-800/50 rounded-lg p-4 mb-6">
                    <h3 className="font-semibold text-white mb-2">Was deine Unterstützung bewirkt:</h3>
                    <ul className="space-y-2 text-sm text-gray-300">
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Werbefrei und ohne Paywalls bleiben</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Wissenschaftliche Inhalte für alle zugänglich machen</span>
                      </li>
                      <li className="flex items-start">
                        <span className="mr-2">•</span>
                        <span>Neue Funktionen entwickeln</span>
                      </li>
                    </ul>
                  </div>
                  
                  <motion.button
                    onClick={handleDonate}
                    disabled={isSubmitting}
                    className={`
                      w-full py-3 px-4 rounded-lg font-medium transition
                      ${isSubmitting 
                        ? 'bg-indigo-600/50 text-white/70 cursor-not-allowed' 
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 active:scale-[0.98]'}
                    `}
                    whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                    whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  >
                    {isSubmitting ? 'Verarbeite...' : buttonText}
                  </motion.button>
                </>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DonationModal;

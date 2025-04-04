
import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface DonationPromptProps {
  isVisible: boolean;
  onClose: () => void;
  onDonate: () => void;
  onSubscribe: () => void;
}

const DonationPrompt: React.FC<DonationPromptProps> = ({
  isVisible,
  onClose,
  onDonate,
  onSubscribe
}) => {
  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 20 }}
          transition={{ type: 'spring', damping: 25, stiffness: 300 }}
          className="fixed bottom-20 left-1/2 transform -translate-x-1/2 w-[90%] max-w-sm bg-gradient-to-br from-indigo-900 to-purple-900 rounded-lg p-4 border border-white/20 shadow-xl"
        >
          <button 
            onClick={onClose}
            className="absolute right-2 top-2 text-white/60 hover:text-white"
          >
            <X size={18} />
          </button>
          
          <h3 className="text-lg font-bold text-white mb-1">
            Schon 10x 🤯 – gefällt dir, was wir tun?
          </h3>
          
          <p className="text-white/80 text-sm mb-4">
            Wissenschaft, die berührt.<br /><br />
            Wir glauben: Wissenschaft gehört allen – und muss genauso erzählt werden, wie sie begeistert.<br /><br />
            Damit wir das weiterhin ohne Werbung, Paywalls oder Sponsoren schaffen, brauchen wir dich.
          </p>
          
          <div className="flex flex-col gap-2">
            <motion.button
              onClick={onDonate}
              className="w-full py-2 bg-white text-indigo-900 rounded-md font-medium"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Plattform unterstützen – 2 € spenden
            </motion.button>
            
            <motion.button
              onClick={onSubscribe}
              className="w-full py-2 bg-white/20 text-white rounded-md font-medium hover:bg-white/30"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Monatlich helfen – 3 €/Monat
            </motion.button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DonationPrompt;


import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { useOnboardingStore } from '@/hooks/use-onboarding';

interface UserTypeQuestionProps {
  onContinue: () => void;
}

const UserTypeQuestion: React.FC<UserTypeQuestionProps> = ({ onContinue }) => {
  const { userType, setUserType } = useOnboardingStore();
  const [selectedType, setSelectedType] = useState<string | null>(userType);
  
  const userTypes = [
    { id: 'student', label: 'I\'m a student or researcher' },
    { id: 'curious', label: 'I\'m just curious about science' },
    { id: 'inspiration', label: 'I\'m looking for inspiring ideas' },
    { id: 'viral', label: 'I like viral science stuff' },
    { id: 'exploring', label: 'Just exploring' },
  ];
  
  const handleSelect = (type: string) => {
    setSelectedType(type);
    setUserType(type);
  };
  
  const handleContinue = () => {
    if (selectedType) {
      onContinue();
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">What brings you here?</h3>
        <p className="text-gray-400">We'll tailor the content to fit your vibe.</p>
      </div>
      
      <div className="space-y-3 mt-6">
        {userTypes.map((type) => (
          <motion.button
            key={type.id}
            onClick={() => handleSelect(type.id)}
            className={`
              w-full p-4 text-left rounded-lg border transition-all
              ${selectedType === type.id 
                ? 'bg-indigo-500/20 border-indigo-500 text-white' 
                : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800'}
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {type.label}
          </motion.button>
        ))}
      </div>
      
      <div className="pt-4">
        <motion.button
          onClick={handleContinue}
          disabled={!selectedType}
          className={`
            w-full py-3 rounded-lg font-medium transition
            ${selectedType 
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-gray-700 text-gray-300 cursor-not-allowed'}
          `}
          whileHover={selectedType ? { scale: 1.02 } : {}}
          whileTap={selectedType ? { scale: 0.98 } : {}}
        >
          Continue
        </motion.button>
      </div>
    </div>
  );
};

export default UserTypeQuestion;


import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useOnboardingStore } from '@/hooks/use-onboarding';

interface TopicsQuestionProps {
  onContinue: () => void;
}

const TopicsQuestion: React.FC<TopicsQuestionProps> = ({ onContinue }) => {
  const { interestedTopics, setInterestedTopics } = useOnboardingStore();
  const [selectedTopics, setSelectedTopics] = useState<string[]>(interestedTopics);
  
  const topics = [
    { id: 'ai', label: 'AI & tech', emoji: '🤖' },
    { id: 'psychology', label: 'Psychology & mind', emoji: '🧠' },
    { id: 'health', label: 'Health & bio', emoji: '🧬' },
    { id: 'environment', label: 'Environment & climate', emoji: '🌍' },
    { id: 'space', label: 'Space & physics', emoji: '🚀' },
    { id: 'society', label: 'Society & people', emoji: '👥' },
    { id: 'weird', label: 'Weird & surprising', emoji: '🤯' },
  ];
  
  const toggleTopic = (topicId: string) => {
    setSelectedTopics((prev) => {
      if (prev.includes(topicId)) {
        return prev.filter(id => id !== topicId);
      } else {
        return [...prev, topicId];
      }
    });
  };
  
  useEffect(() => {
    setInterestedTopics(selectedTopics);
  }, [selectedTopics, setInterestedTopics]);
  
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="text-xl font-semibold text-white">What topics excite you most?</h3>
        <p className="text-gray-400">Select as many as you like.</p>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mt-6">
        {topics.map((topic) => (
          <motion.button
            key={topic.id}
            onClick={() => toggleTopic(topic.id)}
            className={`
              relative p-4 rounded-lg border transition-all flex items-center gap-3
              ${selectedTopics.includes(topic.id) 
                ? 'bg-indigo-500/20 border-indigo-500 text-white' 
                : 'bg-gray-800/50 border-gray-700 text-gray-300 hover:bg-gray-800'}
            `}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <span className="text-xl">{topic.emoji}</span>
            <span>{topic.label}</span>
            
            {selectedTopics.includes(topic.id) && (
              <motion.div 
                className="absolute top-2 right-2 bg-indigo-500 rounded-full p-0.5"
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ type: 'spring', damping: 20, stiffness: 300 }}
              >
                <Check size={12} />
              </motion.div>
            )}
          </motion.button>
        ))}
      </div>
      
      <div className="pt-4">
        <motion.button
          onClick={onContinue}
          disabled={selectedTopics.length === 0}
          className={`
            w-full py-3 rounded-lg font-medium transition
            ${selectedTopics.length > 0
              ? 'bg-indigo-600 text-white hover:bg-indigo-700' 
              : 'bg-gray-700 text-gray-300 cursor-not-allowed'}
          `}
          whileHover={selectedTopics.length > 0 ? { scale: 1.02 } : {}}
          whileTap={selectedTopics.length > 0 ? { scale: 0.98 } : {}}
        >
          Complete
        </motion.button>
      </div>
    </div>
  );
};

export default TopicsQuestion;

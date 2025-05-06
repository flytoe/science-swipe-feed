
import React from 'react';
import { motion } from 'framer-motion';
import PostTypeBadge from './PostTypeBadge';

// Define available post types for filtering
const postTypes = [
  'breakthrough',
  'what if',
  'mythbuster',
  'gamechanger',
  'reality check',
  'hidden gem'
];

interface TypeFilterProps {
  selectedTypes: string[];
  onTypeSelect: (types: string[]) => void;
}

const TypeFilter: React.FC<TypeFilterProps> = ({ selectedTypes, onTypeSelect }) => {
  const toggleType = (type: string) => {
    if (selectedTypes.includes(type)) {
      onTypeSelect(selectedTypes.filter(t => t !== type));
    } else {
      onTypeSelect([...selectedTypes, type]);
    }
  };

  return (
    <div className="w-full">
      <h3 className="text-lg font-semibold mb-4">Filter by Type</h3>
      
      <div className="flex flex-wrap gap-3 mb-6">
        {postTypes.map((type) => {
          const isSelected = selectedTypes.includes(type);
          return (
            <motion.div
              key={type}
              whileTap={{ scale: 0.95 }}
              onClick={() => toggleType(type)}
              className={`cursor-pointer transition-all ${isSelected ? 'ring-4 ring-white/50' : 'opacity-70 hover:opacity-90'}`}
            >
              <PostTypeBadge type={type} size="md" />
            </motion.div>
          );
        })}
      </div>
      
      {selectedTypes.length > 0 && (
        <button
          onClick={() => onTypeSelect([])}
          className="text-xs text-white/70 underline hover:text-white"
        >
          Clear all filters
        </button>
      )}
    </div>
  );
};

export default TypeFilter;

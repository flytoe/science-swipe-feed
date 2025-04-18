
import React from 'react';
import { QUICK_TAGS } from './quick-tags';

interface QuickTagSelectorProps {
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

const QuickTagSelector: React.FC<QuickTagSelectorProps> = ({
  selectedTags,
  onToggleTag,
}) => {
  return (
    <div className="mb-3 flex flex-wrap gap-2">
      {QUICK_TAGS.map((tag, index) => (
        <button
          key={index}
          type="button"
          onClick={() => onToggleTag(tag)}
          className={`px-2 py-1 text-xs rounded-full transition-colors ${
            selectedTags.includes(tag) 
              ? 'bg-yellow-500 text-black' 
              : 'bg-white/10 text-white hover:bg-white/20'
          }`}
        >
          {tag}
        </button>
      ))}
    </div>
  );
};

export default QuickTagSelector;

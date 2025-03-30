
import React from 'react';

interface OriginalTitleSectionProps {
  title_org?: string;
  title: string;
}

const OriginalTitleSection: React.FC<OriginalTitleSectionProps> = ({ title_org, title }) => {
  if (!title_org || title_org === title) return null;

  return (
    <div className="mt-6 border-t border-white/10 pt-4">
      <h3 className="text-sm font-medium text-white/80 mb-2">Original Title</h3>
      <p className="text-sm text-white/70">{title_org}</p>
    </div>
  );
};

export default OriginalTitleSection;

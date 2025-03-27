
import React from 'react';
import { Clock } from 'lucide-react';
import { FormattedTakeaway } from '../utils/takeawayParser';
import PaperCardTakeaways from './PaperCardTakeaways';

interface PaperCardContentProps {
  title: string;
  abstract?: string;
  formattedDate: string;
  doi?: string;
  takeaways: FormattedTakeaway[];
}

const PaperCardContent: React.FC<PaperCardContentProps> = ({
  title,
  abstract,
  formattedDate,
  doi,
  takeaways
}) => {
  return (
    <div className="paper-card-content">
      <h2 className="paper-card-title">
        {title}
      </h2>
      
      {takeaways && takeaways.length > 0 ? (
        <PaperCardTakeaways takeaways={takeaways} />
      ) : abstract ? (
        // Fallback to abstract if no takeaways are available
        <p className="text-sm md:text-base text-gray-700 mb-4">
          {abstract}
        </p>
      ) : null}
      
      <div className="paper-card-meta">
        <div className="flex items-center">
          <Clock size={14} className="mr-1" />
          <span>{formattedDate}</span>
        </div>
        {doi && (
          <a 
            href={`https://doi.org/${doi}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-blue-500 hover:text-blue-700 transition-colors"
          >
            View Source
          </a>
        )}
      </div>
    </div>
  );
};

export default PaperCardContent;

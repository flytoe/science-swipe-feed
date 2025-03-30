
import React from 'react';
import { Clock, ExternalLink } from 'lucide-react';
import { Button } from '../ui/button';

interface ContentFooterProps {
  formattedDate: string;
  doi?: string;
}

const ContentFooter: React.FC<ContentFooterProps> = ({ formattedDate, doi }) => {
  // Create the DOI URL with proper handling
  const doiUrl = doi ? (
    doi.startsWith('http') ? doi : `https://doi.org/${doi}`
  ) : undefined;

  return (
    <div className="paper-card-meta border-t border-white/10 p-4 flex justify-between items-center">
      <div className="flex items-center">
        <Clock size={14} className="mr-1 text-white/60" />
        <span className="text-white/60">{formattedDate}</span>
      </div>
      {doiUrl && (
        <Button 
          variant="outline"
          size="sm"
          className="inline-flex items-center gap-1 text-xs bg-blue-950/40 hover:bg-blue-900/60 text-blue-400 border-blue-900/40"
          asChild
          onClick={(e) => e.stopPropagation()}
        >
          <a 
            href={doiUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            <ExternalLink size={14} />
            <span>View Paper</span>
          </a>
        </Button>
      )}
    </div>
  );
};

export default ContentFooter;

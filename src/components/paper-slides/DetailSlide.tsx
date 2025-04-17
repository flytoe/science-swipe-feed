
import React from 'react';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';
import AbstractSection from '../paper-content/AbstractSection';
import OriginalTitleSection from '../paper-content/OriginalTitleSection';

interface DetailSlideProps {
  title: string;
  title_org?: string;
  abstract_org?: string;
  doi?: string;
}

const DetailSlide: React.FC<DetailSlideProps> = ({
  title,
  title_org,
  abstract_org,
  doi
}) => {
  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (doi) {
      const doiUrl = doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
      window.open(doiUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-6 bg-white/95 backdrop-blur-sm">
      <div className="space-y-6">
        <OriginalTitleSection title={title} title_org={title_org} />
        <AbstractSection abstract_org={abstract_org} />
        
        {doi && (
          <div className="pt-4">
            <Button
              variant="outline"
              className="w-full"
              onClick={handleExternalClick}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Full Paper
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DetailSlide;

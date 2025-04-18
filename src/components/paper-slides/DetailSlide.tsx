
import React from 'react';
import { Button } from '../ui/button';
import { ExternalLink } from 'lucide-react';
import AbstractSection from '../paper-content/AbstractSection';
import OriginalTitleSection from '../paper-content/OriginalTitleSection';
import { Badge } from '../ui/badge';

interface DetailSlideProps {
  title: string;
  title_org?: string;
  abstract_org?: string;
  doi?: string;
  creator?: string[] | string | null;
}

const DetailSlide: React.FC<DetailSlideProps> = ({
  title,
  title_org,
  abstract_org,
  doi,
  creator
}) => {
  // Format the creators for display
  const creatorDisplay = React.useMemo(() => {
    if (!creator) return null;
    if (typeof creator === 'string') return creator;
    if (Array.isArray(creator)) return creator.join(', ');
    return null;
  }, [creator]);

  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (doi) {
      const doiUrl = doi.startsWith('http') ? doi : `https://doi.org/${doi}`;
      window.open(doiUrl, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <div className="w-full h-full overflow-y-auto p-6 bg-black/60 backdrop-blur-md">
      <div className="space-y-6">
        {creatorDisplay && (
          <div className="text-white/80 text-sm">
            By {creatorDisplay}
          </div>
        )}
        
        <div className="mb-4">
          <Badge variant="outline" className="bg-white/10 text-white border-white/20">
            Details
          </Badge>
        </div>

        <OriginalTitleSection title={title} title_org={title_org} />
        <AbstractSection abstract_org={abstract_org} isWhiteText />
        
        {doi && (
          <div className="pt-4">
            <Button
              variant="outline"
              className="w-full bg-white/10 text-white border-white/20 hover:bg-white/20"
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


import React from 'react';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { ExternalLink, LayoutList } from 'lucide-react';
import AbstractSection from './paper-content/AbstractSection';
import OriginalTitleSection from './paper-content/OriginalTitleSection';
import PaperCardTakeaways from './PaperCardTakeaways';
import { FormattedTakeaway } from '../utils/takeawayParser';
import { useNavigate } from 'react-router-dom';

interface PaperCardContentProps {
  title: string;
  title_org?: string;
  abstract?: string;
  abstract_org?: string;
  formattedDate: string;
  doi?: string;
  takeaways: FormattedTakeaway[];
  creator?: string[] | string | null;
  imageSrc: string;
  hideHeroImage?: boolean;
  hideFooter?: boolean;
}

const PaperCardContent: React.FC<PaperCardContentProps> = ({
  title,
  title_org,
  abstract_org,
  formattedDate,
  doi,
  takeaways,
  creator,
  hideHeroImage = false,
  hideFooter = false,
}) => {
  const navigate = useNavigate();
  
  // Create formatted DOI for external link
  const doiUrl = doi?.startsWith('http') ? doi : `https://doi.org/${doi}`;
  
  // Create encoded paper ID for internal link
  const encodedPaperId = doi ? encodeURIComponent(doi) : '';
  
  const handleDetailClick = () => {
    if (doi) {
      navigate(`/paper/${encodedPaperId}`);
    }
  };
  
  const handleExternalClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    window.open(doiUrl, '_blank', 'noopener,noreferrer');
  };
  
  return (
    <div className="p-6 text-white space-y-4">
      {/* Show title (AI headline or original title) */}
      <h2 className="text-2xl md:text-3xl font-bold leading-tight text-white">
        {title}
      </h2>
      
      {/* Show original title if different from displayed title */}
      <OriginalTitleSection 
        title={title} 
        title_org={title_org} 
      />
      
      {/* Takeaways section */}
      {takeaways && takeaways.length > 0 && (
        <PaperCardTakeaways takeaways={takeaways} />
      )}
      
      {/* Abstract section */}
      <AbstractSection abstract_org={abstract_org} />
      
      {/* Authors/creators */}
      {creator && (
        <div className="mt-4 text-sm">
          <h3 className="text-white/80 font-medium mb-1">Authors</h3>
          <p className="text-white/70">
            {Array.isArray(creator) 
              ? creator.join(', ') 
              : creator}
          </p>
        </div>
      )}
      
      {/* Footer with date and links */}
      {!hideFooter && (
        <div className="mt-8 pt-4 border-t border-white/10 flex justify-between items-center">
          <div className="flex items-center">
            <Badge variant="outline" className="bg-white/10 text-white border-none">
              {formattedDate}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-2">
            {doi && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white"
                onClick={handleDetailClick}
              >
                <LayoutList className="h-4 w-4 mr-1" />
                Details
              </Button>
            )}
            
            {doi && (
              <Button
                variant="ghost"
                size="sm"
                className="text-white/70 hover:text-white"
                onClick={handleExternalClick}
              >
                <ExternalLink className="h-4 w-4 mr-1" />
                Source
              </Button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default PaperCardContent;

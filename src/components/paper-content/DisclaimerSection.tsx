
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';

const DisclaimerSection: React.FC = () => {
  return (
    <div className="mt-6 border-t border-white/10 pt-4 pb-2">
      <div className="bg-white/5 rounded-md p-3 flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-xs text-white/70">
            This content was generated using AI and may contain inaccuracies or errors.
          </p>
        </div>
        <Button 
          variant="outline" 
          size="sm" 
          className="self-start text-xs border-white/10 hover:bg-white/10"
          onClick={(e) => e.stopPropagation()}
        >
          Report a problem
        </Button>
      </div>
    </div>
  );
};

export default DisclaimerSection;

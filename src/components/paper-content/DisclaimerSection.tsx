
import React from 'react';
import { AlertTriangle } from 'lucide-react';
import { Button } from '../ui/button';
import DonationBox from '../donations/DonationBox';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";

const DisclaimerSection: React.FC = () => {
  return (
    <div className="mt-6 border-t border-white/10 pt-4 pb-2">
      <div className="bg-amber-950 rounded-md p-3 flex flex-col gap-2">
        <div className="flex items-start gap-2">
          <AlertTriangle size={16} className="text-amber-500 mt-.5 flex-shrink-0" />
          <p className="text-xs text-white/70">
            This content was generated using AI and may contain inaccuracies or errors.
          </p>
        </div>
        <div className="flex justify-between items-center">
          <Dialog>
            <DialogTrigger asChild>
              <Button 
                size="sm" 
                className="self-start text-xs border-white/10 hover:bg-white/10"
                onClick={(e) => e.stopPropagation()}
              >
                Report a problem
              </Button>
            </DialogTrigger>
            <DialogContent className="bg-gray-900 text-white border-gray-700">
              <DialogHeader>
                <DialogTitle>Report a Problem</DialogTitle>
                <DialogDescription className="text-gray-400">
                  Let us know what issues you found with this paper's AI processing
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4 py-2">
                <div className="space-y-2">
                  <label htmlFor="issue" className="text-sm font-medium">Issue Description</label>
                  <textarea 
                    id="issue" 
                    className="w-full h-24 p-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    placeholder="Please describe the issue you found..."
                  />
                </div>
                <Button className="w-full" onClick={(e) => e.stopPropagation()}>
                  Submit Report
                </Button>
              </div>
            </DialogContent>
          </Dialog>
          
          <DonationBox compact />
        </div>
      </div>
      
      {/* Full donation box below the disclaimer */}
      <div className="mt-4 bg-gray-900/50 border border-white/10 rounded-md p-4">
        <DonationBox />
      </div>
    </div>
  );
};

export default DisclaimerSection;

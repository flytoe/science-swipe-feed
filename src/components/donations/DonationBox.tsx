import React, { useState } from 'react';
import { Heart, CreditCard } from 'lucide-react';
import { Button } from '../ui/button';
import DonationModal from './DonationModal';
interface DonationBoxProps {
  compact?: boolean;
}
const DonationBox: React.FC<DonationBoxProps> = ({
  compact = false
}) => {
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [isSubscription, setIsSubscription] = useState(false);
  const handleShowDonation = (subscription: boolean = false) => {
    setIsSubscription(subscription);
    setShowDonationModal(true);
  };
  if (compact) {
    return <>
        
        
        <DonationModal isOpen={showDonationModal} onClose={() => setShowDonationModal(false)} isSubscription={isSubscription} />
      </>;
  }
  return <>
      <div className="flex flex-col gap-3">
        <div className="text-sm text-white/80">
          <p>Spende, um wissenschaftliche Papiere frei zugänglich zu halten</p>
        </div>
        
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/10 flex items-center gap-1.5" onClick={() => handleShowDonation(false)}>
            <CreditCard size={14} />
            Einmalig 2€ spenden
          </Button>
          
          <Button variant="outline" size="sm" className="border-white/10 hover:bg-white/10 flex items-center gap-1.5" onClick={() => handleShowDonation(true)}>
            <Heart size={14} className="text-red-400" />
            Monatlich 3€ unterstützen
          </Button>
        </div>
      </div>
      
      <DonationModal isOpen={showDonationModal} onClose={() => setShowDonationModal(false)} isSubscription={isSubscription} />
    </>;
};
export default DonationBox;